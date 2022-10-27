from django.contrib import admin
from .models import IngredientUnit, Ingredient


# Register your models here.

class IngredientUnitAdmin(admin.ModelAdmin):
    list_display = ("en_name", "pl_name")


class IngredientAdmin(admin.ModelAdmin):
    list_display = ("pl_name", "en_name", "units", "kcal", "carbs", "protein", "fat", "fiber", "saturated_fat",
                    "cholesterol", "sodium", "sugar", "potassium", "iron", "calcium", "magnesium")

    def units(self, obj):
        return "\n".join([f'{a.pl_name} / {a.en_name}' for a in obj.unit.all()])


#
admin.site.register(IngredientUnit)
admin.site.register(Ingredient, IngredientAdmin)
