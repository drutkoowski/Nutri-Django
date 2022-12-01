from .models import UserProfile
from django.contrib.auth.models import AnonymousUser


def get_current_user_profile(request):
    if 'admin' in request.path:
        return {}
    if not request.user.is_authenticated or request.user is AnonymousUser:
        return dict(get_current_user_profile=None)
    user = request.user
    user_profile = UserProfile.objects.filter(user=user).first()
    return dict(get_current_user_profile=user_profile)


def get_translated_profile_info(request):
    if 'admin' in request.path:
        return {}
    if not request.user.is_authenticated or request.user is AnonymousUser:
        return dict(get_translated_profile_goals=None)
    user = request.user
    user_profile = UserProfile.objects.filter(user=user).first()
    lang_code = request.path.split('/')[1]
    translated_gender = "Mężczyzna" if user_profile.gender == 'Male' else "Kobieta"
    if lang_code == 'pl':
        goal = user_profile.goal_weight
        level = user_profile.activity_level
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
        translated_dict = {
            'goal': translated_goal,
            'activityLevel': translated_level,
            'gender': translated_gender
        }
    else:
        goal = user_profile.goal_weight
        level = user_profile.activity_level
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
        translated_dict = {
            'goal': translated_goal,
            'activityLevel': translated_level,
            'gender': user_profile.gender
        }
    print(translated_dict)
    return dict(get_translated_profile_info=translated_dict)
