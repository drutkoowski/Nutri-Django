from django.db import models
from accounts.models import UserProfile


# Create your models here.

class IngredientUnit(models.Model):
    pl_name = models.CharField(max_length=50)
    en_name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.pl_name} / {self.en_name}"

    def get_unit_name_en(self):
        return f"{self.en_name}"


class IngredientCategory(models.Model):
    pl_category_name = models.CharField(max_length=100, blank=True)
    en_category_name = models.CharField(max_length=100, blank=True)

    class Meta:
        verbose_name_plural = "Ingredient categories"

    def __str__(self):
        return f"{self.pl_category_name} / {self.en_category_name}"


class Ingredient(models.Model):
    pl_name = models.CharField(max_length=100, blank=True)
    en_name = models.CharField(max_length=100, blank=False)
    category = models.ForeignKey(IngredientCategory, on_delete=models.SET_DEFAULT, default='', blank=True, null=True)
    unit = models.ForeignKey(IngredientUnit, blank=False, on_delete=models.CASCADE)
    kcal = models.FloatField(blank=False, default='0')
    carbs = models.FloatField(blank=True, default='0')
    protein = models.FloatField(blank=True, default='0')
    fat = models.FloatField(blank=True, default='0')
    fiber = models.FloatField(blank=True, default='0')
    saturated_fat = models.FloatField(blank=True, default='0')
    cholesterol = models.FloatField(blank=True, default='0')
    sodium = models.FloatField(blank=True, default='0')
    sugar = models.FloatField(blank=True, default='0')
    potassium = models.FloatField(blank=True, default='0')
    serving_grams = models.FloatField(blank=True, default='0')
    serving_ml = models.FloatField(blank=True, default='0')

    def __str__(self):
        return f"{self.pl_name} / {self.en_name}"


class Meal(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    quantity = models.FloatField(blank=False)
    created_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
