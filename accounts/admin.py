from django.contrib import admin
from .models import Account, UserProfile
from django.contrib.auth.admin import UserAdmin


# Register your models here.

class AccountAdmin(UserAdmin):
    list_display = ("email", "first_name", "last_name", "username", "last_login", "date_joined", "is_active")
    list_display_links = ("email", "first_name", "last_name")
    readonly_fields = ("last_login", "date_joined")
    ordering = ("-date_joined",)
    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()


class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "activity_level", "goal_weight", "height", "weight", "years_old", "gender")


#
admin.site.register(Account, AccountAdmin)
admin.site.register(UserProfile, UserProfileAdmin)