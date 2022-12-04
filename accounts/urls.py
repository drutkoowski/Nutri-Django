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
    path('measurements', views.measurements_view, name='measurements'),
    # ajax views
    path('data/login-user', views.login_user, name='login-user'),
    path('data/check-if-taken', views.check_if_taken, name='check-if-taken'),
    path('data/get-user-body-params', views.get_user_body_params, name='get-user-body-params'),
    path('data/get-user-personal-info', views.get_user_personal_info, name='get-user-personal-info'),
    path('data/get/profile-nutrition-details', views.get_profile_nutrition_details, name='get-nutrition-details'),
    path('data/get/weekly-calories-info', views.get_weekly_calories_info, name='get-weekly-calories-info'),
    path('data/get/week-daily-macros', views.week_daily_macros, name='week-daily-macros'),
    path('data/get/profile-activities-date', views.get_profile_activities_date, name='get-profile-activities-date'),
    path('data/get/activity-list-by-day', views.get_activity_list_by_day, name='get-activity-list-by-day'),
    path('data/get/get-dashboard-stats-info', views.get_dashboard_stats_info, name='get-dashboard-stats-info'),
    path('data/get/get-graph-stats-info-weekly', views.get_graph_stats_info_weekly, name='get-graph-stats-info-weekly'),
    path('data/get/get-graph-stats-info-monthly', views.get_graph_stats_info_monthly, name='get-graph-stats-info-monthly'),
]