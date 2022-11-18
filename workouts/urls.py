from django.urls import path
from . import views


urlpatterns = [
    path('', views.workouts_view, name='workouts'),
    path('/add', views.add_workout_view, name='add-workout'),
    path('/saved', views.saved_workout_view, name='saved-workout'),
    path('/test', views.test, name='asdas'),
    # ajax
    path('/data/live-search-exercises', views.live_search_exercises, name='live-search-exercises-ajax'),
    path('/data/get-exercise', views.get_exercise_by_id, name='get-exercise-by-id'),
    path('/data/get/saved-workout/daily-summary', views.get_daily_summary, name='get-daily-summary'),
    path('/data/get/saved-workout/template', views.get_saved_workout_template, name='get-saved-workout-template'),
    path('/data/get/saved-workout/template/element', views.get_saved_workout_template_element, name='get-saved-workout-template-element'),
    path('/data/save/workout', views.save_workout, name='save-workout'),
    path('/data/save/workout-template', views.save_workout_template, name='save-workout-template'),
    path('/data/save/workout-template/element', views.save_workout_template_element, name='save-workout-template-element'),
    path('/data/save/added-workout', views.add_today_exercise, name='add-today-exercise'),
    path('/data/delete/saved-workout/template', views.delete_saved_workout_template, name='delete-saved-workout-template'),
    path('/data/delete/added-workout', views.delete_today_workout, name='delete-today-workout'),
    path('/data/delete/added-workout/element', views.delete_today_workout_element, name='delete-today-workout-element'),
    path('/data/delete/workout-template/element', views.delete_workout_template_element, name='delete-workout-template-element'),
    path('/data/add-data', views.test2, name='add-data'),
]