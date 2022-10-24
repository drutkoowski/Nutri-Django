from .models import UserProfile
from django.contrib.auth.models import AnonymousUser


def get_current_user_profile(request):
    if 'admin' in request.path:
        return {}
    if not request.user.is_authenticated or request.user is AnonymousUser:
        return dict(get_current_user_profile=None)
    user = request.user
    userprofile = UserProfile.objects.filter(user=user).first()
    return dict(get_current_user_profile=userprofile)
