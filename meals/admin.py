from django.contrib import admin
from .models import IngredientUnit, Ingredient, Meal, IngredientCategory


# Register your models here.

class IngredientUnitAdmin(admin.ModelAdmin):
    list_display = ("en_name", "pl_name",)


class CategoryIngredientAdmin(admin.ModelAdmin):
    list_display = ("pl_category_name", "en_category_name",)
    ordering = ('pl_category_name', 'en_category_name',)


class IngredientAdmin(admin.ModelAdmin):
    list_display = (
        "en_name", "pl_name", "unit", "category", "kcal", "carbs", "protein", "fat", "fiber", "saturated_fat",
        "cholesterol", "sodium", "sugar", "potassium", "serving_grams", "serving_ml")
    ordering = ('en_name', 'kcal',)
    search_fields = ("en_name",)
    list_filter = ('category', 'unit', )
    def unit(self, obj):
        return "\n".join(f'{obj.unit.pl_name} / {obj.unit.en_name}')

    def category(self, obj):
        return "\n".join(f'{obj.category.pl_category_name} / {obj.category.en_category_name}')


class MealAdmin(admin.ModelAdmin):
    list_display = ("ingredient", "created_at", "quantity", "created_by")

    def ingredients(self, obj):
        return "\n".join([a.ingredients for a in obj.ingredients.all()])


#
admin.site.register(IngredientUnit)
admin.site.register(Ingredient, IngredientAdmin)
admin.site.register(Meal, MealAdmin)
admin.site.register(IngredientCategory, CategoryIngredientAdmin)
