import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render

from accounts.models import UserProfile
from .models import Ingredient, IngredientUnit, Meal


# Create your views here.
@login_required(login_url='login')
def meals_view(request):
    return render(request, 'meals/meals.html')


@login_required(login_url='login')
def add_meal_view(request):
    user_profile = UserProfile.objects.get(user=request.user)
    from datetime import datetime
    today = datetime.today()
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
            check_if_ingredient_exists = Ingredient.objects.filter(en_name__icontains=query).all()
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


def test(request):
    return render(request, 'meals/test.html')

def add_ingredient(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        meal_name = request.POST.get('mealName')
        serving_unit = request.POST.get('serving_unit')
        calories = round(float(request.POST.get('calories')), 5)
        cholesterol = round(float(request.POST.get('cholesterol')), 5)
        fiber = round(float(request.POST.get('fiber')), 5)
        potassium = round(float(request.POST.get('potassium')), 5)
        saturated_fat = round(float(request.POST.get('saturated_fat')), 5)
        sodium = round(float(request.POST.get('sodium')), 5)
        sugars = round(float(request.POST.get('sugars')), 5)
        carbs = round(float(request.POST.get('carbs')), 5)
        fat = round(float(request.POST.get('fat')), 5)
        protein = round(float(request.POST.get('protein')), 5)
        serving_grams = round(float(request.POST.get('serving_grams')), 5)
        unit = IngredientUnit.objects.filter(en_name__iexact=serving_unit).first()
        if_exists = Ingredient.objects.filter(pl_name='', en_name__iexact=meal_name, kcal__iexact=calories,
                                                        unit=unit, cholesterol__iexact=cholesterol,carbs__iexact=carbs,
                                                        protein__iexact=protein, fat__iexact=fat, fiber__iexact=fiber,
                                                        saturated_fat__iexact=saturated_fat,sodium__iexact=sodium,
                                                        sugar__iexact=sugars, potassium__iexact=potassium,
                                                        serving_grams__iexact=serving_grams).first()
        if if_exists is None:
            new_ingredient = Ingredient.objects.create(pl_name='', en_name=meal_name, kcal=calories,
                                      unit=unit, cholesterol=cholesterol, carbs=carbs,
                                      protein=protein, fat=fat, fiber=fiber,
                                      saturated_fat=saturated_fat, sodium=sodium,
                                      sugar=sugars, potassium=potassium,
                                      serving_grams=serving_grams)
            new_ingredient.save()
            return JsonResponse({'status': 201})
        else:
            print(
            f"{meal_name}, {serving_unit}, {calories}, {cholesterol}, {fiber}, {potassium}, {saturated_fat}, {sodium}, {sugars}, {carbs}, {fat}, {protein}, {serving_grams}")
            return JsonResponse({'status': 302})
    else:
        return JsonResponse({'status': 404})
