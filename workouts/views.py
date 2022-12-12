import datetime
import json
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render, redirect
from accounts.models import UserProfile
from workouts.models import Exercise, ExerciseUnit, ExerciseCategory, ExerciseTimeUnit, Workout, WorkoutElement, \
    WorkoutTemplate, WorkoutTemplateElement


# Create your views here.


@login_required(login_url='login')
def workouts_view(request):
    return render(request, 'workouts/workouts.html')


@login_required(login_url='login')
def add_workout_view(request):
    user_profile = UserProfile.objects.get(user=request.user)
    from datetime import datetime
    workouts_added_today = Workout.objects.filter(created_by=user_profile,
                                                  created_at__contains=datetime.today().date()).all()
    workout_templates = WorkoutTemplate.objects.filter(created_by=user_profile).all()
    context = {
        'todayWorkouts': workouts_added_today,
        'saved_templates': workout_templates
    }
    return render(request, 'workouts/add/add_workouts.html', context)


@login_required(login_url='login')
def enter_activity(request):
    activity_categories = ExerciseCategory.objects.all()
    context = {
        'activity_categories': activity_categories
    }
    return render(request, 'workouts/enter/activity_enter.html', context)


@login_required(login_url='login')
def saved_workout_view(request):
    user_profile = UserProfile.objects.filter(user=request.user)
    workout_templates = WorkoutTemplate.objects.filter(created_by__in=user_profile).all()
    context = {
        "saved_templates": workout_templates
    }
    return render(request, 'workouts/saved/saved_workouts.html', context)


# ajax calls
@login_required(login_url='login')
def live_search_exercises(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        query = request.GET.get('query')
        lang_code = request.path.split('/')[1]
        is_verified = str(request.GET.get('isVerified'))
        if query != '':
            if lang_code == 'pl' and is_verified == 'true':
                check_if_exercise_exists = Exercise.objects.filter(
                    pl_name__iregex=r"\b{0}\b".format(query), verified=True).all().union(
                    Exercise.objects.filter(pl_name__istartswith=query, verified=True)).all()
            elif lang_code == 'pl' and is_verified == 'false':
                check_if_exercise_exists = Exercise.objects.filter(
                    pl_name__iregex=r"\b{0}\b".format(query)).all().union(
                    Exercise.objects.filter(
                        pl_name__istartswith=query
                    )).all()
            if lang_code == 'en' and is_verified == 'true':
                check_if_exercise_exists = Exercise.objects.filter(
                    en_name__iregex=r"\b{0}\b".format(query), verified=True).all().union(
                    Exercise.objects.filter(en_name__istartswith=query, verified=True)).all()
            elif lang_code == 'en' and is_verified == 'false':
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


@login_required(login_url='login')
def add_new_activity_element(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        user_profile = UserProfile.objects.get(user=request.user)
        category_pk = request.POST.get('categoryPk')
        met = request.POST.get('met')
        lang_code = request.POST.get('langCode')
        name = request.POST.get('name')
        category = ExerciseCategory.objects.get(pk=category_pk)
        time_unit = ExerciseTimeUnit.objects.get(en_time_unit_name='minutes')
        from googletrans import Translator
        translator = Translator()
        if lang_code == 'pl':
            name_pl = name
            name_en = translator.translate(name, dest='en').text
        else:
            name_en = name
            name_pl = translator.translate(name, dest='pl').text

        is_existing = Exercise.objects.filter(Q(pl_name__iexact=name_pl) | Q(en_name__iexact=name_en)).all()
        if not is_existing.exists():
            element = Exercise.objects.create(pl_name=name_pl, en_name=name_en, category=category, met=met,
                                              time_unit=time_unit, unit=None, created_by=user_profile, verified=False)
            element.save()
            return JsonResponse({'status': 200, 'text': 'Element created'})
        else:
            return JsonResponse({'status': 400, 'text': 'Element not created'})


@login_required(login_url='login')
def get_exercise_by_id(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        exercise_id = request.GET.get('exerciseId')
        try:
            exercise = Exercise.objects.get(pk=exercise_id)
            exercise_dict = {
                'pl_name': exercise.pl_name,
                'en_name': exercise.en_name,
                'id': exercise.pk,
                'time_unit_en': exercise.time_unit.en_time_unit_name,
                'time_unit_pl': exercise.time_unit.pl_time_unit_name,
                'category_name_pl': exercise.category.pl_category_name,
                'category_name_en': exercise.category.en_category_name,
            }
            return JsonResponse(
                {'status': 200, 'text': 'There is exercise found.', 'exercise': json.dumps(exercise_dict)})
        except:
            return JsonResponse({'status': 404, 'text': 'There is not exercise found.', 'exercise': []})


@login_required(login_url='login')
def get_daily_summary(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        user_profile = UserProfile.objects.get(user=request.user)
        today = datetime.date.today()
        try:
            workouts = Workout.objects.filter(created_by=user_profile, created_at=today).all()
            kcal_burnt_sum = 0
            duration_sum = 0
            for workout in workouts:
                kcal_burnt_sum = round(kcal_burnt_sum + workout.kcal_burnt_sum, 2)
                duration_sum = round(duration_sum + workout.min_spent_sum, 2)
            return JsonResponse({'status': 200, 'text': 'Workouts found.', 'kcalBurntSum': kcal_burnt_sum,
                                 'durationSum': duration_sum})
        except:
            return JsonResponse({'status': 404, 'text': 'Workouts not found.', 'kcalBurntSum': '', 'durationSum': ''})


@login_required(login_url='login')
def get_saved_workout_template(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        template_id = request.GET.get('templateId')
        try:
            template = WorkoutTemplate.objects.get(pk=template_id)
            template_obj_dict = {
                "workout_name": template.workout_name,
                "workout_elements_ids": [],
                "workoutId": template_id,
                "kcal_burnt_sum": template.kcal_burnt_sum,
                "min_spent_sum": template.min_spent_sum,
                "created_by_id": template.created_by.pk,
            }
            for element in template.workout_elements.all():
                arr = template_obj_dict['workout_elements_ids']
                arr.append(element.pk)
                template_obj_dict['workout_elements_ids'] = arr
            return JsonResponse({'status': 302, 'text': 'Workout Template Found',
                                 "workoutTemplateObj": json.dumps(template_obj_dict)})
        except:
            return JsonResponse({'status': 404, 'text': 'Workout Template Not Found',
                                 "workoutTemplateObj": ''})
    return redirect('home')


@login_required(login_url='login')
def get_saved_workout_template_element(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        element_id = request.GET.get('workoutElementId')
        template_element = WorkoutTemplateElement.objects.get(pk=element_id)
        try:
            template_obj_dict = {
                "workoutTemplateElementId": template_element.pk,
                "exerciseId": template_element.exercise.pk,
                "min_spent": template_element.min_spent,
                "kcal_burnt": template_element.kcal_burnt,
                "templateElementName_en": template_element.exercise.en_name,
                "templateElementName_pl": template_element.exercise.pl_name,
                "unit_name_pl": template_element.exercise.unit.pl_name if template_element.exercise.unit else None,
                "unit_name_en": template_element.exercise.unit.en_name if template_element.exercise.unit else None
            }
            exercise_obj_dict = {
                "id": template_element.exercise.pk,
                'en_name': template_element.exercise.en_name,
                'pl_name': template_element.exercise.pl_name,
                'category_id': template_element.exercise.category.pk,
                'unit_id': template_element.exercise.unit.pk if template_element.exercise.unit else None,
                'unit_name_en': template_element.exercise.unit.en_name if template_element.exercise.unit else None,
                'unit_name_pl': template_element.exercise.unit.pl_name if template_element.exercise.unit else None,
                'category_name_en': template_element.exercise.category.en_category_name,
                'category_name_pl': template_element.exercise.category.pl_category_name,
            }
            return JsonResponse(
                {'status': 302, 'text': 'Workout Template Element Found',
                 "workoutTemplateElement": json.dumps(template_obj_dict),
                 "workoutElement": json.dumps(exercise_obj_dict)})
        except:
            return JsonResponse(
                {'status': 404, 'text': 'Workout Template Element Not Found',
                 "workoutTemplateElement": '',
                 "workoutElement": ''
                 })
    return redirect('home')


@login_required(login_url='login')
def add_today_exercise(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        exercise_array = request.POST.get('exercisesArray')
        workout_id = request.POST.get('workoutId')
        data_array = json.loads(exercise_array)
        if exercise_array is not None:
            user_profile = UserProfile.objects.filter(user=request.user).first()
            workout_kcal_burnt = []
            workout_minutes = []
            workout = Workout.objects.get(pk=workout_id)
            for item in data_array:
                item_type = item['type']
                if item_type == 'exerciseElement':
                    exercise = Exercise.objects.get(pk=item['id'])
                    quantity_minutes = round(float(item['quantity']), 2)
                    exercise_kcal = round(((exercise.met * 3.5 * float(user_profile.weight)) / 200)
                                          * quantity_minutes, 2)
                    workout_element = WorkoutElement.objects.create(exercise=exercise,
                                                                    min_spent=quantity_minutes,
                                                                    kcal_burnt=exercise_kcal)
                    workout_element.save()
                    workout.workout_elements.add(workout_element)
                    workout_minutes.append(quantity_minutes)
                    workout_kcal_burnt.append(exercise_kcal)
                elif item_type == 'templateElement':
                    quantity = round(float(item['quantity']), 2)
                    for exercise_el_id in item['id']:
                        exercise_el = WorkoutTemplateElement.objects.get(pk=exercise_el_id)
                        exercise_minutes = exercise_el.min_spent * quantity
                        exercise_kcal = round(((exercise_el.exercise.met * 3.5 * float(user_profile.weight)) / 200)
                                              * exercise_minutes, 2)

                        workout_element = WorkoutElement.objects.create(exercise=exercise_el.exercise,
                                                                        min_spent=exercise_minutes,
                                                                        kcal_burnt=exercise_kcal)
                        workout_element.save()
                        workout.workout_elements.add(workout_element)
                        workout_minutes.append(exercise_minutes)
                        workout_kcal_burnt.append(exercise_kcal)
            workout.kcal_burnt_sum = round(sum(workout_kcal_burnt), 2)
            workout.min_spent_sum = round(sum(workout_minutes), 2)
            workout.save()
            return JsonResponse({'status': 201, 'text': 'Created.'})
        return JsonResponse({'status': 400, 'text': 'Not Created.'})
    else:
        return redirect('home')


@login_required(login_url='login')
def save_workout(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            workout = Workout.objects.create(created_by=user_profile)
            workout_pk = workout.pk
            return JsonResponse({'status': 201, 'text': 'Created.', 'workoutId': workout_pk})
        except:
            return JsonResponse({'status': 401, 'text': 'Not created.', 'workoutId': ''})


@login_required(login_url='login')
def save_workout_template(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        workout_name = request.POST.get('workoutName')
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            workout = WorkoutTemplate.objects.create(created_by=user_profile, workout_name=workout_name)
            workout.save()
            return JsonResponse({'status': 200, 'text': 'Workout Template Created.', 'workoutId': workout.pk})
        except:
            return JsonResponse({'status': 500, 'text': 'Workout template not created.', 'workoutId': ''})


@login_required(login_url='login')
def save_workout_template_element(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        workout_template_id = request.POST.get('workoutId')
        exercise_obj_arr_json = json.loads(request.POST.get('exerciseObjArr'))
        user_profile = UserProfile.objects.get(user=request.user)
        workout_template = WorkoutTemplate.objects.get(pk=workout_template_id, created_by=user_profile)
        try:
            for i in exercise_obj_arr_json:
                exercise = Exercise.objects.get(pk=i['exercisePk'])
                min_spent = float(i['quantity'])
                exercise_kcal = round(((exercise.met * 3.5 * float(user_profile.weight)) / 200) * min_spent, 2)
                workout_template_element = WorkoutTemplateElement.objects.create(exercise=exercise,
                                                                                 min_spent=min_spent,
                                                                                 kcal_burnt=exercise_kcal,
                                                                                 created_by=user_profile)
                workout_template_element.save()
                workout_template.workout_elements.add(workout_template_element)
                workout_template.kcal_burnt_sum = round(float((0.0 if workout_template.kcal_burnt_sum is None else
                                                               workout_template.kcal_burnt_sum) + exercise_kcal), 2)
                workout_template.min_spent_sum = round(float((0.0 if workout_template.min_spent_sum is None else
                                                              workout_template.min_spent_sum) + min_spent), 2)
                workout_template.save()
            return JsonResponse({'status': 201, 'text': 'Workout Element Created.'})
        except:
            return JsonResponse({'status': 400, 'text': 'Workout Element Not Created.'})


@login_required(login_url='login')
def delete_today_workout(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        workout_id = request.POST.get('workout_id')
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            workout = Workout.objects.get(pk=workout_id, created_by=user_profile)
            workout_elements = WorkoutElement.objects.filter(workout__pk=workout_id).all()
            for el in workout_elements:
                el.delete()
            workout.delete()
            return JsonResponse({'status': 200, 'text': f'Item with id {workout_id} successfully deleted!'})
        except:
            return JsonResponse({'status': 400, 'text': f'Item with id {workout_id} was not deleted!'})
    else:
        return redirect('home')


@login_required(login_url='login')
def delete_today_workout_element(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        workout_element_id = request.POST.get('workout_element_id')
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            workouts = Workout.objects.filter(created_by=user_profile).all()
            for workout in workouts:
                for element in workout.workout_elements.all():
                    elements_count = len(workout.workout_elements.all())
                    if int(element.pk) == int(workout_element_id):
                        element = WorkoutElement.objects.get(pk=element.pk)
                        workout.kcal_burnt_sum = workout.kcal_burnt_sum - element.kcal_burnt
                        workout.min_spent_sum = workout.min_spent_sum - element.min_spent
                        workout.workout_elements.remove(element)
                        workout.save()
                        element.delete()
                        if elements_count == 1:
                            workout.delete()
            return JsonResponse({'status': 200, 'text': f'Item with id {workout_element_id} successfully deleted!'})
        except:
            return JsonResponse({'status': 400, 'text': f'Item with id {workout_element_id} was not deleted!'})
    else:
        return redirect('home')


@login_required(login_url='login')
def delete_workout_template_element(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        workout_template_id = request.POST.get('workoutTemplateId')
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            workout_template = WorkoutTemplate.objects.get(pk=workout_template_id, created_by=user_profile)
            workout_template.delete()
            return JsonResponse({'status': 200, 'text': f'Item with id {workout_template_id} successfully deleted!'})
        except:
            return JsonResponse({'status': 400, 'text': f'Item with id {workout_template_id} was not deleted!'})
    else:
        return redirect('home')


@login_required(login_url='login')
def delete_saved_workout_template(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        workout_template_id = request.POST.get('workoutTemplateId')
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            workout_template = WorkoutTemplate.objects.get(pk=workout_template_id, created_by=user_profile)
            for element in workout_template.workout_elements.all():
                element.delete()
            workout_template.delete()
            return JsonResponse({'status': 200, 'text': 'Object deleted successfully!'})
        except:
            return JsonResponse({'status': 401, 'text': 'Object not deleted!'})
