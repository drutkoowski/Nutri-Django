from django.db import models


# Create your models here.
class Recipe(models.Model):
    name_pl = models.CharField(max_length=100,default='')
    name_en = models.CharField(max_length=100)
    person_count = models.IntegerField(blank=True, null=True)
    difficulty_pl = models.CharField(max_length=50, blank=True, null=True)
    difficulty_en = models.CharField(max_length=50, blank=True, null=True)
    author = models.CharField(max_length=100, blank=True, null=True)
    duration = models.CharField(max_length=30, blank=True, null=True)
    ingredients_pl = models.JSONField(blank=True,default=dict)
    ingredients_en = models.JSONField(blank=True,default=dict)
    steps_pl = models.JSONField(blank=True, default=dict)
    steps_en = models.JSONField(blank=True, default=dict)