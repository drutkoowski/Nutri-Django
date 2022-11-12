from django.contrib import admin
from .models import ExerciseUnit, Exercise, Workout, ExerciseCategory, ExerciseTemplateElement, ExerciseTemplate, \
    ExerciseTimeUnit


# Register your models here.

class ExerciseUnitAdmin(admin.ModelAdmin):
    list_display = ("en_name", "pl_name", "multiplier",)

class ExerciseTimeUnitAdmin(admin.ModelAdmin):
    list_display = ("en_time_unit_name", "pl_time_unit_name",)

class CategoryExerciseAdmin(admin.ModelAdmin):
    list_display = ("pl_category_name", "en_category_name",)
    ordering = ('pl_category_name', 'en_category_name',)


class ExerciseAdmin(admin.ModelAdmin):
    list_display = (
        "en_name", "pl_name", "unit", "category", "met",)
    ordering = ('en_name', 'pl_name',)
    search_fields = ("pl_name",)
    list_filter = ('category', 'unit',)

    def unit(self, obj):
        return "\n".join(f'{obj.unit.pl_name} / {obj.unit.en_name}')

    def category(self, obj):
        return "\n".join(f'{obj.category.pl_category_name} / {obj.category.en_category_name}')


class WorkoutAdmin(admin.ModelAdmin):
    list_display = (
        "exercises", "created_by", "created_at", "quantity", "kcal_burnt", "min_spent")

    def exercises(self, obj):
        return "\n".join([a.exercises for a in obj.exercises.all()])


class ExerciseTemplateAdmin(admin.ModelAdmin):
    list_display = ("workout_name", "workout_elements_list", "kcal_burnt", "created_by")

    def workout_elements_list(self, obj):
        return ",\n".join([a.exercise.en_name for a in obj.exercise_elements.all()])


#
admin.site.register(ExerciseUnit, ExerciseUnitAdmin)
admin.site.register(ExerciseTimeUnit, ExerciseTimeUnitAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(Workout, WorkoutAdmin)
admin.site.register(ExerciseCategory, CategoryExerciseAdmin)
admin.site.register(ExerciseTemplateElement)
admin.site.register(ExerciseTemplate, ExerciseTemplateAdmin)
