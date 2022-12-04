import json
from datetime import date, timedelta, datetime


def date_for_weekday(day: int):
    today = date.today()
    # weekday returns the offsets 0-6
    # If you need 1-7, use isoweekday
    weekday = today.weekday()
    date_of_weekday = today + timedelta(days=day - weekday)
    date_of_weekday = date_of_weekday.strftime('%Y-%m-%d')
    return date_of_weekday


def calculate_user_nutrition_demand(user_profile):
    goal_multiplier = 1.25
    if user_profile.activity_level == 'not-active':
        goal_multiplier = 1.25
    elif user_profile.activity_level == 'lightly-active':
        goal_multiplier = 1.38
    elif user_profile.activity_level == 'active':
        goal_multiplier = 1.52
    elif user_profile.activity_level == 'very-active':
        goal_multiplier = 1.85
    # Mifflin-St Jeor Equation
    if user_profile.gender == 'Male':
        basal_metabolic_rate = round(float((10 * float(user_profile.weight)) + (6.25 * float(user_profile.height)) - \
                                           (5 * float(user_profile.years_old)) + 5), 2)
    else:
        basal_metabolic_rate = round(float((10 * float(user_profile.weight)) + (6.25 * float(user_profile.height)) - \
                                           (5 * float(user_profile.years_old)) - 161), 2)
    weight_goal_metabolic_rate = basal_metabolic_rate * goal_multiplier
    gain_loss_per_week = 0.5
    if user_profile.goal_weight == 'gain-weight':
        weight_diff_kg = float(user_profile.weight) - float(user_profile.goal_kg)
        energy_diff = weight_diff_kg * 750 / (weight_diff_kg / gain_loss_per_week)
        final_kcal_goal = round(weight_goal_metabolic_rate + energy_diff, 2)
    elif user_profile.goal_weight == 'lose-weight':
        weight_diff_kg = float(user_profile.weight) - float(user_profile.goal_kg)
        energy_diff = weight_diff_kg * 750 / (weight_diff_kg / gain_loss_per_week)
        final_kcal_goal = round(weight_goal_metabolic_rate - energy_diff, 2)
    else:
        final_kcal_goal = weight_goal_metabolic_rate

    return final_kcal_goal


def edit_info_parameter_by_type(user_profile, parameter, value):
    type_json = {}
    if parameter == 'height':
        user_profile.height = value
        user_profile.save()
        return
    elif parameter == 'weight':
        user_profile.weight = value
        user_profile.save()
        return
    elif parameter == 'fname':
        user_profile.first_name = value
        user_profile.save()
        return
    elif parameter == 'lname':
        user_profile.last_name = value
        user_profile.save()
        return
    elif parameter == 'age':
        user_profile.years_old = value
        user_profile.save()
        return
    elif parameter == 'weight-goal':
        user_profile.weight_goal = value
        user_profile.save()
        return
    elif parameter == 'goal-kg':
        user_profile.goal_kg = value
        user_profile.save()
        return
    elif parameter == 'activity':
        user_profile.activity_level = value
        user_profile.save()
        return
    elif parameter == 'chest':
        type_json = user_profile.chest_json
    elif parameter == 'biceps':
        type_json = user_profile.biceps_json
    elif parameter == 'waist':
        type_json = user_profile.waist_json
    elif parameter == 'hips':
        type_json = user_profile.hips_json
    elif parameter == 'calves':
        type_json = user_profile.calves_json
    elif parameter == 'thighs':
        type_json = user_profile.thighs_json
    elif parameter == 'neck':
        type_json = user_profile.neck_json
    elif parameter == 'wrists':
        type_json = user_profile.wrists_json
    elif parameter == 'shoulders':
        type_json = user_profile.shoulders_json
    now = datetime.now()
    today_date = f"{now.day}-{now.month}-{now.year}"
    new_entry = {
        f'{today_date}': value
    }
    print(type_json)
    print(new_entry)
    type_json.append(new_entry)
    print('x', type_json)


