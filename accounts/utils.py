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
    now = datetime.now()
    today_date = now.strftime('%d-%m-%Y')
    new_entry = {
        f'{today_date}': value
    }
    if parameter == 'height':
        user_profile.height = value
        user_profile.save()
        return
    elif parameter == 'weight':
        user_profile.weight = value
        user_profile.save()
        return
    elif parameter == 'fname':
        user_profile.user.first_name = str(value)
        user_profile.user.save()
        return
    elif parameter == 'lname':
        user_profile.user.last_name = str(value)
        user_profile.user.save()
        return
    elif parameter == 'age':
        user_profile.years_old = value
        user_profile.save()
        return
    elif parameter == 'weight-goal':
        translated_goal = value
        if value == 'Utrzymać wagę' or value == 'Maintain Weight':
            translated_goal = 'maintain-weight'
        elif value == 'Przybrać na wadze' or value == 'Gain Weight':
            translated_goal = 'gain-weight'
        elif value == 'Schudnąć' or value == 'Lose Weight':
            translated_goal = 'lose-weight'
        user_profile.goal_weight = translated_goal
        user_profile.save()
        return
    elif parameter == 'goal-kg':
        user_profile.goal_kg = value
        user_profile.save()
        return
    elif parameter == 'activity':
        translated_goal = value
        if value == 'Nieaktywny' or value == 'Not active':
            translated_goal = 'not-active'
        elif value == 'Lekko aktywny' or value == 'Lightly active':
            translated_goal = 'lightly-active'
        elif value == 'Aktywny' or value == 'Active':
            translated_goal = 'active'
        elif value == 'Very active' or value == 'Bardzo aktywny':
            translated_goal = 'very-active'
        user_profile.activity_level = translated_goal
        user_profile.save()
        return
    elif parameter == 'chest':
        type_json = user_profile.chest_json
        if len(type_json) == 0:
            type_json['changes'] = []
            type_json['changes'].append(new_entry)
            user_profile.chest_json = type_json
        else:
            changes = user_profile.chest_json['changes']
            for change in changes:
                if today_date in change:
                    changes.pop()
            changes.append(new_entry)
            user_profile.chest_json = type_json
    elif parameter == 'biceps':
        type_json = user_profile.biceps_json
        if len(type_json) == 0:
            type_json['changes'] = []
            type_json['changes'].append(new_entry)
            user_profile.biceps_json = type_json
        else:
            changes = user_profile.biceps_json['changes']
            for change in changes:
                if today_date in change:
                    changes.pop()
            changes.append(new_entry)
            user_profile.biceps_json = type_json
    elif parameter == 'waist':
        type_json = user_profile.waist_json
        if len(type_json) == 0:
            type_json['changes'] = []
            type_json['changes'].append(new_entry)
            user_profile.waist_json = type_json
        else:
            changes = user_profile.waist_json['changes']
            for change in changes:
                if today_date in change:
                    changes.pop()
            changes.append(new_entry)
            user_profile.waist_json = type_json
    elif parameter == 'hips':
        type_json = user_profile.hips_json
        if len(type_json) == 0:
            type_json['changes'] = []
            type_json['changes'].append(new_entry)
            user_profile.hips_json = type_json
        else:
            changes = user_profile.hips_json['changes']
            for change in changes:
                if today_date in change:
                    changes.pop()
            changes.append(new_entry)
            user_profile.hips_json = type_json
    elif parameter == 'calves':
        type_json = user_profile.calves_json
        if len(type_json) == 0:
            type_json['changes'] = []
            type_json['changes'].append(new_entry)
            user_profile.calves_json = type_json
        else:
            changes = user_profile.calves_json['changes']
            for change in changes:
                if today_date in change:
                    changes.pop()
            changes.append(new_entry)
            user_profile.calves_json = type_json
    elif parameter == 'thighs':
        type_json = user_profile.thighs_json
        if len(type_json) == 0:
            type_json['changes'] = []
            type_json['changes'].append(new_entry)
            user_profile.thighs_json = type_json
        else:
            changes = user_profile.thighs_json['changes']
            for change in changes:
                if today_date in change:
                    changes.pop()
            changes.append(new_entry)
            user_profile.thighs_json = type_json
    elif parameter == 'neck':
        type_json = user_profile.neck_json
        if len(type_json) == 0:
            type_json['changes'] = []
            type_json['changes'].append(new_entry)
            user_profile.neck_json = type_json
        else:
            changes = user_profile.neck_json['changes']
            for change in changes:
                if today_date in change:
                    changes.pop()
            changes.append(new_entry)
            user_profile.neck_json = type_json
    elif parameter == 'wrists':
        type_json = user_profile.wrists_json
        if len(type_json) == 0:
            type_json['changes'] = []
            type_json['changes'].append(new_entry)
            user_profile.wrists_json = type_json
        else:
            changes = user_profile.wrists_json['changes']
            for change in changes:
                if today_date in change:
                    changes.pop()
            changes.append(new_entry)
            user_profile.wrists_json = type_json
    elif parameter == 'shoulders':
        type_json = user_profile.shoulders_json
        if len(type_json) == 0:
            type_json['changes'] = []
            type_json['changes'].append(new_entry)
            user_profile.shoulders_json = type_json
        else:
            changes = user_profile.shoulders_json['changes']
            for change in changes:
                if today_date in change:
                    changes.pop()
            changes.append(new_entry)
            user_profile.shoulders_json = type_json

    user_profile.save()
