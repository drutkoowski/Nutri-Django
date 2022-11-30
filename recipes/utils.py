from decouple import config
import requests

from recipes.models import Recipe

API_KEY = config('API_KEY')
HEADERS = {
    "x-api-key": API_KEY,
    'includeNutrition': 'false'
}


def get_spoonacular_recipe_by_ingredient(string: str, number: int, ranking: int):
    URL = "https://api.spoonacular.com/recipes/findByIngredients"
    # ranking - 1 is maximize used ingredients
    # ranking - 2 is minimalize missing ingredients
    querystring = {"ingredients": string, "number": number, 'includeNutrition': 'false', 'ignorePantry': True, 'ranking': ranking}
    response = requests.request("GET", URL, headers=HEADERS, params=querystring)
    data = response.json()
    return data


def get_spoonacular_recipe_by_id(recipe_id: int):
    RECIPE_URL = f"https://api.spoonacular.com/recipes/{recipe_id}/information?includeNutrition=false"
    response = requests.request("GET", RECIPE_URL, headers=HEADERS)
    data = response.json()
    return data


def check_or_create_spoonacular_recipe(recipe: dict, lang_code: str) -> dict:
    is_existing = Recipe.objects.filter(name_en__iexact=recipe['name'], author=recipe['author']).first()
    is_verified = True if recipe['author'] != 'spoonacular' else False
    try:
        if is_existing is not None:
            if lang_code == 'pl':
                return {
                    'name': is_existing.name_pl,
                    'person_count': is_existing.person_count,
                    'difficulty': is_existing.difficulty_pl,
                    'author': is_existing.author,
                    'duration': is_existing.duration,
                    'ingredients': is_existing.ingredients_pl,
                    'steps': is_existing.steps_pl,
                    'verified': is_existing.verified
                }
            else:
                return {
                    'name': is_existing.name_en,
                    'person_count': is_existing.person_count,
                    'difficulty': is_existing.difficulty_en,
                    'author': is_existing.author,
                    'duration': is_existing.duration,
                    'ingredients': is_existing.ingredients_en,
                    'steps': is_existing.steps_en,
                    'verified': is_existing.verified
                }
        else:
            # spoonacular dict which this function is getting, has properties always written in ENG lang, so translate it
            # to PL using Google Translate lib
            from googletrans import Translator
            translator = Translator()
            recipe_steps_en = recipe['steps']
            recipe_name_pl = translator.translate(recipe['name'], dest='pl').text
            recipe_difficulty = None
            difficulty_pl = recipe_difficulty
            recipe_ingredients_pl = []
            recipe_ingredients_en = []
            for ingredient in recipe['ingredients']:
                quantity_pl = convert_en_spoonacular_unit(ingredient['unit'], float(ingredient['quantity']))
                ingredient_pl = translator.translate(ingredient['ingredient'], dest='pl')
                obj_pl = {
                    'ingredient': ingredient_pl.text,
                    'quantity': quantity_pl,
                }
                if float(ingredient['quantity'])% 1 == 0.0:
                    amount_en = int(ingredient['quantity'])
                else:
                    amount_en = ingredient['quantity']
                quantity_en = f"{amount_en} {ingredient['unit']}"
                ingredient_en = ingredient['ingredient']
                obj_en = {
                    'ingredient': ingredient_en,
                    'quantity': quantity_en,
                }
                recipe_ingredients_pl.append(obj_pl)
                recipe_ingredients_en.append(obj_en)
            step_pl_arr = []
            for step in recipe_steps_en:
                step_pl = translator.translate(step, dest='pl').text
                step_pl_arr.append(step_pl)

            recipe = Recipe.objects.create(name_pl=recipe_name_pl, name_en=recipe['name'],
                                           person_count=recipe['servings'],
                                           difficulty_pl=difficulty_pl, difficulty_en=recipe_difficulty,
                                           author=recipe['author'],
                                           duration=recipe['duration'], ingredients_pl=recipe_ingredients_pl,
                                           ingredients_en=recipe_ingredients_en, steps_en=recipe_steps_en,
                                           steps_pl=step_pl_arr,
                                           verified=is_verified)
            recipe.save()
            if lang_code == 'pl':
                return {
                    'name': recipe.name_pl,
                    'person_count': recipe.person_count,
                    'difficulty': recipe.difficulty_pl,
                    'author': recipe.author,
                    'duration': recipe.duration,
                    'ingredients': recipe.ingredients_pl,
                    'steps': recipe.steps_pl,
                    'verified': recipe.verified
                }
            else:
                return {
                    'name': recipe.name_en,
                    'person_count': recipe.person_count,
                    'difficulty': recipe.difficulty_en,
                    'author': recipe.author,
                    'duration': recipe.duration,
                    'ingredients': recipe.ingredients_en,
                    'steps': recipe.steps_en,
                    'verified': recipe.verified
                }

    except:
        pass


def convert_en_spoonacular_unit(unit: str, amount: float) -> str:
    unit = unit.lower()
    if amount % 1 == 0.0:
        amount = int(amount)
    if unit != '':
        unit_dict = {
            'cup': 'szklanka',
            'tablespoon': 'łyżka stołowa',
            'teaspoon': 'łyżeczka',
            'pound': 'kg',
            'ounce': 'g',
            'gallon': 'litr',
            'quart': 'litr',
            'pint': 'ml',
            'pieces': 'sztuk',
            'oz': 'g',
            'cups': 'szklanek',
            'g': 'g',
            'dekagrams': 'dekagramów',
            'servings': 'porcji',
            'tbs': 'łyżka stołowa',
            'bunch': 'garść',
            'sheets': 'opakowań/arkuszy',
            'tsps': 'łyżeczka'
        }
        new_amount = amount
        if unit == 'pound':
            new_amount = round(amount * 0.45, 2)
        elif unit == 'ounce':
            new_amount = round(amount * 28.34, 2)
        elif unit == 'gallon':
            new_amount = round(amount * 3.78, 2)
        elif unit == 'quart':
            new_amount = round(amount * 0.94, 2)
        elif unit == 'pint':
            new_amount = round(amount * 473, 2)
        elif unit == 'oz':
            new_amount = round(amount * 31.1, 2)

        if unit in unit_dict:
            new_unit = unit_dict[unit]
        else:
            from googletrans import Translator
            translator = Translator()
            new_unit = translator.translate(unit, dest='pl').text
        if new_unit:
            new_quantity_str = f"{new_amount} {new_unit}"
        else:
            new_quantity_str = f'{amount} {unit}'
        return new_quantity_str
    else:
        return f'{amount}'

