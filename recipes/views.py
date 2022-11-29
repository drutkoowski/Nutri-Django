import json
import re

from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import JsonResponse

from recipes.models import Recipe
from django.shortcuts import render, redirect


# Create your views here.
from recipes.utils import get_spoonacular_recipe_by_ingredient, get_spoonacular_recipe_by_id, \
    check_or_create_spoonacular_recipe, convert_en_spoonacular_unit


@login_required(login_url='login')
def recipes_view(request):
    # import json
    # with open('C:\\Users\\user\\PycharmProjects\\pythonProject30\\data.json', 'r', encoding='utf-8') as j:
    #     f = j.read()
    # data = json.loads(f)
    # i = 0
    # for el in data:
    #     if i > 5:
    #         for recipe in data[i]:
    #             try:
    #                 recipe_author = recipe['author']
    #                 recipe_difficulty = recipe['difficulty']
    #                 recipe_duration = recipe['duration']
    #                 recipe_ingredients = recipe['ingredients']
    #                 recipe_name = recipe['mealName']
    #                 print(recipe_name)
    #                 recipe_person_count = re.findall('\d+',recipe['personCount'])[0]
    #                 check_if_exist = Recipe.objects.filter(name_pl__iexact=recipe_name, difficulty_pl=recipe_difficulty).count()
    #                 if check_if_exist != 0:
    #                     print('nie dodano22')
    #                 else:
    #                     recipe_steps = recipe['steps']
    #                     from googletrans import Translator
    #                     translator = Translator()
    #                     recipe_name_en = translator.translate(recipe_name, dest='en').text
    #                     difficulty_en = translator.translate(recipe_difficulty, dest='en').text
    #                     recipe_ingredient_en = []
    #                     for ingredient in recipe_ingredients:
    #                         ingredient_en = translator.translate(ingredient['ingredient'], dest='en')
    #                         if ingredient['quantity']:
    #                             quantity_en = translator.translate(ingredient['quantity'], dest='en').text
    #                         else:
    #                             quantity_en = ''
    #                         obj = {
    #                             'ingredient': ingredient_en.text,
    #                             'quantity': quantity_en
    #                         }
    #                         recipe_ingredient_en.append(obj)
    #                     step_eng_arr = []
    #                     for step in recipe_steps:
    #                         step_en = translator.translate(step).text
    #                         step_eng_arr.append(step_en)
    #
    #
    #                     recipe = Recipe.objects.create(name_pl=recipe_name, name_en=recipe_name_en, person_count=recipe_person_count,
    #                                                            difficulty_pl=recipe_difficulty, difficulty_en=difficulty_en, author=recipe_author,
    #                                                            duration=recipe_duration, ingredients_pl=recipe_ingredients,
    #                                                            ingredients_en=recipe_ingredient_en, steps_en=step_eng_arr, steps_pl=recipe_steps)
    #                     print(recipe, ' dodano')
    #                     recipe.save()
    #             except Exception as e:
    #                 print('nie dodano')
    #                 print(e)
    #     i = i + 1
    #     print(i)
    return render(request, 'recipes/recipes.html')


@login_required(login_url='login')
def search_recipe_view(request):
    return render(request, 'recipes/search/search_recipes.html')


@login_required(login_url='login')
def recipe_ideas_view(request):
    return render(request, 'recipes/ideas/recipes_ideas.html')


# ajax views

@login_required(login_url='login')
def live_search_recipes(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        query = request.GET.get('query')
        lang_code = request.path.split('/')[1]
        if query != '':
            if (lang_code == 'pl'):
                check_if_recipe_exists = Recipe.objects.filter(
                    Q(name_pl__istartswith=query) | Q(name_pl__icontains=query) & Q(verified=True))
                # check_if_recipe_exists = Recipe.objects.filter(
                #     name_pl__iregex=r"\b{0}\b".format(query)).all().union(
                #     Recipe.objects.filter(
                #         name_pl__istartswith=query
                #     )).all().union(
                #     Recipe.objects.filter(
                #         name_pl__icontains=query
                #     )).all()
            else:
                check_if_recipe_exists = Recipe.objects.filter(
                    Q(name_en__istartswith=query) | Q(name_en__icontains=query) & Q(verified=True))
                # check_if_recipe_exists = Recipe.objects.filter(
                #     name_en__iregex=r"\b{0}\b".format(query)).all().union(
                #     Recipe.objects.filter(
                #         name_en__istartswith=query
                #     )).all().union(
                #     Recipe.objects.filter(
                #         name_en__icontains=query
                #     )).all()

            # "\y" or "\b" depends on postgres or not (\y - postgres)
            if check_if_recipe_exists is not None:
                recipes = list(check_if_recipe_exists.values())
                recipes_arr = []
                for recipe in recipes:
                    if lang_code == 'pl':
                        recipes_dict = {
                            'id': recipe['id'],
                            'name': recipe['name_pl'],
                            'person_count': recipe['person_count'],
                            'difficulty': recipe['difficulty_pl'],
                            'duration': recipe['duration'],
                        }
                    else:
                        recipes_dict = {
                            'name': recipe['name_en'],
                            'person_count': recipe['person_count'],
                            'difficulty': recipe['difficulty_en'],
                            'duration': recipe['duration'],
                        }
                    recipes_arr.append(recipes_dict)

                return JsonResponse(
                    {'status': 200, 'text': 'There are recipes found.', 'recipes': json.dumps(recipes_arr)})
            else:
                return JsonResponse({'status': 404, 'text': 'There are not recipes found.', 'recipes': []})
        else:
            return JsonResponse({'status': 404, 'text': 'There are not recipes found.', 'recipes': []})
    else:
        return redirect('home')


@login_required(login_url='login')
def get_recipe_info_by_id(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        recipe_id = request.POST.get('recipeId')
        lang_code = request.path.split('/')[1]
        try:
            recipe = Recipe.objects.get(pk=recipe_id)
            if lang_code == 'pl':
                recipe_dict = {
                    'name': recipe.name_pl,
                    'person_count': recipe.person_count,
                    'difficulty': recipe.difficulty_pl,
                    'author': recipe.author,
                    'duration': recipe.duration,
                    'ingredients': recipe.ingredients_pl,
                    'steps': recipe.steps_pl
                }
            else:
                recipe_dict = {
                    'name': recipe.name_en,
                    'person_count': recipe.person_count,
                    'difficulty': recipe.difficulty_en,
                    'author': recipe.author,
                    'duration': recipe.duration,
                    'ingredients': recipe.ingredients_en,
                    'steps': recipe.steps_en
                }
            recipe_json = json.dumps(recipe_dict)
            return JsonResponse({'status': 200, 'text': 'There are recipe found.', 'recipe': recipe_json})
        except:
            return JsonResponse({'status': 400, 'text': 'There are not recipe found.', 'recipe': ''})


@login_required(login_url='login')
def get_random_recipe(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        lang_code = request.path.split('/')[1]
        import random
        try:
            recipes = list(Recipe.objects.filter(verified=True).all())
            random_recipe = random.choice(recipes)
            if lang_code == 'pl':
                recipe_dict = {
                    'name': random_recipe.name_pl,
                    'person_count': random_recipe.person_count,
                    'difficulty': random_recipe.difficulty_pl,
                    'author': random_recipe.author,
                    'duration': random_recipe.duration,
                    'ingredients': random_recipe.ingredients_pl,
                    'steps': random_recipe.steps_pl
                }
            else:
                recipe_dict = {
                    'name': random_recipe.name_en,
                    'person_count': random_recipe.person_count,
                    'difficulty': random_recipe.difficulty_en,
                    'author': random_recipe.author,
                    'duration': random_recipe.duration,
                    'ingredients': random_recipe.ingredients_en,
                    'steps': random_recipe.steps_en
                }
            recipe_json = json.dumps(recipe_dict)
            return JsonResponse({'status': 200, 'text': 'Operation successful.', 'recipe': recipe_json})
        except:
            return JsonResponse({'status': 400, 'text': 'Operation not successful.', 'recipe': ''})


@login_required(login_url='login')
def get_recipes_by_ingredients(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        lang_code = request.path.split('/')[1]
        ingredients_arr = json.loads(request.POST.get('ingredients'))
        ingredients_string = request.POST.get('ingredientsString')
        if lang_code == 'pl':
            from googletrans import Translator
            translator = Translator()
            ingredients_string = translator.translate(ingredients_string, dest='en').text
        print(ingredients_arr)
        # getting recipes from API
        data = get_spoonacular_recipe_by_ingredient(ingredients_string, 1)  # gets recipe by ingredient
        recipes_arr = []
        for recipe_ids in data:
            recipe_id = int(recipe_ids['id'])
            data_recipe = get_spoonacular_recipe_by_id(recipe_id)  # gets recipe info by id
            recipe_ingredients = []
            for ingredient in data_recipe['extendedIngredients']:
                unit = ingredient['unit']
                # quantity = convert_en_spoonacular_unit(unit, float(ingredient['amount']))
                ingredient_dict = {
                    "ingredient": ingredient['originalName'],
                    "quantity": ingredient['amount'],
                    'unit': unit
                }
                recipe_ingredients.append(ingredient_dict)
            recipe_steps = []
            for step in data_recipe['analyzedInstructions'][0]['steps']:
                recipe_steps.append(step['step'])
            print('recipe name: ', data_recipe['title'])
            recipe_dict = {
                "recipeId": recipe_id,
                "from": 'api',
                "name": data_recipe['title'],
                "duration": f"{data_recipe['readyInMinutes']} min.",
                "ingredients": recipe_ingredients,
                "steps": recipe_steps,
                "servings": data_recipe['servings'],
                'author': 'spoonacular',
                'isVerified': False
            }
            recipe_dict = check_or_create_spoonacular_recipe(recipe_dict, lang_code)
            recipes_arr.append(recipe_dict)
            # END API fetch

            # check if any similarities in db recipes
            db_recipes = Recipe.objects.all()
            max_similarity_percentage = 0
            second_max_similarity_percentage = 0
            suggested_db_recipe = None
            additional_db_recipe = None
            suggested = []
            for db_recipe in db_recipes:
                similarities = 0
                similarities_arr = []
                if lang_code == 'pl':
                    for ingredient in db_recipe.ingredients_pl:
                        ingredient_name = ingredient['ingredient']
                        for i in ingredients_arr:
                            if re.search(rf'\b{i.strip()}\b', ingredient_name.lower()) and i.strip() not in similarities_arr:
                                similarities = similarities + 1
                                similarities_arr.append(i.strip())
                else:
                    for ingredient in db_recipe.ingredients_en:
                        ingredient_name = ingredient['ingredient']
                        for i in ingredients_arr:
                            if re.search(rf'\b{i.strip()}\b', ingredient_name.lower()) and i.strip() not in similarities_arr:
                                similarities = similarities + 1
                                similarities_arr.append(i.strip())
                similarity_percentage = (similarities / len(ingredients_arr)) * 100
                if similarity_percentage > max_similarity_percentage:
                    max_similarity_percentage = similarity_percentage
                    suggested_db_recipe = db_recipe
                elif similarity_percentage > second_max_similarity_percentage and similarity_percentage < max_similarity_percentage:
                    second_max_similarity_percentage = similarity_percentage
                    additional_db_recipe = db_recipe
                    print(additional_db_recipe)
                if additional_db_recipe is not None and len(suggested) < 2 and additional_db_recipe not in suggested:
                    suggested.append(additional_db_recipe)
                if suggested_db_recipe is not None and len(suggested) < 2 and suggested_db_recipe not in suggested:
                    suggested.append(suggested_db_recipe)
            if len(suggested) > 0:
                for recipe in suggested:
                    if lang_code == 'pl':
                        recipe_obj = {
                            "recipeId": recipe.pk,
                            "from": 'db',
                            'name': recipe.name_pl,
                            'person_count': recipe.person_count,
                            'difficulty': recipe.difficulty_pl,
                            'author': recipe.author,
                            'duration': recipe.duration,
                            'ingredients': recipe.ingredients_pl,
                            'steps': recipe.steps_pl,
                            'isVerified': recipe.verified
                        }
                    else:
                        recipe_obj = {
                            "recipeId": recipe.pk,
                            "from": 'db',
                            'name': recipe.name_en,
                            'person_count': recipe.person_count,
                            'difficulty': recipe.difficulty_en,
                            'author': recipe.author,
                            'duration': recipe.duration,
                            'ingredients': recipe.ingredients_en,
                            'steps': recipe.steps_en,
                            'isVerified': recipe.verified
                        }
                    recipes_arr.append(recipe_obj)
        return JsonResponse({'status': 200, 'text': 'There are recipes found.', 'recipes': json.dumps(recipes_arr)})