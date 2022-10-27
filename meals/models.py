from django.db import models


# Create your models here.

class IngredientUnit(models.Model):
    pl_name = models.CharField(max_length=50)
    en_name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.pl_name} / {self.en_name}"

    def get_unit_name_en(self):
        return f"{self.en_name}"

class Ingredient(models.Model):
    pl_name = models.CharField(max_length=100, blank=False)
    en_name = models.CharField(max_length=100, blank=False)
    # for 100 ml or 10g (depends on unit)
    unit = models.ForeignKey(IngredientUnit, blank=False, on_delete=models.CASCADE)
    multiplyValue = models.IntegerField(blank=False, default='1')
    kcal = models.FloatField()
    carbs = models.FloatField(blank=True, default='0')
    protein = models.FloatField(blank=True, default='0')
    fat = models.FloatField(blank=True, default='0')
    fiber = models.FloatField(blank=True, default='0')
    saturated_fat = models.FloatField(blank=True, default='0')
    cholesterol = models.FloatField(blank=True, default='0')
    sodium = models.FloatField(blank=True, default='0')
    sugar = models.FloatField(blank=True, default='0')
    potassium = models.FloatField(blank=True, default='0')
    iron = models.FloatField(blank=True, default='0')
    calcium = models.FloatField(blank=True, default='0')
    magnesium = models.FloatField(blank=True, default='0')

