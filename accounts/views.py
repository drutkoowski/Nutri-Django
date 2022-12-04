import json
from datetime import date

from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.db.models import Q
from .utils import date_for_weekday, calculate_user_nutrition_demand
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


@login_required(login_url='login')
def measurements_view(request):
    return render(request, 'accounts/measurements.html')


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
def get_user_body_params(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        user_profile = UserProfile.objects.get(user=request.user)
        bmi = round(float(user_profile.weight) / ((float(user_profile.height) / 100) ** 2), 2)
        body_params_dict = {
            'height': user_profile.height,
            'weight': user_profile.weight,
            'bmi': bmi
        }
        return JsonResponse({'status': 200, 'text': 'User already exists.', 'data': json.dumps(body_params_dict)})


@login_required(login_url='login')
def get_user_personal_info(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        user_profile = UserProfile.objects.get(user=request.user)
        lang_code = request.path.split('/')[1]
        goal = user_profile.goal_weight
        level = user_profile.activity_level
        if lang_code == 'pl':
            if goal == 'gain-weight':
                translated_goal = 'Przytyć'
            elif goal == 'lose-weight':
                translated_goal = 'Schudnąć'
            elif goal == 'maintain-weight':
                translated_goal = 'Utrzymać wagę'
            else:
                translated_goal = user_profile.goal_weight
            if level == 'not-active':
                translated_level = 'Nieaktywny'
            elif level == 'lightly-active':
                translated_level = 'Lekko aktywny'
            elif level == 'active':
                translated_level = 'Aktywny'
            elif level == 'very-active':
                translated_level = 'Bardzo aktywny'
            else:
                translated_level = user_profile.activity_level
        else:
            if goal == 'gain-weight':
                translated_goal = 'Gain weight'
            elif goal == 'lose-weight':
                translated_goal = 'Lose weight'
            elif goal == 'maintain-weight':
                translated_goal = 'Maintain weight'
            else:
                translated_goal = user_profile.goal_weight
            if level == 'not-active':
                translated_level = 'Not active'
            elif level == 'lightly-active':
                translated_level = 'Lightly active'
            elif level == 'active':
                translated_level = 'Active'
            elif level == 'very-active':
                translated_level = 'Very active'
            else:
                translated_level = user_profile.activity_level
        personal_info_dict = {
            'firstName': user_profile.height,
            'lastName': user_profile.weight,
            'age': user_profile.years_old,
            'weightGoal': translated_goal,
            'activityLevel': translated_level,
            'goalKg': user_profile.goal_kg,
        }
        return JsonResponse({'status': 200, 'text': 'Operation success.', 'data': json.dumps(personal_info_dict)})


@login_required(login_url='login')
def get_profile_nutrition_details(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        user_profile = UserProfile.objects.get(user=request.user)
        final_kcal_goal = calculate_user_nutrition_demand(user_profile)
        from datetime import datetime
        all_today_meals = Meal.objects.filter(created_by=user_profile,
                                              created_at__contains=datetime.today().date()).all()
        all_today_exercises = Workout.objects.filter(created_by=user_profile,
                                                     created_at__contains=datetime.today().date()).all()
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
def week_daily_macros(request):
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


@login_required(login_url='login')
def get_dashboard_stats_info(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        user_profile = UserProfile.objects.get(user=request.user)
        date_joined = user_profile.user.date_joined.date()
        date_today = date.today()
        days_on_nutri = ((date_today - date_joined).days + 1)
        sum_kcal_eaten = []
        sum_kcal_burnt = []
        sum_eaten_carbs = []
        sum_eaten_fat = []
        sum_eaten_protein = []
        meals = Meal.objects.filter(created_by=user_profile).all()
        workouts = Workout.objects.filter(created_by=user_profile).all()
        for meal in meals:
            sum_kcal_eaten.append(meal.kcal)
            if meal.protein:
                sum_eaten_protein.append(meal.protein)
            if meal.carbs:
                sum_eaten_carbs.append(meal.carbs)
            if meal.fat:
                sum_eaten_fat.append(meal.fat)
        for workout in workouts:
            sum_kcal_burnt.append(workout.kcal_burnt_sum)
        data_dict = {
            'days': days_on_nutri,
            'sumKcalEaten': round(sum(sum_kcal_eaten), 2),
            'sumKcalBurnt': round(sum(sum_kcal_burnt), 2),
            'sumCarbsEaten': round(sum(sum_eaten_carbs), 2),
            'sumProteinEaten': round(sum(sum_eaten_protein), 2),
            'sumFatEaten': round(sum(sum_eaten_fat), 2)
        }
        return JsonResponse({'status': 200, 'text': 'Operation successful.', 'data': json.dumps(data_dict)})


@login_required(login_url='login')
def get_graph_stats_info_weekly(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        user_profile = UserProfile.objects.get(user=request.user)
        from datetime import datetime
        dt = datetime.now()
        week_day_today = dt.weekday()
        kcal_demand = calculate_user_nutrition_demand(user_profile)
        weekly_kcal_percentages = []
        weekly_protein_percentages = []
        weekly_carbs_percentages = []
        weekly_fats_percentages = []
        weekly_workout_duration = []
        weekly_kcal = []
        weekly_kcal_burnt = []
        if user_profile.activity_level == 'not-active':
            protein_multiplier = 0.9
        elif user_profile.activity_level == 'lighly-active':
            protein_multiplier = 1.2
        elif user_profile.activity_level == 'active':
            protein_multiplier = 1.6
        elif user_profile.activity_level == 'very-active':
            protein_multiplier = 2
        else:
            protein_multiplier = 1.3
        for i in range(0, week_day_today + 1):
            daily_kcal = 0
            daily_kcal_burnt = 0
            daily_workout_duration = 0
            daily_carbs = 0
            daily_fats = 0
            daily_protein = 0
            date_of_week = date_for_weekday(i)
            meals_on_day = Meal.objects.filter(created_by=user_profile, created_at__contains=date_of_week).all()
            workouts_on_day = Workout.objects.filter(created_by=user_profile, created_at__contains=date_of_week).all()
            for workout in workouts_on_day:
                daily_kcal_burnt = daily_kcal_burnt + workout.kcal_burnt_sum
                daily_workout_duration = daily_workout_duration + workout.min_spent_sum
            if workouts_on_day.exists():
                weekly_kcal_burnt.append(daily_kcal_burnt)
                weekly_workout_duration.append(daily_workout_duration)
            else:
                weekly_kcal_burnt.append(0)
                weekly_workout_duration.append(0)
            # carbs = 0.5 * kcal_goal / 4
            # protein = (0.9/1.2/1.6/2) * goal_kg
            # fats = (kcal_goal * 0.275) / 9
            for meal in meals_on_day:
                daily_kcal = daily_kcal + meal.kcal
                daily_carbs = daily_carbs + meal.carbs
                daily_fats = daily_fats + meal.fat
                daily_protein = daily_protein + meal.protein
            if meals_on_day.exists():
                weekly_kcal_percentages.append(round(daily_kcal / kcal_demand, 2) * 100)
                weekly_carbs_percentages.append(round(daily_carbs / ((0.5 * kcal_demand) / 4), 2) * 100)
                weekly_protein_percentages.append(
                    round(daily_protein / (protein_multiplier * float(user_profile.weight)), 2) * 100)
                weekly_fats_percentages.append(round((daily_fats / ((kcal_demand * 0.275) / 9)), 2) * 100)
                weekly_kcal.append(round(daily_kcal, 2))
            else:
                weekly_kcal_percentages.append(0)
                weekly_carbs_percentages.append(0)
                weekly_protein_percentages.append(0)
                weekly_fats_percentages.append(0)
                weekly_kcal.append(0)

        stats_info_dict_weekly = {
            'eatenKcal': weekly_kcal,
            'burntKcal': weekly_kcal_burnt,
            'eatenKcalPercent': weekly_kcal_percentages,
            'eatenProteinPercent': weekly_protein_percentages,
            'eatenCarbsPercent': weekly_carbs_percentages,
            'eatenFatsPercent': weekly_fats_percentages,
            'workoutDurations': weekly_workout_duration
        }
        return JsonResponse(
            {'status': 200, 'text': 'Operation successful.', 'data': json.dumps(stats_info_dict_weekly)})


@login_required(login_url='login')
def get_graph_stats_info_monthly(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        user_profile = UserProfile.objects.get(user=request.user)
        from datetime import datetime
        from calendar import monthrange
        kcal_demand = calculate_user_nutrition_demand(user_profile)
        monthly_kcal_percentages = []
        monthly_protein_percentages = []
        monthly_carbs_percentages = []
        monthly_fats_percentages = []
        monthly_duration_minutes = []
        monthly_kcal = []
        monthly_kcal_burnt = []
        if user_profile.activity_level == 'not-active':
            protein_multiplier = 0.9
        elif user_profile.activity_level == 'lighly-active':
            protein_multiplier = 1.2
        elif user_profile.activity_level == 'active':
            protein_multiplier = 1.6
        elif user_profile.activity_level == 'very-active':
            protein_multiplier = 2
        else:
            protein_multiplier = 1.3
        for i in range(1, 13):
            meals = Meal.objects.filter(created_by=user_profile, created_at__month=i).all()
            workouts = Workout.objects.filter(created_by=user_profile, created_at__month=i).all()
            monthly_kcal_eaten = 0
            monthly_kcal_burnt_sum = 0
            monthly_carbs = 0
            monthly_fats = 0
            monthly_protein = 0
            monthly_duration_sum = 0
            for meal in meals:
                month_days = monthrange(meal.created_at.year, meal.created_at.month)[1]
                monthly_kcal_eaten = monthly_kcal_eaten + meal.kcal
                monthly_carbs = monthly_carbs + meal.carbs
                monthly_fats = monthly_fats + meal.fat
                monthly_protein = monthly_protein + meal.protein
            if meals.exists():
                today = date.today()
                if i == today.month.numerator:
                    days_past_current_month = date.today().day
                    month_days = days_past_current_month
                monthly_kcal_percentages.append(round((monthly_kcal_eaten / kcal_demand) / month_days, 2) * 100)
                monthly_carbs_percentages.append(round((monthly_carbs / (0.5 * kcal_demand) / 4) / month_days, 2) * 100)
                monthly_protein_percentages.append(
                    round((monthly_protein / (protein_multiplier * float(user_profile.weight))) / month_days, 2) * 100)
                monthly_fats_percentages.append(
                    round((monthly_fats / ((kcal_demand * 0.275) / 9)) / month_days, 2) * 100)
                monthly_kcal.append(round(monthly_kcal_eaten, 2))
            else:
                monthly_kcal_percentages.append(0)
                monthly_carbs_percentages.append(0)
                monthly_protein_percentages.append(0)
                monthly_fats_percentages.append(0)
                monthly_kcal.append(0)

            for workout in workouts:
                monthly_kcal_burnt_sum = monthly_kcal_burnt_sum + workout.kcal_burnt_sum
                monthly_duration_sum = monthly_duration_sum + workout.min_spent_sum
            if workouts.exists():
                monthly_kcal_burnt.append(monthly_kcal_burnt_sum)
                monthly_duration_minutes.append(monthly_duration_sum)
            else:
                monthly_kcal_burnt.append(0)
                monthly_duration_minutes.append(0)

        stats_info_dict_monthly = {
            'eatenKcal': monthly_kcal,
            'burntKcal': monthly_kcal_burnt,
            'eatenKcalPercent': monthly_kcal_percentages,
            'eatenProteinPercent': monthly_protein_percentages,
            'eatenCarbsPercent': monthly_carbs_percentages,
            'eatenFatsPercent': monthly_fats_percentages,
            'workoutDurations': monthly_duration_minutes

        }
        return JsonResponse(
            {'status': 200, 'text': 'Operation successful.', 'data': json.dumps(stats_info_dict_monthly)})
