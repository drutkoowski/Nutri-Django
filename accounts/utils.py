from datetime import date, timedelta, datetime


def date_for_weekday(day: int) -> str:
    today = date.today()
    # weekday returns the offsets 0-6
    # If you need 1-7, use isoweekday
    weekday = today.weekday()
    date_of_weekday = today + timedelta(days=day - weekday)
    date_of_weekday = date_of_weekday.strftime('%Y-%m-%d')
    return date_of_weekday


def calculate_user_nutrition_demand(user_profile) -> float:
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


def edit_info_parameter_by_type(user_profile, parameter: str, value: int) -> None:
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
        type_json = user_profile.weight_json
        if len(type_json) == 0:
            type_json['changes'] = []
            type_json['changes'].append(new_entry)
            user_profile.weight_json = type_json
        else:
            changes = user_profile.weight_json['changes']
            for change in changes:
                if today_date in change:
                    changes.pop()
            if not compare_change_latest_change(changes, value):
                changes.append(new_entry)
                user_profile.weight_json = type_json
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
        elif value == 'Przytyć' or value == 'Gain Weight':
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
            if not compare_change_latest_change(changes, value):
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
            if not compare_change_latest_change(changes, value):
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
            if not compare_change_latest_change(changes, value):
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
            if not compare_change_latest_change(changes, value):
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
            if not compare_change_latest_change(changes, value):
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
            if not compare_change_latest_change(changes, value):
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
            if not compare_change_latest_change(changes, value):
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
            if not compare_change_latest_change(changes, value):
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
            if not compare_change_latest_change(changes, value):
                changes.append(new_entry)
                user_profile.shoulders_json = type_json
    user_profile.save()


def get_measure_changes_yearly(user_profile, current_year: int) -> dict:
    chest_json = user_profile.chest_json
    changes_chest = []
    weight_json = user_profile.weight_json
    changes_weight = []
    biceps_json = user_profile.biceps_json
    changes_biceps = []
    waist_json = user_profile.waist_json
    changes_waist = []
    hips_json = user_profile.hips_json
    changes_hips = []
    calves_json = user_profile.calves_json
    changes_calves = []
    thighs_json = user_profile.thighs_json
    changes_thighs = []
    neck_json = user_profile.neck_json
    changes_neck = []
    wrists_json = user_profile.wrists_json
    changes_wrist = []
    shoulders_json = user_profile.shoulders_json
    changes_shoulders = []

    def get_monthly_changes_avg(json_object, result_array, month_change) -> None:
        month_changes = []
        if "changes" in json_object:
            for item in json_object['changes']:
                change_date = (list(item.keys())[0]).replace('-', ' ').split()
                day = change_date[0]
                month = change_date[1]
                year = change_date[2]
                month_avg = check_latest_change_value_yearly(weight_json, current_year)
                if int(month) == month_change and int(year) == current_year:
                    month_changes.append(float(item[f'{day}-{month}-{year}']))
            if len(month_changes) > 0:
                month_avg = sum(month_changes) / len(month_changes)
            result_array.append(month_avg)
        else:
            result_array.append(0)

    for i in range(1, 13):
        get_monthly_changes_avg(chest_json, changes_chest, i)
        get_monthly_changes_avg(weight_json, changes_weight, i)
        get_monthly_changes_avg(biceps_json, changes_biceps, i)
        get_monthly_changes_avg(waist_json, changes_waist, i)
        get_monthly_changes_avg(hips_json, changes_hips, i)
        get_monthly_changes_avg(calves_json, changes_calves, i)
        get_monthly_changes_avg(thighs_json, changes_thighs, i)
        get_monthly_changes_avg(neck_json, changes_neck, i)
        get_monthly_changes_avg(wrists_json, changes_wrist, i)
        get_monthly_changes_avg(shoulders_json, changes_shoulders, i)
    return {
        'changesChest': changes_chest,
        'changesWeight': changes_weight,
        'changesBiceps': changes_biceps,
        'changesWaist': changes_waist,
        'changesHips': changes_hips,
        'changesCalves': changes_calves,
        'changesThighs': changes_thighs,
        'changesNeck': changes_neck,
        'changesWrists': changes_wrist,
        'changesShoulders': changes_shoulders
    }


def check_latest_change_value(change_json, month_num, year) -> float:
    latest_value = 0
    if 'changes' in change_json:
        for y in change_json['changes']:
            for key, value in y.items():
                value_handler = value
            date_str = (list(y.keys())[0]).replace('-', ' ').split()
            if int(date_str[1]) < month_num and int(date_str[2]) <= year:
                latest_value = value_handler
    return float(latest_value)


def compare_change_latest_change(change_json, change) -> bool:
    last_change_items = change_json[-1].items()
    for key, value in last_change_items:
        value_handler = value
        if value_handler == change:
            return True
    else:
        return False


def check_latest_change_value_yearly(change_json, year) -> float:
    latest_value = 0
    if 'changes' in change_json:
        for y in change_json['changes']:
            for key, value in y.items():
                value_handler = value
            date_str = (list(y.keys())[0]).replace('-', ' ').split()
            if int(date_str[2]) < year:
                latest_value = value_handler
    return float(latest_value)


def get_changes_on_month(change_json) -> dict:
    import datetime
    current_month_num = datetime.datetime.now().month
    current_year = datetime.datetime.now().year
    current_day_of_month = f'0{datetime.datetime.now().day}' if datetime.datetime.now().day < 10 else datetime.datetime.now().day
    weight_json = change_json
    change_dict = {}
    if 'changes' in weight_json:
        changes_dates = []
        changes_values = []
        for i in weight_json['changes']:
            for key, value in i.items():
                value = value
            date_str = (list(i.keys())[0]).replace('-', ' ').split()
            if int(date_str[1]) == current_month_num and int(date_str[2]) == current_year:
                changes_dates.append(f'{date_str[0]}.{date_str[1]}')
                changes_values.append(float(value))
        # first day of month
        if f"01-{current_month_num}" not in changes_dates:
            latest_value = check_latest_change_value(change_json, current_month_num, current_year)
            changes_values.insert(0, latest_value)
            changes_dates.insert(0, f"01.{current_month_num}")
        # last day of month
        if f"{current_day_of_month}.{current_month_num}" not in changes_dates:
            changes_values.append(changes_values[-1])
            changes_dates.append(f"{current_day_of_month}.{current_month_num}")

        change_dict = {
            'datesArr': changes_dates,
            'valuesArr': changes_values
        }
    return change_dict


def format_to_iso_date(date_num):
    iso_corrected = f'0{date_num}' if date_num < 10 else date_num

    return iso_corrected
