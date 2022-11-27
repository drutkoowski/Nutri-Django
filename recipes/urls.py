from django.urls import path
from . import views


urlpatterns = [
    path('', views.recipes_view, name='recipes'),
    path('/search', views.search_recipe_view, name='search-recipe'),
    # ajax
    path('/live-search-recipes', views.live_search_recipes, name='live-search-recipes'),
    path('/get-recipe-info-by-id', views.get_recipe_info_by_id, name='get-recipe-info-by-id'),
    path('/get-random-recipe', views.get_random_recipe, name='get-random-recipe')
]