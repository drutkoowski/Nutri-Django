from django.urls import path, include
from . import views


urlpatterns = [
    path("", views.home_page, name="home-page"),
    path("signup", views.signup_view, name='signup'),
    path('login', views.login_view, name='login'),
    path('dashboard', views.dashboard_view, name='dashboard'),
    path('logout', views.logout_view, name='logout'),
    path('activity', views.activity_view, name='activity-calendar'),
    path('dashboard/stats', views.dashboard_stats, name='stats'),
    path('meals', views.meals_view, name='meals'),
    path('meals/add', views.add_meal_view, name='add-meal'),
    path('meals/propositions', views.meal_propositions_view, name='meal-propositions'),
    # ajax views
    path('data/login-user', views.login_user, name='login-user'),
    path('data/check-if-taken', views.check_if_taken, name='check-if-taken')

]