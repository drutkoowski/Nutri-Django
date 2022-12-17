from django.db import models
from accounts.models import UserProfile

#
# Create your models here.

class IngredientUnit(models.Model):
    pl_name = models.CharField(max_length=120)
    en_name = models.CharField(max_length=120)
    multiplier = models.IntegerField(default=0, blank=True)

    def __str__(self):
        return f"{self.pl_name} / {self.en_name}"

    def get_unit_name_en(self):
        return f"{self.en_name}"

    def get_unit_name_pl(self):
        return f"{self.pl_name}"


class IngredientCategory(models.Model):
    pl_category_name = models.CharField(max_length=100, blank=True)
    en_category_name = models.CharField(max_length=100, blank=True)

    def get_category_name_en(self):
        return f"{self.en_category_name}"

    def get_category_name_pl(self):
        return f"{self.pl_category_name}"

    class Meta:
        verbose_name_plural = "Ingredient categories"

    def __str__(self):
        return f"{self.pl_category_name} / {self.en_category_name}"


class Ingredient(models.Model):
    pl_name = models.CharField(max_length=150, blank=True)
    en_name = models.CharField(max_length=150, blank=False)
    category = models.ForeignKey(IngredientCategory, on_delete=models.SET_DEFAULT, default=None, blank=True, null=True)
    unit = models.ForeignKey(IngredientUnit, blank=False, on_delete=models.SET_DEFAULT, default=None)
    kcal = models.FloatField(blank=False, default=None)
    carbs = models.FloatField(blank=True, default=None, null=True)
    protein = models.FloatField(blank=True, default=None, null=True)
    fat = models.FloatField(blank=True, default=None, null=True)
    serving_grams = models.FloatField(blank=True, default=None, null=True)
    serving_ml = models.FloatField(blank=True, default=None, null=True)
    created_by = models.ForeignKey(UserProfile, blank=False, default=None, on_delete=models.SET_NULL, null=True)
    verified = models.BooleanField(blank=False, default=True)

    def __str__(self):
        return f"{self.pl_name} / {self.en_name}"


class Meal(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, default='')
    created_at = models.DateField(auto_now_add=True)
    quantity = models.FloatField(blank=False)
    kcal = models.FloatField(blank=False, default=None)
    carbs = models.FloatField(blank=True, default=None, null=True)
    protein = models.FloatField(blank=True, default=None, null=True)
    fat = models.FloatField(blank=True, default=None, null=True)
    fiber = models.FloatField(blank=True, default=None, null=True)
    saturated_fat = models.FloatField(blank=True, default=None, null=True)
    cholesterol = models.FloatField(blank=True, default=None, null=True)
    sodium = models.FloatField(blank=True, default=None, null=True)
    sugar = models.FloatField(blank=True, default=None, null=True)
    potassium = models.FloatField(blank=True, default=None, null=True)
    serving_grams = models.FloatField(blank=True, default=None, null=True)
    serving_ml = models.FloatField(blank=True, default=None, null=True)
    created_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE)


class MealTemplateElement(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, default='')
    quantity = models.FloatField(blank=False)
    created_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.ingredient.en_name} / {self.created_by} ({self.pk})'


class MealTemplate(models.Model):
    meal_elements = models.ManyToManyField(MealTemplateElement, default='')
    meal_name = models.CharField(max_length=50, blank=False)
    kcal = models.FloatField(blank=True, null=True, default=None)
    carbs = models.FloatField(blank=True, default=None, null=True)
    protein = models.FloatField(blank=True, default=None, null=True)
    fat = models.FloatField(blank=True, default=None, null=True)
    created_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.meal_name}"
