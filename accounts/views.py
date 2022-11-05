from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.db.models import Q
from accounts.models import Account, UserProfile
from django.utils.translation import gettext_lazy as _
from django.utils.translation import get_language, activate, gettext
# Create your views here.


def home_page(request):
    return render(request, 'home/index.html')


def signup_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == "POST":
        goal_weight = request.POST.get('goal-weight')
        activity_level = request.POST.get('activity-level')
        body_cm = request.POST.get('body-cm')
        body_kg = request.POST.get('body-kg')
        first_name = request.POST.get('first-name')
        last_name = request.POST.get('last-name')
        gender = request.POST.get('gender')
        years_old = request.POST.get('years-old')
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = Account.objects.create_user(first_name=first_name, last_name=last_name, username=username, email=email,
                                           password=password)
        user.is_active = True  # temporary
        profile = UserProfile()
        profile.user = user
        profile.activity_level = activity_level
        profile.goal_weight = goal_weight
        profile.height = body_cm
        profile.weight = body_kg
        profile.years_old = years_old
        profile.gender = gender
        profile.save()
        user.save()
    return render(request, 'accounts/signup.html')


def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    return render(request, 'accounts/login.html')


@login_required(login_url='login')
def logout_view(request):
    auth.logout(request)
    return redirect('login')


@login_required(login_url='login')
def dashboard_view(request):
    return render(request, 'accounts/dashboard.html')


@login_required(login_url='login')
def dashboard_stats(request):
    return render(request, 'accounts/dashboard_stats.html')


@login_required(login_url='login')
def activity_view(request):
    return render(request, 'accounts/activity_calendar.html')


# # # # # AJAX VIEWS # # # # #

def login_user(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        email_address = request.POST.get('emailAddress')
        password = request.POST.get('password')
        check_if_user_exists = Account.objects.filter(email__iexact=email_address).first()
        if check_if_user_exists:
            user = auth.authenticate(username=check_if_user_exists.username, password=password)
        else:
            user = None
        if user is not None:
            auth.login(request, user)
            return JsonResponse({'status': 200, 'text': 'User logged in'})
        else:
            return JsonResponse({'status': 404, 'text': 'Error while trying to log in the user'})
    else:
        return redirect('home')


def check_if_taken(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        email_address = request.GET.get('emailAddress')
        username = request.GET.get('username')
        check_if_user_exists = Account.objects.filter(
            Q(email__iexact=email_address) | Q(username__iexact=username)).first()
        if check_if_user_exists is not None:
            return JsonResponse({'status': 200, 'text': 'User already exists.'})
        else:
            return JsonResponse({'status': 404, 'text': 'User not exists.'})
    else:
        return redirect('home')
