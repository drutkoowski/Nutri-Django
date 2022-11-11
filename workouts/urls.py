from django.urls import path
from . import views


urlpatterns = [
    path('', views.workouts_view, name='workouts'),
]