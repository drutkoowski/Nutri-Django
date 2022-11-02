from django.contrib import admin
from .models import IngredientUnit, Ingredient, Meal, IngredientCategory, MealTemplateElement, MealTemplate


# Register your models here.

class IngredientUnitAdmin(admin.ModelAdmin):
    list_display = ("en_name", "pl_name", "multiplier",)


class CategoryIngredientAdmin(admin.ModelAdmin):
    list_display = ("pl_category_name", "en_category_name",)
    ordering = ('pl_category_name', 'en_category_name',)


class IngredientAdmin(admin.ModelAdmin):
    list_display = (
        "en_name", "pl_name", "unit", "category", "kcal", "carbs", "protein", "fat", "fiber", "saturated_fat",
        "cholesterol", "sodium", "sugar", "potassium", "serving_grams", "serving_ml")
    ordering = ('en_name', 'kcal',)
    search_fields = ("pl_name",)
    list_filter = ('category', 'unit',)

    def unit(self, obj):
        return "\n".join(f'{obj.unit.pl_name} / {obj.unit.en_name}')

    def category(self, obj):
        return "\n".join(f'{obj.category.pl_category_name} / {obj.category.en_category_name}')


class MealAdmin(admin.ModelAdmin):
    list_display = (
    "ingredient", "created_by", "created_at", "quantity", "kcal", "carbs", "protein", "fat", "fiber", "saturated_fat",
    "cholesterol", "sodium", "sugar", "potassium", "serving_grams", "serving_ml")

    def ingredients(self, obj):
        return "\n".join([a.ingredients for a in obj.ingredients.all()])


class MealTemplateAdmin(admin.ModelAdmin):
    list_display = ("meal_name", "meal_elements_list", "kcal", "carbs", "protein", "fat", "created_by")

    def meal_elements_list(self, obj):
        return ",\n".join([a.ingredient.en_name for a in obj.meal_elements.all()])

#
admin.site.register(IngredientUnit)
admin.site.register(Ingredient, IngredientAdmin)
admin.site.register(Meal, MealAdmin)
admin.site.register(IngredientCategory, CategoryIngredientAdmin)
admin.site.register(MealTemplateElement)
admin.site.register(MealTemplate, MealTemplateAdmin)
