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
