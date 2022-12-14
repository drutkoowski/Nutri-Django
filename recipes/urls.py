from django.urls import path
from . import views


urlpatterns = [
    path('', views.recipes_view, name='recipes'),
    path('/search', views.search_recipe_view, name='search-recipe'),
    path('/add', views.add_recipe_view, name='add-recipe'),
    path('/ideas', views.recipe_ideas_view, name='recipe-ideas'),
    # ajax
    path('/live-search-recipes', views.live_search_recipes, name='live-search-recipes'),
    path('/get-recipe-info-by-id', views.get_recipe_info_by_id, name='get-recipe-info-by-id'),
    path('/get-random-recipe', views.get_random_recipe, name='get-random-recipe'),
    path('/get-recipes-by-ingredients', views.get_recipes_by_ingredients, name='get-recipes-by-ingredients'),
    path('/save/new-recipe', views.add_new_recipe, name='add_new_recipe')
]