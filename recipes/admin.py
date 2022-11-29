from django.contrib import admin
from .models import Recipe


# Register your models here.

class RecipeAdmin(admin.ModelAdmin):
    list_display = (
    "name_pl", 'name_en', "person_count", "difficulty_pl", 'difficulty_en', 'author', 'duration', 'ingredients_pl',
    'steps_pl', 'steps_en', 'ingredients_en', 'verified')
    search_fields = ('name_pl',)


admin.site.register(Recipe, RecipeAdmin)
