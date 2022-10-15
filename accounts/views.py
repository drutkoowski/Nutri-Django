from django.shortcuts import render


# Create your views here.

def home_page(request):
    return render(request, 'home/index.html')


def signup_view(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
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
        print(goal_weight, activity_level, body_cm, body_kg, first_name, last_name, gender, years_old,email, username, password)

    return render(request, 'accounts/signup.html')


def login_view(request):
    return render(request, 'accounts/login.html')