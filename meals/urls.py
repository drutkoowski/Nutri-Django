from django.urls import path
from . import views


urlpatterns = [
    path('', views.meals_view, name='meals'),
    path('/add', views.add_meal_view, name='add-meal'),
    path('/propositions', views.meal_propositions_view, name='meal-propositions'),
    path('/saved', views.saved_meals_view, name='saved-meals'),
    # ajax calls
    path('/data/live-search-ingredients', views.live_search_ingredients, name='live-search-ingredients-ajax'),
    path('/data/save/added-meal', views.add_today_meal_ajax, name='add-today-meal-ajax'),
    path('/data/get/saved-meal/template', views.get_saved_meal_template, name='saved-meal-template'),
    path('/data/get/saved-meal/template/element', views.get_saved_meal_template_element, name='saved-meal-template-element'),
    path('/data/save/saved-meal/element', views.add_saved_meal_element, name='saved-meal-element-ajax'),
    path('/data/delete/added-meal', views.delete_today_meal_ajax, name='delete-today-meal-ajax'),
    # path('/test', views.test, name='test'),
    # path('/test/add', views.add_ingredient, name='add-as')
]