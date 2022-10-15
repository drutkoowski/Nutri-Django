from django.urls import path, include
from . import views


urlpatterns = [
    path("", views.home_page, name="home-page"),
    path("signup", views.signup_view, name='signup'),
    path('login', views.login_view, name='login')
]