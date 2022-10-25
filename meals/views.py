from django.shortcuts import render


# Create your views here.
def meals_view(request):
    return render(request, 'meals/meals.html')


def add_meal_view(request):
    return render(request, 'meals/add/add_meals.html')


def meal_propositions_view(request):
    return render(request, 'meals/propositions/meal_propositions.html')


def saved_meals_view(request):
    return render(request, 'meals/saved/saved_meals.html')
