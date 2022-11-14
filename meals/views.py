import json

from django.contrib.auth.decorators import login_required
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
def meal_propositions_view(request):
    return render(request, 'meals/propositions/meal_propositions.html')


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
        lang_code = request.path.split('/')[1]
        if query != '':
            if (lang_code == 'pl'):
                check_if_ingredient_exists = Ingredient.objects.filter(
                    pl_name__iregex=r"\b{0}\b".format(query)).all().union(
                    Ingredient.objects.filter(
                        pl_name__istartswith=query
                    )).all()
            else:
                check_if_ingredient_exists = Ingredient.objects.filter(
                    en_name__iregex=r"\b{0}\b".format(query)).all().union(
                    Ingredient.objects.filter(
                        en_name__istartswith=query
                    )).all()

            # "\y" or "\b" depends on postgres or not (\y - postgres)
            if check_if_ingredient_exists is not None:
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
                return JsonResponse({'status': 200, 'text': 'There are ingredients found.', 'ingredients': ingredients})
            else:
                return JsonResponse({'status': 404, 'text': 'There are not ingredients found.', 'ingredients': []})
        else:
            return JsonResponse({'status': 404, 'text': 'There are not ingredients found.', 'ingredients': []})
    else:
        return redirect('home')


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
                if (unit_ml_g):
                    multiplier = quantity / 100.0
                else:
                    multiplier = quantity
                meal_kcal = float(ingredient.kcal) * float(multiplier)
                meal_carbs = float(ingredient.carbs) * float(multiplier)

                meal_protein = None if ingredient.protein is None else round(
                    float(ingredient.protein) * float(multiplier), 5)

                meal_fat = None if ingredient.fat is None else round(float(ingredient.fat) * float(multiplier), 5)

                meal_fiber = None if ingredient.fiber is None else round(float(ingredient.fiber) * float(multiplier), 5)

                meal_saturated_fat = None if ingredient.saturated_fat is None else round(
                    float(ingredient.saturated_fat) * float(multiplier), 5)

                meal_cholesterol = None if ingredient.cholesterol is None else round(
                    float(ingredient.cholesterol) * float(multiplier), 5)

                meal_sodium = None if ingredient.sodium is None else round(float(ingredient.sodium) * float(multiplier),
                                                                           5)

                meal_sugar = None if ingredient.sugar is None else round(float(ingredient.sugar) * float(multiplier), 5)

                meal_potassium = None if ingredient.potassium is None else round(
                    float(ingredient.potassium) * float(multiplier), 5)

                meal_serving_grams = None if ingredient.serving_grams is None else round(float(
                    ingredient.serving_grams) * float(multiplier), 5)

                meal_serving_ml = None if ingredient.serving_ml is None else round(float(ingredient.serving_ml) * float(
                    multiplier), 5)

                meal = Meal.objects.create(created_by=user_profile, quantity=quantity, ingredient=ingredient,
                                           kcal=meal_kcal, carbs=meal_carbs, protein=meal_protein, fat=meal_fat,
                                           fiber=meal_fiber, saturated_fat=meal_saturated_fat,
                                           cholesterol=meal_cholesterol, sodium=meal_sodium, sugar=meal_sugar,
                                           potassium=meal_potassium, serving_grams=meal_serving_grams,
                                           serving_ml=meal_serving_ml)
                meal.save()
            return JsonResponse({'status': 201, 'text': 'Created.'})
        return JsonResponse({'status': 400, 'text': 'Not Created.'})
    else:
        return redirect('home')


@login_required(login_url='login')
def add_saved_meal_element(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        print(request.method, 'asdasd')
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
            'fiber': template_element.ingredient.fiber,
            'saturated_fat': template_element.ingredient.saturated_fat,
            'cholesterol': template_element.ingredient.cholesterol,
            'sodium': template_element.ingredient.sodium,
            'sugar': template_element.ingredient.sugar,
            'potassium': template_element.ingredient.potassium,
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
    return redirect('home')


@login_required(login_url='login')
def get_saved_meal_template(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'GET':
        template_id = request.GET.get('templateId')
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
    return redirect('home')


@login_required(login_url='login')
def delete_saved_meal_template(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest' and request.method == 'POST':
        meal_template_id = request.POST.get('mealTemplateId')
        user_profile = UserProfile.objects.get(user=request.user)
        meal_template = MealTemplate.objects.get(pk=meal_template_id, created_by=user_profile)
        meal_template.delete()
        return JsonResponse({'status': 200, 'text': 'Object deleted successfully!'})


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
