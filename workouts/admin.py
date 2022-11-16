from django.contrib import admin
from .models import ExerciseUnit, Exercise, Workout, ExerciseCategory, \
    ExerciseTimeUnit, WorkoutElement, WorkoutTemplateElement, WorkoutTemplate


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
        "exercises", "created_by", "created_at", "kcal_burnt_sum", "min_spent_sum")
    def exercises(self, obj):
        return "\n".join([f'{a.exercise.pl_name}/{a.exercise.en_name}' for a in obj.workout_elements.all()])


class WorkoutElementAdmin(admin.ModelAdmin):
    list_display = (
        "exercise", "min_spent", "kcal_burnt",)


class WorkoutTemplateAdmin(admin.ModelAdmin):
    list_display = ("workout_name", "workout_elements_list", "kcal_burnt_sum", "min_spent_sum", "created_by")

    def workout_elements_list(self, obj):
        return ",\n".join([a.exercise.en_name for a in obj.workout_elements.all()])


#
admin.site.register(ExerciseUnit, ExerciseUnitAdmin)
admin.site.register(ExerciseTimeUnit, ExerciseTimeUnitAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(Workout, WorkoutAdmin)
admin.site.register(WorkoutElement, WorkoutElementAdmin)
admin.site.register(ExerciseCategory, CategoryExerciseAdmin)
admin.site.register(WorkoutTemplateElement)
admin.site.register(WorkoutTemplate, WorkoutTemplateAdmin)
