import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render

from accounts.models import UserProfile
from .models import Ingredient, IngredientUnit, Meal, IngredientCategory


# Create your views here.
@login_required(login_url='login')
def meals_view(request):
    return render(request, 'meals/meals.html')


@login_required(login_url='login')
def add_meal_view(request):
    user_profile = UserProfile.objects.get(user=request.user)
    from datetime import datetime
    meals_added_today = Meal.objects.filter(created_by=user_profile, created_at__contains=datetime.today().date()).all()
    context = {
        'todayMeals': meals_added_today,
    }
    return render(request, 'meals/add/add_meals.html', context)


@login_required(login_url='login')
def meal_propositions_view(request):
    return render(request, 'meals/propositions/meal_propositions.html')


@login_required(login_url='login')
def saved_meals_view(request):
    return render(request, 'meals/saved/saved_meals.html')


# ajax calls
@login_required(login_url='login')
def live_search_ingredients(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        query = request.GET.get('query')
        if query != '':
            check_if_ingredient_exists = Ingredient.objects.filter(pl_name__istartswith=query).union(
                Ingredient.objects.filter(
                    pl_name__iregex=r"\b{0}\b".format(query)
                )).all()
            # "\y" or "\b" depends or postgres or not (\y - postgres)
            if check_if_ingredient_exists is not None:
                ingredients = list(check_if_ingredient_exists.values())
                for i in ingredients:
                    unit_id = i['unit_id']
                    unit_name = IngredientUnit.objects.filter(pk=unit_id).first()
                    i['unit_name'] = unit_name.get_unit_name_en()
                return JsonResponse({'status': 200, 'text': 'There are ingredients found.', 'ingredients': ingredients})
            else:
                return JsonResponse({'status': 404, 'text': 'There are not ingredients found.', 'ingredients': []})
        else:
            return JsonResponse({'status': 404, 'text': 'There are not ingredients found.', 'ingredients': []})


@login_required(login_url='login')
def add_today_meal_ajax(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        ingredients_array = request.POST.get('ingredientsArray')
        data_array = json.loads(ingredients_array)
        if ingredients_array is not None:
            user_profile = UserProfile.objects.filter(user=request.user).first()
            for item in data_array:
                ingredient = Ingredient.objects.filter(pk=item['ingredientId']).first()
                meal = Meal.objects.create(created_by=user_profile, quantity=item['quantity'], ingredient=ingredient)
                meal.save()
            return JsonResponse({'status': 404, 'text': 'There are not ingredients found.', 'ingredients': []})
        return JsonResponse({'status': 404, 'text': 'There are not ingredients found.', 'ingredients': []})


# def test(request):
#     import json
#
#     # Opening JSON file
#     f = open('C:\\Users\\user\\PycharmProjects\\pythonProject30\\data.json', encoding='utf-8')
#
#     # returns JSON object as
#     # a dictionary
#     data = json.load(f)
#     from googletrans import Translator
#     translator = Translator()
#     for meal in data:
#
#         kcal = meal['kcal']
#         meal_kcal = float(kcal.replace(",", '.'))
#
#         protein = meal['protein']
#         meal_protein = float(protein.replace(",", '.'))
#
#         carbs = meal['carbs']
#         meal_carbs = float(carbs.replace(",", '.'))
#
#         fat = meal['fat']
#         meal_fat = float(fat.replace(",", '.'))
#
#         meal_name = meal['mealName']
#         translation = translator.translate(meal_name, dest='en')
#         category = IngredientCategory.objects.filter(en_category_name__iexact='Oatmeal, Musli & Cereals').first()
#         unit = IngredientUnit.objects.filter(en_name__iexact='g').first()
#
#         if_exists = Ingredient.objects.filter(pl_name__iexact=meal_name, en_name__iexact=translation.text).first()
#         if_exist2 = Ingredient.objects.filter(kcal=meal_kcal,pl_name__iexact=meal_name,
#                                               unit=unit, carbs=meal_carbs,
#                                               protein=meal_protein, fat=meal_fat, serving_grams=100,
#                                               ).first()
#         # if if_exists is not None:
#         #     if_exists.delete()
#         # elif if_exist2 is not None:
#         #     if_exist2.delete()
#         if if_exists is None and if_exist2 is None:
#             new_ingredient = Ingredient.objects.create(pl_name=meal_name, en_name=translation.text, kcal=meal_kcal,
#                                                        unit=unit, carbs=meal_carbs,
#                                                        protein=meal_protein, fat=meal_fat,
#                                                         category=category,serving_grams=100,
#                                                        serving_ml=0)
#             new_ingredient.save()
#             print(f'{meal_name} dodano')
#         else:
#             print(f'{meal_name} nie dodano')
#     return render(request, 'meals/test.html')
#
#
# def add_ingredient(request):
#     if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
#         meal_name = request.POST.get('mealName')
#         serving_unit = request.POST.get('serving_unit')
#         calories = round(float(request.POST.get('calories')), 5)
#         cholesterol = round(float(request.POST.get('cholesterol')), 5)
#         fiber = round(float(request.POST.get('fiber')), 5)
#         potassium = round(float(request.POST.get('potassium')), 5)
#         saturated_fat = round(float(request.POST.get('saturated_fat')), 5)
#         sodium = round(float(request.POST.get('sodium')), 5)
#         sugars = round(float(request.POST.get('sugars')), 5)
#         carbs = round(float(request.POST.get('carbs')), 5)
#         fat = round(float(request.POST.get('fat')), 5)
#         protein = round(float(request.POST.get('protein')), 5)
#         serving_grams = round(float(request.POST.get('serving_grams')), 5)
#         serving_ml = round(float(request.POST.get('servingMl')), 5)
#         category = IngredientCategory.objects.filter(en_category_name__iexact='Meat').first()
#
#         unit = IngredientUnit.objects.filter(en_name__iexact=serving_unit).first()
#         from googletrans import Translator
#
#         translator = Translator()
#         translation = translator.translate(meal_name, dest='pl')
#         if_exists = Ingredient.objects.filter(pl_name__iexact=translation.text, en_name__iexact=meal_name).first()
#         if_exist2 = Ingredient.objects.filter(kcal=calories,
#                                               unit=unit, cholesterol=cholesterol, carbs=carbs,
#                                               protein=protein, fat=fat, fiber=fiber,
#                                               saturated_fat=saturated_fat, sodium=sodium,
#                                               sugar=sugars, potassium=potassium,
#                                               serving_grams=serving_grams).first()
#         if if_exists is None and if_exist2 is None:
#             new_ingredient = Ingredient.objects.create(pl_name=translation.text, en_name=meal_name, kcal=calories,
#                                                        unit=unit, cholesterol=cholesterol, carbs=carbs,
#                                                        protein=protein, fat=fat, fiber=fiber,
#                                                        saturated_fat=saturated_fat, sodium=sodium,
#                                                        sugar=sugars, potassium=potassium,
#                                                        serving_grams=serving_grams, category=category,
#                                                        serving_ml=serving_ml)
#             new_ingredient.save()
#             return JsonResponse({'status': 201})
#         else:
#             print(
#                 f"{meal_name}, {serving_unit}, {calories}, {cholesterol}, {fiber}, {potassium}, {saturated_fat}, {sodium}, {sugars}, {carbs}, {fat}, {protein}, {serving_grams}")
#             return JsonResponse({'status': 302})
#     else:
#         return JsonResponse({'status': 404})
