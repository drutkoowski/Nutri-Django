from django.db import models
from accounts.models import UserProfile


# Create your models here.

class ExerciseUnit(models.Model):
    pl_name = models.CharField(max_length=50)
    en_name = models.CharField(max_length=50)
    multiplier = models.IntegerField(default=0, blank=True)

    def __str__(self):
        return f"{self.pl_name} / {self.en_name}"

    def get_unit_name_en(self):
        return f"{self.en_name}"

    def get_unit_name_pl(self):
        return f"{self.pl_name}"


#
class ExerciseTimeUnit(models.Model):
    pl_time_unit_name = models.CharField(max_length=15, blank=True)
    en_time_unit_name = models.CharField(max_length=15, blank=True)

    def get_time_unit_name_en(self):
        return f"{self.en_time_unit_name}"

    def get_time_unit_name_pl(self):
        return f"{self.pl_time_unit_name}"

    class Meta:
        verbose_name_plural = "Exercise time units"

    def __str__(self):
        return f"{self.pl_time_unit_name} / {self.en_time_unit_name}"


class ExerciseCategory(models.Model):
    pl_category_name = models.CharField(max_length=100, blank=True)
    en_category_name = models.CharField(max_length=100, blank=True)

    def get_category_name_en(self):
        return f"{self.en_category_name}"

    def get_category_name_pl(self):
        return f"{self.pl_category_name}"

    class Meta:
        verbose_name_plural = "Exercise categories"

    def __str__(self):
        return f"{self.pl_category_name} / {self.en_category_name}"


class Exercise(models.Model):
    pl_name = models.CharField(max_length=155, blank=True)
    en_name = models.CharField(max_length=155, blank=False)
    category = models.ForeignKey(ExerciseCategory, on_delete=models.SET_DEFAULT, default=None, blank=True, null=True)
    unit = models.ForeignKey(ExerciseUnit, blank=True, default=None, null=True, on_delete=models.CASCADE)
    time_unit = models.ForeignKey(ExerciseTimeUnit, blank=True, null=True, on_delete=models.SET_DEFAULT, default=None)
    met = models.FloatField(blank=False, default=1)
    created_by = models.ForeignKey(UserProfile, blank=False, default=None, on_delete=models.SET_NULL, null=True)
    verified = models.BooleanField(blank=False, default=True)

    def __str__(self):
        return f"{self.pl_name} / {self.en_name}"


class WorkoutElement(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, default='')
    min_spent = models.FloatField(blank=False)
    kcal_burnt = models.FloatField(blank=False, default=None)

    def __str__(self):
        return f'{self.exercise}'


class Workout(models.Model):
    workout_elements = models.ManyToManyField(WorkoutElement, default='')
    created_at = models.DateField(auto_now_add=True)
    min_spent_sum = models.FloatField(blank=True, null=True)
    kcal_burnt_sum = models.FloatField(blank=True, null=True)
    created_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.id} / {self.created_by}'


class WorkoutTemplateElement(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, default='')
    min_spent = models.FloatField(blank=False)
    created_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    kcal_burnt = models.FloatField(blank=False)

    def __str__(self):
        return f'{self.exercise.en_name} / {self.created_by} ({self.pk})'


class WorkoutTemplate(models.Model):
    workout_elements = models.ManyToManyField(WorkoutTemplateElement, default='', null=True)
    workout_name = models.CharField(max_length=105, blank=False)
    kcal_burnt_sum = models.FloatField(blank=True, null=True, default=None)
    min_spent_sum = models.FloatField(blank=False, null=True, default=None)
    created_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.workout_name}"
