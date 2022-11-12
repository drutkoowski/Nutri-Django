from django.urls import path
from . import views


urlpatterns = [
    path('', views.workouts_view, name='workouts'),
    path('/add', views.add_workout_view, name='add-workout'),
    path('/test', views.test, name='asdas'),
    # ajax
    path('/data/live-search-exercises', views.live_search_exercises, name='live_search_exercises-ajax'),
    path('/data/add-data', views.test2, name='add-data')
]