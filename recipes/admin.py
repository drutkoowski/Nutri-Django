from django.contrib import admin
from .models import Recipe


# Register your models here.

class RecipeAdmin(admin.ModelAdmin):
    list_display = ("name_pl", 'name_en', "person_count", "difficulty_pl", 'difficulty_en','author', 'duration', 'ingredients_pl', 'steps_pl', 'steps_en', 'ingredients_en')


admin.site.register(Recipe, RecipeAdmin)

