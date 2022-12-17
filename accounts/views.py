import json
from datetime import date
from django.core.mail import EmailMessage
from django.contrib import auth, messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.db.models import Q
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from Nutri.settings import EMAIL_HOST_USER
from .utils import date_for_weekday, calculate_user_nutrition_demand, edit_info_parameter_by_type, \
    get_measure_changes_yearly, get_changes_on_month, format_to_iso_date
from accounts.models import Account, UserProfile
from meals.models import Meal
from workouts.models import Workout


# Create your views here.


def home_page(request):
    how_many_users = UserProfile.objects.all().count()
    context = {
        'users_count': how_many_users
    }
    return render(request, 'home/index.html', context)


def signup_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == "POST":
        lang_code = request.path.split('/')[1]
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
        current_site = get_current_site(request)
        if lang_code == 'pl':
            mail_subject = 'Nutri, aktywacja Twojego konta'
            message = render_to_string("accounts/emails/account_verification_email_pl.html", {
                "user": user,
                "domain": current_site,
                "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                "token": default_token_generator.make_token(user),

            })
        else:
            mail_subject = "Nutri, activation your account"
            message = render_to_string("accounts/emails/account_verification_email.html", {
                "user": user,
                "domain": current_site,
                "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                "token": default_token_generator.make_token(user),

            }, request=request)
        to_email = email
        send_email = EmailMessage(from_email=EMAIL_HOST_USER, subject=mail_subject, body=message, to=[to_email])
        send_email.send()
        # user.is_active = True  # temporary
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


def forgot_password_view(request):
    return render(request, 'accounts/forgot_password.html')


def resetpassword_validate(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = Account._default_manager.get(pk=uid)
    except(TypeError, ValueError, OverflowError, Account.DoesNotExist):
        user = None
    if user is not None and default_token_generator.check_token(user, token):
        request.session['uid'] = uid
        return redirect('reset-password')
    else:
        messages.error(request, "This link has been expired!")
        return redirect("login")


def reset_password_view(request):
    return render(request, 'accounts/reset_password.html')


def activate(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = Account._default_manager.get(pk=uid)
    except (TypeError, ValueError, OverflowError, Account.DoesNotExist):
        user = None
    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return redirect('login')
    else:
        return redirect("signup")


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
def dashboard_stats_view(request):
    return render(request, 'accounts/dashboard_stats.html')


@login_required(login_url='login')
def activity_view(request):
    return render(request, 'accounts/activity_calendar.html')


@login_required(login_url='login')
def profile_info_view(request):
    return render(request, 'accounts/profile_info.html')


def error_404(request, exception):
    return render(request, '404.html', status=404)


def error_500(request, *args):
    return render(request, '500.html')


# # # # # AJAX VIEWS # # # # #

def login_user(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        email_address = request.POST.get('emailAddress')
        password = request.POST.get('password')
        check_if_user_exists = Account.objects.filter(email__iexact=email_address).first()
        if not check_if_user_exists.is_active:
            return JsonResponse({'status': 405, 'text': 'User not verified'})
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


def forgot_password(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        user_profile_email = request.POST.get('emailAddress')
        check_if_user_exists = Account.objects.filter(email__iexact=user_profile_email).first()
        if check_if_user_exists:
            if not check_if_user_exists.is_active:
                return JsonResponse({'status': 405, 'text': 'User not verified'})
            current_site = get_current_site(request)
            lang_code = request.path.split('/')[1]
            if lang_code == 'pl':
                mail_subject = "Nutri: Zresetuj swoje hasło"
                message = render_to_string("accounts/emails/reset_password_pl.html", {
                    "user": check_if_user_exists,
                    "domain": current_site,
                    "uid": urlsafe_base64_encode(force_bytes(check_if_user_exists.pk)),
                    "token": default_token_generator.make_token(check_if_user_exists),
                })
            else:
                mail_subject = "Reset your password"
                message = render_to_string("accounts/emails/reset_password.html", {
                    "user": check_if_user_exists,
                    "domain": current_site,
                    "uid": urlsafe_base64_encode(force_bytes(check_if_user_exists.pk)),
                    "token": default_token_generator.make_token(check_if_user_exists),
                })
            to_email = check_if_user_exists.email
            send_email = EmailMessage(from_email=EMAIL_HOST_USER, subject=mail_subject, body=message, to=[to_email])
            send_email.send()
            return JsonResponse({'status': 200, 'text': 'Email sent.'})
        else:
            return JsonResponse({'status': 404, 'text': 'User not found.'})
    else:
        return JsonResponse({'status': 405, 'text': 'Method not allowed.'})


def reset_password_ajax(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        try:
            password = request.POST.get('password')
            uid = request.session.get("uid")
            user = Account.objects.get(pk=uid)
            user.set_password(password)
            user.save()
            return JsonResponse({'status': 200, 'text': 'User password changed.'})
        except:
            return JsonResponse({'status': 405, 'text': 'User password not changed.'})


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
                translated_goal = 'Gain Weight'
            elif goal == 'lose-weight':
                translated_goal = 'Lose Weight'
            elif goal == 'maintain-weight':
                translated_goal = 'Maintain Weight'
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
            'firstName': user_profile.user.first_name,
            'lastName': user_profile.user.last_name,
            'age': user_profile.years_old,
            'weightGoal': translated_goal,
            'activityLevel': translated_level,
            'goalKg': user_profile.goal_kg,
            'height': user_profile.height,
            'weight': user_profile.weight,
            'gender': user_profile.gender,
            'username': user_profile.user.username
        }
        return JsonResponse({'status': 200, 'text': 'Operation success.', 'data': json.dumps(personal_info_dict)})


@login_required(login_url='login')
def get_user_body_measures(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        user_profile = UserProfile.objects.get(user=request.user)
        chest_json = user_profile.chest_json
        biceps_json = user_profile.biceps_json
        waist_json = user_profile.waist_json
        hips_json = user_profile.hips_json
        calves_json = user_profile.calves_json
        thighs_json = user_profile.thighs_json
        neck_json = user_profile.neck_json
        wrists_json = user_profile.wrists_json
        weight_json = user_profile.weight_json
        shoulders_json = user_profile.shoulders_json

        chest_cm = change_chest = biceps_cm = change_biceps = waist_cm = change_waist = hips_cm = change_hips = \
            calves_cm = change_calves = thighs_cm = change_thighs = neck_cm = change_neck = wrists_cm = change_wrists \
            = shoulders_cm = change_shoulders = change_weight = 0

        chest_date_change = weight_date_change = biceps_date_change = waist_date_change = hips_date_change = calves_date_change \
            = thighs_date_change = neck_date_change = wrists_date_change = shoulders_date_change = None

        if weight_json:
            weight_kg = list(weight_json['changes'][-1].values())[0]
            weight_date_change = list(weight_json['changes'][-1].keys())[0]
            if len(weight_json['changes']) > 1:
                prev_cm = list(weight_json['changes'][-2].values())[0]
                change_weight = float(weight_kg) - float(prev_cm)
        if chest_json:
            chest_cm = list(chest_json['changes'][-1].values())[0]
            chest_date_change = list(chest_json['changes'][-1].keys())[0]
            if len(chest_json['changes']) > 1:
                prev_cm = list(chest_json['changes'][-2].values())[0]
                change_chest = float(chest_cm) - float(prev_cm)
        if biceps_json:
            biceps_cm = list(biceps_json['changes'][-1].values())[0]
            biceps_date_change = list(biceps_json['changes'][-1].keys())[0]
            if len(biceps_json['changes']) > 1:
                prev_cm = list(biceps_json['changes'][-2].values())[0]
                change_biceps = float(biceps_cm) - float(prev_cm)
        if waist_json:
            waist_cm = list(waist_json['changes'][-1].values())[0]
            waist_date_change = list(waist_json['changes'][-1].keys())[0]
            if len(waist_json['changes']) > 1:
                prev_cm = list(waist_json['changes'][-2].values())[0]
                change_waist = float(waist_cm) - float(prev_cm)
        if hips_json:
            hips_cm = list(hips_json['changes'][-1].values())[0]
            hips_date_change = list(hips_json['changes'][-1].keys())[0]
            if len(hips_json['changes']) > 1:
                prev_cm = list(hips_json['changes'][-2].values())[0]
                change_hips = float(hips_cm) - float(prev_cm)
        if calves_json:
            calves_cm = list(calves_json['changes'][-1].values())[0]
            calves_date_change = list(calves_json['changes'][-1].keys())[0]
            if len(calves_json['changes']) > 1:
                prev_cm = list(calves_json['changes'][-2].values())[0]
                change_calves = float(calves_cm) - float(prev_cm)
        if thighs_json:
            thighs_cm = list(thighs_json['changes'][-1].values())[0]
            thighs_date_change = list(thighs_json['changes'][-1].keys())[0]
            if len(thighs_json['changes']) > 1:
                prev_cm = list(thighs_json['changes'][-2].values())[0]
                change_thighs = float(thighs_cm) - float(prev_cm)
        if neck_json:
            neck_cm = list(neck_json['changes'][-1].values())[0]
            neck_date_change = list(neck_json['changes'][-1].keys())[0]
            if len(neck_json['changes']) > 1:
                prev_cm = list(neck_json['changes'][-2].values())[0]
                change_neck = float(neck_cm) - float(prev_cm)
        if wrists_json:
            wrists_cm = list(wrists_json['changes'][-1].values())[0]
            wrists_date_change = list(wrists_json['changes'][-1].keys())[0]
            if len(wrists_json['changes']) > 1:
                prev_cm = list(wrists_json['changes'][-2].values())[0]
                change_wrists = float(wrists_cm) - float(prev_cm)
        if shoulders_json:
            shoulders_cm = list(shoulders_json['changes'][-1].values())[0]
            shoulders_date_change = list(shoulders_json['changes'][-1].keys())[0]
            if len(shoulders_json['changes']) > 1:
                prev_cm = list(shoulders_json['changes'][-2].values())[0]
                change_shoulders = float(shoulders_cm) - float(prev_cm)

        data = {
            'weightChange': change_weight,
            'weightDateChange': weight_date_change,
            'chest': chest_cm,
            'chestChange': change_chest,
            'chestDateChange': chest_date_change,
            'biceps': biceps_cm,
            'bicepsChange': change_biceps,
            'bicepsDateChange': biceps_date_change,
            'waist': waist_cm,
            'waistChange': change_waist,
            'waistDateChange': waist_date_change,
            'hips': hips_cm,
            'hipsChange': change_hips,
            'hipsDateChange': hips_date_change,
            'calves': calves_cm,
            'calvesChange': change_calves,
            'calvesDateChange': calves_date_change,
            'thighs': thighs_cm,
            'thighsChange': change_thighs,
            'thighsDateChange': thighs_date_change,
            'neck': neck_cm,
            'neckChange': change_neck,
            'neckDateChange': neck_date_change,
            'wrists': wrists_cm,
            'wristsChange': change_wrists,
            'wristsDateChange': wrists_date_change,
            'shoulders': shoulders_cm,
            'shouldersChange': change_shoulders,
            'shouldersDateChange': shoulders_date_change
        }
        return JsonResponse({'status': 200, 'text': 'Operation success.', 'data': json.dumps(data)})
    else:
        return JsonResponse({'status': 405, 'text': 'Method not allowed.', 'data': ''})


@login_required(login_url='login')
def update_user_parameter(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        user_profile = UserProfile.objects.get(user=request.user)
        data = json.loads(request.POST.get('data'))
        for element in data:
            edit_info_parameter_by_type(user_profile, element['type'], element['value'])
        return JsonResponse({'status': 200, 'text': 'Edit Information Updated'})


@login_required(login_url='login')
def get_profile_nutrition_details(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        day = request.GET.get('day')
        month = request.GET.get('month')
        year = request.GET.get('year')
        user_profile = UserProfile.objects.get(user=request.user)
        final_kcal_goal = calculate_user_nutrition_demand(user_profile)
        from datetime import datetime
        all_today_meals = Meal.objects.filter(created_by=user_profile,
                                              created_at__day=day, created_at__month=month, created_at__year=year).all()
        all_today_exercises = Workout.objects.filter(created_by=user_profile,
                                                     created_at__day=day, created_at__month=month,
                                                     created_at__year=year).all()
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
        desiredDate = request.POST.get('date')
        meals = Meal.objects.filter(created_by=user_profile, created_at__contains=desiredDate).all()
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
        exercises = Workout.objects.filter(created_by=user_profile, created_at__contains=desiredDate).all()
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
        for i in range(0, 7):
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
        import datetime
        user_profile = UserProfile.objects.get(user=request.user)
        current_month_num = datetime.datetime.now().month
        current_year = datetime.datetime.now().year
        current_day_of_month = f'0{datetime.datetime.now().day}' if datetime.datetime.now().day < 10 else datetime.datetime.now().day
        sum_kcal_eaten_percentage_arr = []
        sum_kcal_eaten_arr = []
        sum_kcal_burnt_arr = []
        sum_protein_eaten_arr = []
        sum_carbs_eaten_arr = []
        sum_fats_eaten_arr = []
        sum_duration_arr = []
        dates_arr = []
        kcal_demand = calculate_user_nutrition_demand(user_profile)
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
        for i in range(1, int(current_day_of_month) + 1):
            meals = Meal.objects.filter(created_by=user_profile, created_at__month=current_month_num, created_at__day=i,
                                        created_at__year=current_year).all()
            workouts = Workout.objects.filter(created_by=user_profile, created_at__month=current_month_num,
                                              created_at__day=i,
                                              created_at__year=current_year).all()
            sum_kcal_eaten = 0
            sum_kcal_burnt = 0
            sum_protein_eaten = 0
            sum_carbs_eaten = 0
            sum_fats_eaten = 0
            sum_duration_min = 0
            if meals:
                for meal in meals:
                    sum_kcal_eaten = sum_kcal_eaten + meal.kcal
                    sum_protein_eaten = sum_protein_eaten + meal.protein
                    sum_carbs_eaten = sum_carbs_eaten + meal.carbs
                    sum_fats_eaten = sum_fats_eaten + meal.fat
            if meals.exists():
                sum_kcal_eaten_percentage_arr.append(round(sum_kcal_eaten / kcal_demand, 2) * 100)
                sum_carbs_eaten_arr.append(round(sum_carbs_eaten / ((0.5 * kcal_demand) / 4), 2) * 100)
                sum_protein_eaten_arr.append(
                    round(sum_protein_eaten / (protein_multiplier * float(user_profile.weight)), 2) * 100)
                sum_fats_eaten_arr.append(round((sum_fats_eaten / ((kcal_demand * 0.275) / 9)), 2) * 100)
                sum_kcal_eaten_arr.append(sum_kcal_eaten)
            else:
                sum_kcal_eaten_percentage_arr.append(0)
                sum_protein_eaten_arr.append(0)
                sum_carbs_eaten_arr.append(0)
                sum_fats_eaten_arr.append(0)
                sum_kcal_eaten_arr.append(0)
            if workouts:
                for workout in workouts:
                    sum_kcal_burnt = sum_kcal_burnt + workout.kcal_burnt_sum
                    sum_duration_min = sum_duration_min + workout.min_spent_sum
            day = format_to_iso_date(i)
            month = format_to_iso_date(current_month_num)
            date_created = f'{day}.{month}'
            sum_kcal_burnt_arr.append(round(sum_kcal_burnt, 2))
            sum_duration_arr.append(round(sum_duration_min, 2))
            dates_arr.append(date_created)
        calories_eaten_change_dict = {
            'datesArr': dates_arr,
            'valuesArr': sum_kcal_eaten_arr
        }
        calories_eaten_percentage_change_dict = {
            'datesArr': dates_arr,
            'valuesArr': sum_kcal_eaten_percentage_arr
        }
        calories_burnt_change_dict = {
            'datesArr': dates_arr,
            'valuesArr': sum_kcal_burnt_arr
        }
        calories_protein_change_dict = {
            'datesArr': dates_arr,
            'valuesArr': sum_protein_eaten_arr
        }
        calories_carbs_change_dict = {
            'datesArr': dates_arr,
            'valuesArr': sum_carbs_eaten_arr
        }
        calories_fats_change_dict = {
            'datesArr': dates_arr,
            'valuesArr': sum_fats_eaten_arr
        }
        duration_change_dict = {
            'datesArr': dates_arr,
            'valuesArr': sum_duration_arr
        }
        changes_weight = get_changes_on_month(user_profile.weight_json)
        changes_chest = get_changes_on_month(user_profile.chest_json)
        changes_biceps = get_changes_on_month(user_profile.biceps_json)
        changes_waist = get_changes_on_month(user_profile.waist_json)
        changes_hips = get_changes_on_month(user_profile.hips_json)
        changes_calves = get_changes_on_month(user_profile.calves_json)
        changes_thighs = get_changes_on_month(user_profile.thighs_json)
        changes_neck = get_changes_on_month(user_profile.neck_json)
        changes_wrists = get_changes_on_month(user_profile.wrists_json)
        changes_shoulders = get_changes_on_month(user_profile.shoulders_json)
        month_changes_dict = {
            'changesWeight': changes_weight,
            'changesChest': changes_chest,
            'changesBiceps': changes_biceps,
            'changesWaist': changes_waist,
            'changesHips': changes_hips,
            'changesCalves': changes_calves,
            'changesThighs': changes_thighs,
            'changesNeck': changes_neck,
            'changesWrists': changes_wrists,
            'changesShoulders': changes_shoulders,
            'changesDuration': duration_change_dict,
            'caloriesEaten': calories_eaten_change_dict,
            'caloriesEatenPercent': calories_eaten_percentage_change_dict,
            'caloriesBurnt': calories_burnt_change_dict,
            'proteinEatenPercent': calories_protein_change_dict,
            'carbsEatenPercent': calories_carbs_change_dict,
            'fatsEatenPercent': calories_fats_change_dict

        }
        return JsonResponse({'status': 200, 'text': 'Operation successful.', 'data': json.dumps(month_changes_dict)})


@login_required(login_url='login')
def get_graph_stats_info_yearly(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        user_profile = UserProfile.objects.get(user=request.user)
        from datetime import datetime
        from calendar import monthrange
        current_year = datetime.now().year
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
            meals = Meal.objects.filter(created_by=user_profile, created_at__month=i,
                                        created_at__year=current_year).all()
            workouts = Workout.objects.filter(created_by=user_profile, created_at__month=i,
                                              created_at__year=current_year).all()
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
                carbsDemand = 0.5 * kcal_demand / 4
                monthly_kcal_percentages.append(round(((monthly_kcal_eaten / month_days) / kcal_demand) * 100, 2))
                monthly_carbs_percentages.append(round(((monthly_carbs / month_days) / carbsDemand) * 100, 2))
                monthly_protein_percentages.append(
                    round(((monthly_protein / (protein_multiplier * float(
                        protein_multiplier * float(user_profile.goal_kg)))) / month_days) * 100, 2))
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
        changes_yearly = get_measure_changes_yearly(user_profile, current_year)
        stats_info_dict_yearly = {
            'eatenKcal': monthly_kcal,
            'burntKcal': monthly_kcal_burnt,
            'eatenKcalPercent': monthly_kcal_percentages,
            'eatenProteinPercent': monthly_protein_percentages,
            'eatenCarbsPercent': monthly_carbs_percentages,
            'eatenFatsPercent': monthly_fats_percentages,
            'workoutDurations': monthly_duration_minutes,
            'changes': changes_yearly
        }
        return JsonResponse(
            {'status': 200, 'text': 'Operation successful.', 'data': json.dumps(stats_info_dict_yearly)})


def get_static_files_url(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        from Nutri.settings import BEA
        return JsonResponse(
            {'status': 200, 'text': 'Static path returned.', 'path': BEA})
