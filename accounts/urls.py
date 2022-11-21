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
    # ajax views
    path('data/login-user', views.login_user, name='login-user'),
    path('data/check-if-taken', views.check_if_taken, name='check-if-taken'),
    path('data/get/profile-nutrition-details', views.get_profile_nutrition_details, name='get-nutrition-details')
]