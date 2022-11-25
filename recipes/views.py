import re

from django.shortcuts import render


# Create your views here.
from recipes.models import Recipe


def recipes_view(request):
    import json
    with open('C:\\Users\\user\\PycharmProjects\\pythonProject30\\data.json', 'r', encoding='utf-8') as j:
        f = j.read()
    data = json.loads(f)
    i = 0
    for el in data:
        if i > 18:
            for recipe in data[i]:
                recipe_author = recipe['author']
                recipe_difficulty = recipe['difficulty']
                recipe_duration = recipe['duration']
                recipe_ingredients = recipe['ingredients']
                recipe_name = recipe['mealName']
                print(recipe_name)
                recipe_person_count = re.findall('\d+',recipe['personCount'])[0]
                check_if_exist = Recipe.objects.filter(name_pl=recipe_name, difficulty_pl=recipe_difficulty,
                                                           person_count=recipe_person_count).all()
                if check_if_exist:
                    print('nie dodano')
                else:
                    recipe_steps = recipe['steps']
                    from googletrans import Translator
                    translator = Translator()
                    recipe_name_en = translator.translate(recipe_name, dest='en').text
                    difficulty_en = translator.translate(recipe_difficulty, dest='en').text
                    recipe_ingredient_en = []
                    for ingredient in recipe_ingredients:
                        ingredient_en = translator.translate(ingredient['ingredient'], dest='en')
                        if ingredient['quantity']:
                            quantity_en = translator.translate(ingredient['quantity'], dest='en').text
                        else:
                            quantity_en = ''
                        obj = {
                            'ingredient': ingredient_en.text,
                            'quantity': quantity_en
                        }
                        recipe_ingredient_en.append(obj)
                    step_eng_arr = []
                    for step in recipe_steps:
                        step_en = translator.translate(step).text
                        step_eng_arr.append(step_en)


                    recipe = Recipe.objects.create(name_pl=recipe_name, name_en=recipe_name_en, person_count=recipe_person_count,
                                                           difficulty_pl=recipe_difficulty, difficulty_en=difficulty_en, author=recipe_author,
                                                           duration=recipe_duration, ingredients_pl=recipe_ingredients,
                                                           ingredients_en=recipe_ingredient_en, steps_en=step_eng_arr, steps_pl=recipe_steps)
                    print(recipe, ' dodano')
                    recipe.save()
        i = i + 1
        print(i)
    return render(request, 'recipes/recipes.html')
