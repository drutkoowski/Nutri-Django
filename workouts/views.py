import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect


# Create your views here.
from accounts.models import UserProfile
from workouts.models import Exercise, ExerciseUnit, ExerciseCategory, ExerciseTimeUnit, Workout, WorkoutElement


@login_required(login_url='login')
def workouts_view(request):
    return render(request, 'workouts/workouts.html')


@login_required(login_url='login')
def add_workout_view(request):
    return render(request, 'workouts/add/add_workouts.html')


# ajax calls
@login_required(login_url='login')
def live_search_exercises(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        query = request.GET.get('query')
        lang_code = request.path.split('/')[1]
        if query != '':
            if (lang_code == 'pl'):
                check_if_exercise_exists = Exercise.objects.filter(
                    pl_name__iregex=r"\b{0}\b".format(query)).all().union(
                    Exercise.objects.filter(
                        pl_name__istartswith=query
                    )).all()
            else:
                check_if_exercise_exists = Exercise.objects.filter(
                    en_name__iregex=r"\b{0}\b".format(query)).all().union(
                    Exercise.objects.filter(
                        en_name__istartswith=query
                    )).all()

            # "\y" or "\b" depends on postgres or not (\y - postgres)
            if check_if_exercise_exists is not None:
                exercises = list(check_if_exercise_exists.values())
                for i in exercises:
                    unit_id = i['unit_id']
                    category_id = i['category_id']
                    time_unit_id = i['time_unit_id']
                    unit_name = ExerciseUnit.objects.filter(pk=unit_id).first()
                    time_unit = ExerciseTimeUnit.objects.filter(pk=time_unit_id).first()
                    if unit_name is not None:
                        i['unit_name_en'] = unit_name.en_name
                        i['unit_name_pl'] = unit_name.pl_name
                    else:
                        i['unit_name_en'] = ''
                        i['unit_name_pl'] = ''
                    category = ExerciseCategory.objects.filter(pk=category_id).first()
                    i['category_name_en'] = category.get_category_name_en()
                    i['category_name_pl'] = category.get_category_name_pl()
                    i['time_unit_en'] = time_unit.get_time_unit_name_en()
                    i['time_unit_pl'] = time_unit.get_time_unit_name_pl()
                return JsonResponse({'status': 200, 'text': 'There are exercises found.', 'exercises': exercises})
            else:
                return JsonResponse({'status': 404, 'text': 'There are not exercises found.', 'exercises': []})
        else:
            return JsonResponse({'status': 404, 'text': 'There are not exercises found.', 'exercises': []})
    else:
        return redirect('home')


###

@login_required(login_url='login')
def add_today_exercise(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        exercise_array = request.POST.get('exercisesArray')
        data_array = json.loads(exercise_array)
        if exercise_array is not None:
            user_profile = UserProfile.objects.filter(user=request.user).first()
            workout = Workout.objects.create(created_by=user_profile)
            workout_kcal_burnt = []
            workout_minutes = []
            for item in data_array:
                exercise = Exercise.objects.filter(pk=item['exerciseId']).first()
                quantity_minutes = round(float(item['quantity']), 2)
                exercise_kcal = ((exercise.met * 3.5 * float(user_profile.weight)) / 200) * quantity_minutes
                workout_element = WorkoutElement.objects.create(exercise=exercise, min_spent=quantity_minutes,
                                                                kcal_burnt=exercise_kcal)
                workout_element.save()
                workout.workout_elements.add(workout_element)
                workout_minutes.append(quantity_minutes)
                workout_kcal_burnt.append(exercise_kcal)
            print(workout_kcal_burnt, workout_minutes)
            workout.kcal_burnt_sum = sum(workout_kcal_burnt)
            workout.min_spent_sum = sum(workout_minutes)
            workout.save()
            return JsonResponse({'status': 201, 'text': 'Created.'})
        return JsonResponse({'status': 400, 'text': 'Not Created.'})
    else:
        return redirect('home')






def test(request):
    import json

    # Opening JSON file
    f = open('C:\\Users\\user\\PycharmProjects\\pythonProject30\\data.json', encoding='utf-8')

    # returns JSON object as
    # a dictionary
    data = json.load(f)
    from googletrans import Translator
    translator = Translator()
    for exercise in data:

        met = exercise[0]['met']
        exercise_met = round(float(met),2)
        exercise_name = exercise[0]['exerciseName']
        try:

            translation = translator.translate(exercise_name, dest='pl')
            category = ExerciseCategory.objects.filter(en_category_name__iexact='Gym exercises').first()
            # unit = ExerciseUnit.objects.filter(en_name__iexact='km').first()
            time_unit = ExerciseTimeUnit.objects.filter(en_time_unit_name__iexact='minutes').first()
            if_exists = Exercise.objects.filter(pl_name__iexact=translation.text, en_name__iexact=exercise_name).first()
            if_exists2 = Exercise.objects.filter(en_name__iexact=exercise_name, met=met).first()
            # print(exercise_met, exercise_name, unit, category, time_unit, translation.text)
            if if_exists is None and if_exists2 is None:
                new_ingredient = Exercise.objects.create(pl_name=translation.text, en_name=exercise_name,
                                                         category=category, time_unit=time_unit, met=exercise_met)
                new_ingredient.save()
                print(f'{exercise_name} dodano')
        except:
            pass
        else:
            # print(f'{exercise_name} nie dodano')
            pass
    return render(request, 'workouts/test.html')
def test2(request):
    return

# def add_ingredient(request):
#     if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
#         meal_name = request.POST.get('mealName')
#         serving_unit = request.POST.get('serving_unit')
#         calories = round(float(request.POST.get('calories')), 5)
#         cholesterol = round(float(request.POST.get('cholesterol')), 5)
#         fiber = round(float(request.POST.get('fiber')), 5)
#         potassium = round(float(request.POST.get('potassium')), 5)
#         saturated_fat = round(float(request.POST.get('saturated_fat')), 5)
#         sodium = round(float(request.POST.get('sodium')), 5)
#         sugars = round(float(request.POST.get('sugars')), 5)
#         carbs = round(float(request.POST.get('carbs')), 5)
#         fat = round(float(request.POST.get('fat')), 5)
#         protein = round(float(request.POST.get('protein')), 5)
#         serving_grams = round(float(request.POST.get('serving_grams')), 5)
#         serving_ml = round(float(request.POST.get('servingMl')), 5)
#         category = IngredientCategory.objects.filter(en_category_name__iexact='Meat').first()
#
#         unit = IngredientUnit.objects.filter(en_name__iexact=serving_unit).first()
#         from googletrans import Translator
#
#         translator = Translator()
#         translation = translator.translate(meal_name, dest='pl')
#         if_exists = Ingredient.objects.filter(pl_name__iexact=translation.text, en_name__iexact=meal_name).first()
#         if_exist2 = Ingredient.objects.filter(kcal=calories,
#                                               unit=unit, cholesterol=cholesterol, carbs=carbs,
#                                               protein=protein, fat=fat, fiber=fiber,
#                                               saturated_fat=saturated_fat, sodium=sodium,
#                                               sugar=sugars, potassium=potassium,
#                                               serving_grams=serving_grams).first()
#         if if_exists is None and if_exist2 is None:
#             new_ingredient = Ingredient.objects.create(pl_name=translation.text, en_name=meal_name, kcal=calories,
#                                                        unit=unit, cholesterol=cholesterol, carbs=carbs,
#                                                        protein=protein, fat=fat, fiber=fiber,
#                                                        saturated_fat=saturated_fat, sodium=sodium,
#                                                        sugar=sugars, potassium=potassium,
#                                                        serving_grams=serving_grams, category=category,
#                                                        serving_ml=serving_ml)
#             new_ingredient.save()
#             return JsonResponse({'status': 201})
#         else:
#             print(
#                 f"{meal_name}, {serving_unit}, {calories}, {cholesterol}, {fiber}, {potassium}, {saturated_fat}, {sodium}, {sugars}, {carbs}, {fat}, {protein}, {serving_grams}")
#             return JsonResponse({'status': 302})
#     else:
#         return JsonResponse({'status': 404})