from django.urls import path
from . import views


urlpatterns = [
    path('', views.recipes_view, name='recipes'),
    # ajax
]