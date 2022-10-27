from django.urls import path
from . import views


urlpatterns = [
    path('', views.meals_view, name='meals'),
    path('/add', views.add_meal_view, name='add-meal'),
    path('/propositions', views.meal_propositions_view, name='meal-propositions'),
    path('/saved', views.saved_meals_view, name='saved_meals'),
    path('/data/live-search-ingredients', views.live_search_ingredients, name='live-search-ingredients'),
]