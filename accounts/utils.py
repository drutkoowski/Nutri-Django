from datetime import date, timedelta


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
