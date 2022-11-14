from django.urls import path
from . import views


urlpatterns = [
    path('', views.workouts_view, name='workouts'),
    path('/add', views.add_workout_view, name='add-workout'),
    path('/saved', views.saved_workout_view, name='saved-workout'),
    path('/test', views.test, name='asdas'),
    # ajax
    path('/data/live-search-exercises', views.live_search_exercises, name='live_search_exercises-ajax'),
    path('/data/save/added-workout', views.add_today_exercise, name='add-today-exercise'),
    path('/data/delete/added-workout', views.delete_today_workout, name='delete-today-workout'),
    path('/data/delete/added-workout/element', views.delete_today_workout_element, name='delete-today-workout-element'),
    path('/data/add-data', views.test2, name='add-data'),
]