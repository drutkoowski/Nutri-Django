import json

from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.db.models import Q
from .utils import date_for_weekday
from accounts.models import Account, UserProfile
from meals.models import Meal
from workouts.models import Workout

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
        body_goal = request.POST.get('kg-goal')
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
        profile.goal_kg = body_goal
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
        return redirect('home-page')


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
        return redirect('home-page')


@login_required(login_url='login')
def get_profile_nutrition_details(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        user_profile = UserProfile.objects.get(user=request.user)
        goal_multiplier = 1.25
        if user_profile.activity_level == 'not-active':
            goal_multiplier = 1.25
        elif user_profile.activity_level == 'lightly-active':
            goal_multiplier = 1.38
        elif user_profile.activity_level == 'active':
            goal_multiplier = 1.52
        elif user_profile.activity_level == 'very-active':
            goal_multiplier = 1.65
        # Mifflin-St Jeor Equation
        if user_profile.gender == 'Male':
            basal_metabolic_rate = round(float((10 * float(user_profile.weight)) + (6.25 * float(user_profile.height)) - \
                                               (5 * float(user_profile.years_old)) + 5), 2)
        else:
            basal_metabolic_rate = round(float((10 * float(user_profile.weight)) + (6.25 * float(user_profile.height)) - \
                                               (5 * float(user_profile.years_old)) - 161), 2)
        weight_goal_metabolic_rate = basal_metabolic_rate * goal_multiplier
        gain_loss_per_week = 0.5
        weight_diff_kg = float(user_profile.weight) - float(user_profile.goal_kg)
        energy_diff = weight_diff_kg * 750 / (weight_diff_kg / gain_loss_per_week)
        final_kcal_goal = round(weight_goal_metabolic_rate + energy_diff, 2)
        from datetime import datetime
        all_today_meals = Meal.objects.filter(created_by=user_profile, created_at__contains=datetime.today().date()).all()
        all_today_exercises = Workout.objects.filter(created_by=user_profile, created_at__contains=datetime.today().date()).all()
        sum_kcal_eaten = 0
        sum_protein_eaten = 0
        sum_carbs_eaten = 0
        sum_fats_eaten = 0
        sum_kcal_burnt = 0
        if user_profile.activity_level == 'not-active':
            activity_level = 0
        elif user_profile.activity_level == 'lightly-active':
            activity_level = 1
        elif user_profile.activity_level == 'active':
            activity_level = 2
        elif user_profile.activity_level == 'very-active':
            activity_level = 3
        else:
            activity_level = 0
        for meal in all_today_meals:
            if meal.kcal:
                sum_kcal_eaten = sum_kcal_eaten + float(meal.kcal)
            if meal.carbs:
                sum_carbs_eaten = sum_carbs_eaten + float(meal.carbs)
            if meal.fat:
                sum_fats_eaten = sum_fats_eaten + float(meal.fat)
            if meal.protein:
                sum_protein_eaten = sum_protein_eaten + float(meal.protein)
        for workout in all_today_exercises:
            sum_kcal_burnt = sum_kcal_burnt + float(workout.kcal_burnt_sum)
        context = {
            'bmr': basal_metabolic_rate,
            'eatenKcal': round(sum_kcal_eaten, 2),
            'kcalGoal': final_kcal_goal,
            'eatenCarbs': round(sum_carbs_eaten, 2),
            'eatenFats': round(sum_fats_eaten, 2),
            'eatenProtein': round(sum_protein_eaten, 2),
            'activityLevel': activity_level,
            'weightKg': user_profile.weight,
            'weightGoalKg': user_profile.goal_kg,
            'burntKcal': sum_kcal_burnt,
        }
        return JsonResponse({'status': 200, 'text': 'Operation successful.', 'data': json.dumps(context)})
    else:
        return redirect('home-page')


@login_required(login_url='login')
def get_weekly_calories_info(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        user_profile = UserProfile.objects.get(user=request.user)
        from datetime import datetime
        dt = datetime.now()
        week_day_today = dt.weekday()
        weekly_kcal_info = []
        for i in range(0, week_day_today + 1):
            date_of_week = date_for_weekday(i)
            meals_on_week = Meal.objects.filter(created_by=user_profile, created_at__contains=date_of_week).all()
            kcal_eaten_sum = 0
            for meal in meals_on_week:
                kcal_eaten_sum = kcal_eaten_sum + float(meal.kcal)
            daily_dict = {
                'dayKcal': kcal_eaten_sum
            }
            weekly_kcal_info.append(daily_dict)
        data = json.dumps(weekly_kcal_info)
        return JsonResponse({'status': 200, 'text': 'Operation successful.', 'data': data})


@login_required(login_url='login')
def week_daily_macros_eaten(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        user_profile = UserProfile.objects.get(user=request.user)
        from datetime import datetime
        dt = datetime.now()
        week_day_today = dt.weekday()
        weekly_kcal_info = []
        for i in range(0, week_day_today + 1):
            date_of_week = date_for_weekday(i)
            meals_on_week = Meal.objects.filter(created_by=user_profile, created_at__contains=date_of_week).all()
            kcal_eaten_sum = 0
            carbs_eaten_sum = 0
            protein_eaten_sum = 0
            fat_eaten_sum = 0
            for meal in meals_on_week:
                kcal_eaten_sum = kcal_eaten_sum + float(meal.kcal)
                carbs_eaten_sum = carbs_eaten_sum + float(meal.carbs)
                protein_eaten_sum = protein_eaten_sum + float(meal.protein)
                fat_eaten_sum = fat_eaten_sum + float(meal.fat)
            daily_dict = {
                'dayKcal': round(kcal_eaten_sum, 2),
                'dayCarbs': round(carbs_eaten_sum, 2),
                'dayProtein': round(protein_eaten_sum, 2),
                'dayFat': round(fat_eaten_sum, 2),
            }
            weekly_kcal_info.append(daily_dict)
        data = json.dumps(weekly_kcal_info)
        return JsonResponse({'status': 200, 'text': 'Operation successful.', 'data': data})


@login_required(login_url='login')
def get_profile_activities_date(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        user_profile = UserProfile.objects.get(user=request.user)
        all_activity_dates = []
        meals = Meal.objects.filter(created_by=user_profile).all()
        exercises = Workout.objects.filter(created_by=user_profile).all()
        for meal in meals:
            day = meal.created_at.day
            month = meal.created_at.month
            year = meal.created_at.year
            date = f"{year}-{month}-{day}"
            if date not in all_activity_dates:
                all_activity_dates.append(date)
        for exercise in exercises:
            day = exercise.created_at.day
            month = exercise.created_at.month
            year = exercise.created_at.year
            date = f"{year}-{month}-{day}"
            if date not in all_activity_dates:
                all_activity_dates.append(date)
        data = json.dumps(all_activity_dates)
        return JsonResponse({'status': 200, 'text': 'Operation successful.', "data": data})


@login_required(login_url='login')
def get_activity_list_by_day(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        user_profile = UserProfile.objects.get(user=request.user)
        date = request.POST.get('date')
        meals = Meal.objects.filter(created_by=user_profile, created_at__contains=date).all()
        meals_arr = []
        kcal_eaten_sum = 0
        carbs_eaten_sum = 0
        protein_eaten_sum = 0
        fat_eaten_sum = 0
        for meal in meals:
            kcal_eaten_sum = kcal_eaten_sum + meal.kcal
            carbs_eaten_sum = carbs_eaten_sum + meal.carbs
            protein_eaten_sum = protein_eaten_sum + meal.protein
            fat_eaten_sum = fat_eaten_sum + meal.fat
            meal_obj = {
                'ingredientNameEn': meal.ingredient.en_name,
                'ingredientNamePl': meal.ingredient.pl_name,
                'quantity': meal.quantity,
                'unitNamePl': meal.ingredient.unit.pl_name,
                'unitNameEn': meal.ingredient.unit.en_name,
                'kcal': round(meal.kcal, 2),
                'carbs': round(meal.carbs, 2),
                'protein': round(meal.protein, 2),
                'fat': round(meal.fat, 2),
            }
            meals_arr.append(meal_obj)
        exercises = Workout.objects.filter(created_by=user_profile, created_at__contains=date).all()
        exercises_arr = []
        for exercise in exercises:
            elements_arr = []
            for element in exercise.workout_elements.all():
                element_obj = {
                    'exerciseNamePl': element.exercise.pl_name,
                    'exerciseNameEn': element.exercise.en_name,
                    'kcalBurnt': round(element.kcal_burnt, 2),
                    'duration': round(element.min_spent, 2),
                }
                elements_arr.append(element_obj)
            exercise_obj = {
                'exerciseElements': elements_arr,
                'kcalBurntSum': round(exercise.kcal_burnt_sum, 2),
                'durationSum': round(exercise.min_spent_sum, 2),
             }
            exercises_arr.append(exercise_obj)
        data = {
            'exercises': json.dumps(exercises_arr),
            'meals': json.dumps(meals_arr),
            'eatenKcalSum': round(kcal_eaten_sum, 2),
            'eatenCarbsSum': round(carbs_eaten_sum, 2),
            'eatenProteinSum': round(protein_eaten_sum, 2),
            'eatenFatSum': round(fat_eaten_sum, 2)
        }
        return JsonResponse({'status': 200, 'text': 'Operation successful.', 'data': data})