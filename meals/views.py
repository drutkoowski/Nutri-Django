import datetime
import json

from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render, redirect

from accounts.models import UserProfile
from .models import Ingredient, IngredientUnit, Meal, IngredientCategory, MealTemplateElement, MealTemplate


# Create your views here.
@login_required(login_url='login')
def meals_view(request):
    return render(request, 'meals/meals.html')


@login_required(login_url='login')
def add_meal_view(request):
    user_profile = UserProfile.objects.get(user=request.user)
    from datetime import datetime
    meals_added_today = Meal.objects.filter(created_by=user_profile, created_at__contains=datetime.today().date()).all()
    meal_templates = MealTemplate.objects.filter(created_by=user_profile).all()
    context = {
        'todayMeals': meals_added_today,
        'saved_templates': meal_templates
    }
    return render(request, 'meals/add/add_meals.html', context)


@login_required(login_url='login')
def meal_enter_view(request):
    meal_categories = IngredientCategory.objects.all()
    context = {
        'meal_categories': meal_categories
    }
    return render(request, 'meals/enter/meal_enter.html', context)


@login_required(login_url='login')
def saved_meals_view(request):
    user_profile = UserProfile.objects.filter(user=request.user)
    meal_templates = MealTemplate.objects.filter(created_by__in=user_profile).all()
    context = {
        "saved_templates": meal_templates
    }
    return render(request, 'meals/saved/saved_meals.html', context)


# ajax calls
@login_required(login_url='login')
def live_search_ingredients(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        query = request.GET.get('query')
        is_verified = str(request.GET.get('isVerified'))
        lang_code = request.path.split('/')[1]
        if query != '':
            if lang_code == 'pl' and is_verified == 'true':
                check_if_ingredient_exists = Ingredient.objects.filter(
                    pl_name__iregex=r"\b{0}\b".format(query), verified=True).all().union(
                    Ingredient.objects.filter(
                        pl_name__istartswith=query, verified=True
                    )).all()
            elif lang_code == 'pl' and is_verified == 'false':
                check_if_ingredient_exists = Ingredient.objects.filter(
                    pl_name__iregex=r"\b{0}\b".format(query)).all().union(
                    Ingredient.objects.filter(
                        pl_name__istartswith=query
                    )).all()
            if lang_code == 'en' and is_verified == 'true':
                check_if_ingredient_exists = Ingredient.objects.filter(
                    en_name__iregex=r"\b{0}\b".format(query), verified=True).all().union(
                    Ingredient.objects.filter(
                        en_name__istartswith=query, verified=True
                    )).all()
            elif lang_code == 'en' and is_verified == 'false':
                check_if_ingredient_exists = Ingredient.objects.filter(
                    en_name__iregex=r"\b{0}\b".format(query)).all().union(
                    Ingredient.objects.filter(
                        en_name__istartswith=query
                    )).all()

            # "\y" or "\b" depends on postgres or not (\y - postgres)
            if check_if_ingredient_exists is not None and check_if_ingredient_exists.count() > 0:
                ingredients = list(check_if_ingredient_exists.values())
                for i in ingredients:
                    unit_id = i['unit_id']
                    category_id = i['category_id']
                    unit_name = IngredientUnit.objects.filter(pk=unit_id).first()
                    category = IngredientCategory.objects.filter(pk=category_id).first()
                    i['unit_name_en'] = unit_name.get_unit_name_en()
                    i['unit_name_pl'] = unit_name.get_unit_name_pl()
                    i['category_name_en'] = category.get_category_name_en()
                    i['category_name_pl'] = category.get_category_name_pl()
                    i['unit_multiplier'] = unit_name.multiplier
                if len(ingredients) > 0:
                    return JsonResponse(
                        {'status': 200, 'text': 'There are ingredients found.', 'ingredients': ingredients})
                else:
                    return JsonResponse({'status': 404, 'text': 'There are not ingredients found.', 'ingredients': []})
            else:
                return JsonResponse({'status': 404, 'text': 'There are not ingredients found.', 'ingredients': []})
        else:
            return JsonResponse({'status': 404, 'text': 'There are not ingredients found.', 'ingredients': []})
    else:
        return redirect('home')


@login_required(login_url='login')
def add_new_meal_element(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        user_profile = UserProfile.objects.get(user=request.user)
        category_pk = request.POST.get('categoryPk')
        kcal = request.POST.get('kcal')
        carbs = request.POST.get('carbs')
        fat = request.POST.get('fat')
        protein = request.POST.get('protein')
        serving_grams = request.POST.get('servingGrams')
        lang_code = request.POST.get('langCode')
        name = request.POST.get('name')
        category = IngredientCategory.objects.get(pk=category_pk)
        unit = IngredientUnit.objects.get(pl_name__iexact='g')
        from googletrans import Translator
        translator = Translator()
        if lang_code == 'pl':
            name_pl = name
            name_en = translator.translate(name, dest='en').text
        else:
            name_en = name
            name_pl = translator.translate(name, dest='pl').text

        is_existing = Ingredient.objects.filter(Q(pl_name__iexact=name_pl) | Q(en_name__iexact=name_en)).all()
        if not is_existing.exists():
            divide = float(serving_grams)
            handler_kcal = 0 if kcal is None else float(kcal) / divide
            handler_carbs = 0 if carbs is None else float(carbs) / divide
            handler_protein = 0 if protein is None else float(protein) / divide
            handler_fat = 0 if fat is None else float(fat) / divide
            new_serving_grams = 100.0
            new_kcal = round(handler_kcal * new_serving_grams, 2)
            new_carbs = round(handler_carbs * new_serving_grams, 2)
            new_fat = round(handler_fat * new_serving_grams, 2)
            new_protein = round(handler_protein * new_serving_grams, 2)
            element = Ingredient.objects.create(pl_name=name_pl, en_name=name_en, category=category, kcal=new_kcal, carbs=new_carbs,
                                            protein=new_protein, fat=new_fat, unit=unit, serving_grams=new_serving_grams, created_by=user_profile,
                                            verified=False)
            element.save()
            return JsonResponse({'status': 200, 'text': 'Element created'})
        else:
            return JsonResponse({'status': 400, 'text': 'Element not created'})


@login_required(login_url='login')
def get_eaten_macro_today(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        user_profile = UserProfile.objects.get(user=request.user)
        today = datetime.date.today()
        try:
            meals = Meal.objects.filter(created_by=user_profile, created_at=today).all()
            kcal_sum = 0
            protein_sum = 0
            carbs_sum = 0
            fat_sum = 0
            for meal in meals:
                kcal_sum = kcal_sum + meal.kcal
                protein_sum = protein_sum + meal.protein
                carbs_sum = carbs_sum + meal.carbs
                fat_sum = fat_sum + meal.fat
            return JsonResponse({'status': 200, 'text': 'Meals found.', 'kcalEaten': kcal_sum,
                                 'proteinEaten': protein_sum, 'carbsEaten': carbs_sum, 'fatEaten': fat_sum})
        except:
            return JsonResponse({'status': 404, 'text': 'Meals not found.', 'kcalEaten': '', 'proteinEaten': '',
                                 'carbsEaten': '', "fatEaten": ''})


@login_required(login_url='login')
def add_today_meal_ajax(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        ingredients_array = request.POST.get('ingredientsArray')
        data_array = json.loads(ingredients_array)
        if ingredients_array is not None:
            user_profile = UserProfile.objects.filter(user=request.user).first()
            for item in data_array:
                ingredient = Ingredient.objects.filter(pk=item['ingredientId']).first()
                unit_ml_g = ingredient.unit.en_name == 'g' or ingredient.unit.en_name == 'ml'
                quantity = float(item['quantity'])
                if unit_ml_g:
                    multiplier = quantity / 100.0
                else:
                    multiplier = quantity
                print(ingredient.kcal, multiplier, round(float(ingredient.kcal) * float(multiplier), 2))
                meal_kcal = round(float(ingredient.kcal) * float(multiplier), 2)
                meal_carbs = round(float(ingredient.carbs) * float(multiplier), 2)

                meal_protein = None if ingredient.protein is None else round(
                    float(ingredient.protein) * float(multiplier), 5)

                meal_fat = None if ingredient.fat is None else round(float(ingredient.fat) * float(multiplier), 5)

                meal_serving_grams = None if ingredient.serving_grams is None else round(float(
                    ingredient.serving_grams) * float(multiplier), 5)

                meal_serving_ml = None if ingredient.serving_ml is None else round(float(ingredient.serving_ml) * float(
                    multiplier), 5)

                meal = Meal.objects.create(created_by=user_profile, quantity=quantity, ingredient=ingredient,
                                           kcal=meal_kcal, carbs=meal_carbs, protein=meal_protein, fat=meal_fat,
                                           serving_grams=meal_serving_grams,serving_ml=meal_serving_ml)
                meal.save()
            return JsonResponse({'status': 201, 'text': 'Created.'})
        return JsonResponse({'status': 400, 'text': 'Not Created.'})
    else:
        return redirect('home')


@login_required(login_url='login')
def add_saved_meal_element(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        ingredients_array = request.POST.get('ingredientsArray')
        data = json.loads(ingredients_array)
        meal_name = request.POST.get('mealName')
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            meal_template = MealTemplate(meal_name=meal_name, created_by=user_profile)
            meal_template.save()
            sum_kcal = 0
            sum_carbs = 0
            sum_protein = 0
            sum_fat = 0
            for ingredient in data:
                ing_obj = ingredient["ingObj"]
                ing_id = ing_obj["id"]
                quantity = ingredient["quantity"]
                sum_kcal = sum_kcal + (None if ing_obj['kcal'] is None else round(
                    float(ing_obj['kcal']) * float(quantity), 5))
                sum_carbs = sum_carbs + (None if ing_obj['carbs'] is None else round(
                    float(ing_obj['carbs']) * float(quantity), 5))
                sum_protein = sum_protein + (None if ing_obj['protein'] is None else round(
                    float(ing_obj['protein']) * float(quantity), 5))
                sum_fat = sum_fat + (None if ing_obj['fat'] is None else round(float(ing_obj['fat']) * float(quantity),
                                                                               5))
                meal_el = MealTemplateElement.objects.create(ingredient_id=ing_id, quantity=quantity,
                                                             created_by=user_profile)
                meal_template.meal_elements.add(meal_el)
            meal_template.kcal = round(sum_kcal, 5)
            meal_template.carbs = round(sum_carbs, 5)
            meal_template.protein = round(sum_protein, 5)
            meal_template.fat = round(sum_fat, 5)
            meal_template.save()
            return JsonResponse({'status': 201, 'text': 'Meal template created!'})
        except:
            return JsonResponse({'status': 400, 'text': 'Some error occurred, meal template not created!'})


@login_required(login_url='login')
def get_saved_meal_template_element(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        element_id = request.GET.get('mealElementId')
        try:
            template_element = MealTemplateElement.objects.get(pk=element_id)
            template_obj_dict = {
                "mealTemplateElementId": template_element.pk,
                "ingredientId": template_element.ingredient.pk,
                "quantity": template_element.quantity,
                "templateElementName_en": template_element.ingredient.en_name,
                "templateElementName_pl": template_element.ingredient.pl_name,
                "unit_multiplier": template_element.ingredient.unit.multiplier,
                "unit_name_pl": template_element.ingredient.unit.pl_name,
                "unit_name_en": template_element.ingredient.unit.en_name,
                "kcal": template_element.ingredient.kcal,
                "serving_grams": template_element.ingredient.serving_grams
            }
            ingredient_obj_dict = {
                "id": template_element.ingredient.pk,
                'en_name': template_element.ingredient.en_name,
                'category_id': template_element.ingredient.category.pk,
                'unit_id': template_element.ingredient.unit.pk,
                'kcal': template_element.ingredient.kcal,
                'carbs': template_element.ingredient.carbs,
                'protein': template_element.ingredient.protein,
                'fat': template_element.ingredient.fat,
                'serving_grams': template_element.ingredient.serving_grams,
                'serving_ml': template_element.ingredient.serving_ml,
                'unit_name_en': template_element.ingredient.unit.en_name,
                'unit_name_pl': template_element.ingredient.unit.pl_name,
                'category_name_en': template_element.ingredient.category.en_category_name,
                'category_name_pl': template_element.ingredient.category.pl_category_name,
                'unit_multiplier': template_element.ingredient.unit.multiplier
            }
            return JsonResponse(
                {'status': 302, 'text': 'Meal Template Element Found',
                 "mealTemplateElement": json.dumps(template_obj_dict),
                 "ingredientElement": json.dumps(ingredient_obj_dict)})
        except:
            return JsonResponse(
                {'status': 404, 'text': 'Meal Template Element Found',
                 "mealTemplateElement": '',
                 "ingredientElement": ''
                 })
    return redirect('home')


@login_required(login_url='login')
def get_saved_meal_template(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        template_id = request.GET.get('templateId')
        try:
            template = MealTemplate.objects.get(pk=template_id)
            template_obj_dict = {
                "meal_name": template.meal_name,
                "meal_elements_ids": [],
                "mealId": template_id,
                "kcal": template.kcal,
                "created_by_id": template.created_by.pk,
            }
            for element in template.meal_elements.all():
                arr = template_obj_dict['meal_elements_ids']
                arr.append(element.pk)
                template_obj_dict['meal_elements_ids'] = arr
            return JsonResponse(
                {'status': 302, 'text': 'Meal Template Found', "mealTemplateObj": json.dumps(template_obj_dict)})
        except:
            return JsonResponse(
                {'status': 404, 'text': 'Meal Template Found', "mealTemplateObj": ''})
    return redirect('home')


@login_required(login_url='login')
def delete_saved_meal_template(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        meal_template_id = int(request.POST.get('mealTemplateId'))
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            meal_template = MealTemplate.objects.get(pk=meal_template_id, created_by=user_profile)
            meal_template.delete()
            return JsonResponse({'status': 200, 'text': 'Object deleted successfully!'})
        except:
            return JsonResponse({'status': 404, 'text': 'Object not deleted!'})


@login_required(login_url='login')
def delete_today_meal_ajax(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        meal_id = request.POST.get('meal_id')
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            meal = Meal.objects.get(pk=meal_id, created_by=user_profile)
            meal.delete()
            return JsonResponse({'status': 200, 'text': f'Item with id {meal_id} successfully deleted!'})
        except:
            return JsonResponse({'status': 400, 'text': f'Item with id {meal_id} was not deleted!'})
    else:
        return redirect('home')
