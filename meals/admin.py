from django.contrib import admin
from .models import IngredientUnit, Ingredient, Meal


# Register your models here.

class IngredientUnitAdmin(admin.ModelAdmin):
    list_display = ("en_name", "pl_name",)


class IngredientAdmin(admin.ModelAdmin):
    list_display = (
        "pl_name", "en_name", "kcal", "unit", "multiplyValue", "carbs", "protein", "fat", "fiber", "saturated_fat",
        "cholesterol", "sodium", "sugar", "potassium", "iron", "calcium", "magnesium")

    def unit(self, obj):
        return "\n".join(f'{obj.unit.pl_name} / {obj.unit.en_name}')


class MealAdmin(admin.ModelAdmin):
    list_display = ("ingredient", "created_at", "quantity", "created_by")

    def ingredients(self, obj):
        return "\n".join([a.ingredients for a in obj.ingredients.all()])


#
admin.site.register(IngredientUnit)
admin.site.register(Ingredient, IngredientAdmin)
admin.site.register(Meal, MealAdmin)
