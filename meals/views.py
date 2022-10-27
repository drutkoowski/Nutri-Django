from django.http import JsonResponse
from django.shortcuts import render
from .models import Ingredient, IngredientUnit


# Create your views here.
def meals_view(request):
    return render(request, 'meals/meals.html')


def add_meal_view(request):
    return render(request, 'meals/add/add_meals.html')


def meal_propositions_view(request):
    return render(request, 'meals/propositions/meal_propositions.html')


def saved_meals_view(request):
    return render(request, 'meals/saved/saved_meals.html')


# ajax calls
def live_search_ingredients(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        query = request.GET.get('query')
        if query is not '':
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