import json
import re

from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import JsonResponse

from Nutri.settings import DEBUG
from accounts.models import UserProfile
from recipes.models import Recipe
from django.shortcuts import render, redirect

# Create your views here.
from recipes.utils import get_spoonacular_recipe_by_ingredient, get_spoonacular_recipe_by_id, \
    check_or_create_spoonacular_recipe, translate_recipe_name, translate_recipe_steps, translate_recipe_ingredients, \
    translate_recipe_difficulty_to_pl


@login_required(login_url='login')
def recipes_view(request):
    return render(request, 'recipes/recipes.html')


@login_required(login_url='login')
def add_recipe_view(request):
    return render(request, 'recipes/add/add_recipes.html')


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
        is_verified = str(request.GET.get('isVerified'))
        if is_verified == 'true':
            is_verified = True
        else:
            is_verified = False
        if query != '':
            if lang_code == 'pl' and is_verified is True:
                if DEBUG is True:
                    check_if_recipe_exists = Recipe.objects.filter(
                        Q(name_pl__istartswith=query) | Q(name_pl__icontains=query) & Q(verified=is_verified))
                else:
                    check_if_recipe_exists = Recipe.objects.filter(name_pl__search=query).all()
                    if check_if_recipe_exists.count() == 0:
                        check_if_recipe_exists = Recipe.objects.filter(pl_name__istartswith=query).all()
            if lang_code == 'pl' and is_verified is False:
                if DEBUG is True:
                    check_if_recipe_exists = Recipe.objects.filter(Q(name_pl__istartswith=query) | Q(name_pl__icontains=query))
                else:
                    check_if_recipe_exists = Recipe.objects.filter(name_pl__search=query).all()
                    if check_if_recipe_exists.count() == 0:
                        check_if_recipe_exists = Recipe.objects.filter(pl_name__istartswith=query).all()
            if lang_code == 'en' and is_verified is True:
                if DEBUG is True:
                    check_if_recipe_exists = Recipe.objects.filter(
                        Q(name_en__istartswith=query) | Q(name_en__icontains=query) & Q(verified=is_verified))
                else:
                    check_if_recipe_exists = Recipe.objects.filter(name_en__search=query, verified=True).all()
                    if check_if_recipe_exists.count() == 0:
                        check_if_recipe_exists = Recipe.objects.filter(en_name__istartswith=query, verified=True).all()
            if lang_code == 'en' and is_verified is False:
                if DEBUG is True:
                    check_if_recipe_exists = Recipe.objects.filter(
                        Q(name_en__istartswith=query) | Q(name_en__icontains=query))
                else:
                    check_if_recipe_exists = Recipe.objects.filter(name_en__search=query).all()
                    if check_if_recipe_exists.count() == 0:
                        check_if_recipe_exists = Recipe.objects.filter(en_name__istartswith=query).all()
            # "\y" or "\b" depends on postgres or not (\y - postgres)
            if check_if_recipe_exists is not None and check_if_recipe_exists.count() > 0:
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
                            'id': recipe['id'],
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
def add_new_recipe(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        lang_code = request.path.split('/')[1]
        user_profile = UserProfile.objects.get(user=request.user)
        recipe_name = request.POST.get('recipeName')
        recipe_difficulty = request.POST.get('recipeDifficulty')
        recipe_duration = request.POST.get('recipeDuration')
        recipe_servings = request.POST.get('recipeServings')
        recipe_steps = json.loads(request.POST.get('recipeSteps'))
        recipe_ingredients = json.loads(request.POST.get('recipeIngredients'))
        recipe = Recipe()
        ingredients_dict = {
            'ingredient': recipe_ingredients[0]['ingredient'],
            'quantity': recipe_ingredients[0]['quantity']
        }
        try:
            if lang_code == 'pl':
                recipe.name_pl = recipe_name
                recipe.name_en = translate_recipe_name(recipe_name, 'en')
                recipe.difficulty_pl = translate_recipe_difficulty_to_pl(recipe_difficulty)
                recipe.difficulty_en = recipe_difficulty
                recipe.ingredients_pl = ingredients_dict
                recipe.ingredients_en = translate_recipe_ingredients(recipe_ingredients, 'en')
                recipe.steps_pl = recipe_steps
                recipe.steps_en = translate_recipe_steps(recipe_steps, 'en')
            else:
                recipe.name_en = recipe_name
                recipe.name_pl = translate_recipe_name(recipe_name, 'pl')
                recipe.difficulty_en = recipe_difficulty
                recipe.difficulty_pl = translate_recipe_difficulty_to_pl(recipe_difficulty)
                recipe.ingredients_en = recipe_ingredients
                recipe.ingredients_pl = translate_recipe_ingredients(recipe_ingredients, 'pl')
                recipe.steps_en = recipe_steps
                recipe.steps_pl = translate_recipe_steps(recipe_steps, 'pl')
            recipe.duration = recipe_duration
            recipe.person_count = recipe_servings
            recipe.author = user_profile.user.username
            recipe.verified = False
            check_if_existing = Recipe.objects.filter(Q(name_pl__iexact=recipe.name_pl) | Q(name_en__iexact=recipe.name_en)).all()
            if check_if_existing is not None and check_if_existing.count() > 0:
                return JsonResponse({'status': 400, 'text': 'Recipe not created.'})
            else:
                recipe.save()
            return JsonResponse({'status': 200, 'text': 'Recipe created.'})
        except:
            return JsonResponse({'status': 400, 'text': 'Recipe not created.'})


@login_required(login_url='login')
def get_recipe_info_by_id(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        recipe_id = request.GET.get('recipeId')
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
                    'steps': recipe.steps_pl,
                    'verified': recipe.verified
                }
            else:
                recipe_dict = {
                    'name': recipe.name_en,
                    'person_count': recipe.person_count,
                    'difficulty': recipe.difficulty_en,
                    'author': recipe.author,
                    'duration': recipe.duration,
                    'ingredients': recipe.ingredients_en,
                    'steps': recipe.steps_en,
                    'verified': recipe.verified
                }
            recipe_json = json.dumps(recipe_dict)
            return JsonResponse({'status': 200, 'text': 'There are recipe found.', 'recipe': recipe_json})
        except:
            return JsonResponse({'status': 400, 'text': 'There are not recipe found.', 'recipe': ''})


@login_required(login_url='login')
def get_random_recipe(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        lang_code = request.path.split('/')[1]
        is_verified = request.GET.get('isVerified')
        if is_verified == 'true':
            is_verified = True
        else:
            is_verified = False
        import random
        try:
            recipes = list(Recipe.objects.filter(verified=is_verified).all())
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
        blocked_suggestions_ids = json.loads(request.POST.get('blockedSuggestionsArray'))
        blocked_db_suggestions_ids = json.loads(request.POST.get('blockedDbSuggestionsArray'))
        focus_on = request.POST.get('focusOn')
        if lang_code == 'pl':
            from googletrans import Translator
            translator = Translator()
            ingredients_string = translator.translate(ingredients_string, dest='en').text
        # getting recipes from API
        data, suggestion_recipe_id = get_spoonacular_recipe_by_ingredient(ingredients_string, 1, focus_on,
                                                                          blocked_suggestions_ids)  # gets recipe by ingredient
        recipes_arr = []
        for recipe_ids in data:
            recipe_id = int(recipe_ids['id'])
            try:
                data_recipe = get_spoonacular_recipe_by_id(recipe_id)  # gets recipe info by id
                recipe_ingredients = []
                for ingredient in data_recipe['extendedIngredients']:
                    unit = ingredient['unit']
                    ingredient_dict = {
                        "ingredient": ingredient['originalName'],
                        "quantity": ingredient['amount'],
                        'unit': unit
                    }
                    recipe_ingredients.append(ingredient_dict)
                recipe_steps = []
                for step in data_recipe['analyzedInstructions'][0]['steps']:
                    recipe_steps.append(step['step'])
                recipe_dict = {
                    "recipeId": suggestion_recipe_id,
                    "from": 'api',
                    "name": data_recipe['title'],
                    "duration": f"{data_recipe['readyInMinutes']} min.",
                    "ingredients": recipe_ingredients,
                    "steps": recipe_steps,
                    "servings": data_recipe['servings'],
                    'author': 'spoonacular',
                    'isVerified': False,
                }
                recipe_dict = check_or_create_spoonacular_recipe(recipe_dict, lang_code)
                recipes_arr.append(recipe_dict)
            except:
                pass
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
                            if re.search(rf'\b{i.strip()}\b',
                                         ingredient_name.lower()) and i.strip() not in similarities_arr:
                                similarities = similarities + 1
                                similarities_arr.append(i.strip())
                else:
                    for ingredient in db_recipe.ingredients_en:
                        ingredient_name = ingredient['ingredient']
                        for i in ingredients_arr:
                            if re.search(rf'\b{i.strip()}\b',
                                         ingredient_name.lower()) and i.strip() not in similarities_arr:
                                similarities = similarities + 1
                                similarities_arr.append(i.strip())
                if focus_on == 1:
                    similarity_percentage = (similarities / len(ingredients_arr)) * 100
                elif focus_on == 2:
                    similarity_percentage = (similarities / len(db_recipe.ingredients_pl)) * 100
                else:
                    similarity_percentage = (similarities / len(ingredients_arr)) * 100
                # print(similarities, len(ingredients_arr),similarity_percentage)
                if similarity_percentage > max_similarity_percentage and db_recipe.pk not in blocked_db_suggestions_ids:
                    max_similarity_percentage = similarity_percentage
                    suggested_db_recipe = db_recipe

                elif second_max_similarity_percentage < similarity_percentage < max_similarity_percentage \
                        and db_recipe.pk not in blocked_db_suggestions_ids:

                    second_max_similarity_percentage = similarity_percentage
                    additional_db_recipe = db_recipe

            if additional_db_recipe is not None and len(suggested) < 2 and additional_db_recipe not in suggested:
                # print(additional_db_recipe.name_pl)
                suggested.append(additional_db_recipe)
            if suggested_db_recipe is not None and len(suggested) < 2 and suggested_db_recipe not in suggested:
                # print(suggested_db_recipe.name_pl)
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
                            'isVerified': recipe.verified,
                            'dbId': recipe.pk
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
                            'isVerified': recipe.verified,
                            'dbId': recipe.pk
                        }
                    recipes_arr.append(recipe_obj)
        if len(recipes_arr) > 0:
            return JsonResponse({'status': 200, 'text': 'There are recipes found.', 'recipes': json.dumps(recipes_arr)})
        else:
            return JsonResponse({'status': 404, 'text': 'There are no recipes found.', 'recipes': ''})
    else:
        return JsonResponse({'status': 405, 'text': 'Method not allowed', 'recipes': ''})
