# Generated by Django 4.1.2 on 2022-12-16 23:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pl_name', models.CharField(blank=True, max_length=100)),
                ('en_name', models.CharField(max_length=100)),
                ('kcal', models.FloatField(default=None)),
                ('carbs', models.FloatField(blank=True, default=None, null=True)),
                ('protein', models.FloatField(blank=True, default=None, null=True)),
                ('fat', models.FloatField(blank=True, default=None, null=True)),
                ('serving_grams', models.FloatField(blank=True, default=None, null=True)),
                ('serving_ml', models.FloatField(blank=True, default=None, null=True)),
                ('verified', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='IngredientCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pl_category_name', models.CharField(blank=True, max_length=100)),
                ('en_category_name', models.CharField(blank=True, max_length=100)),
            ],
            options={
                'verbose_name_plural': 'Ingredient categories',
            },
        ),
        migrations.CreateModel(
            name='IngredientUnit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pl_name', models.CharField(max_length=50)),
                ('en_name', models.CharField(max_length=50)),
                ('multiplier', models.IntegerField(blank=True, default=0)),
            ],
        ),
        migrations.CreateModel(
            name='MealTemplateElement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.FloatField()),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.userprofile')),
                ('ingredient', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='meals.ingredient')),
            ],
        ),
        migrations.CreateModel(
            name='MealTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('meal_name', models.CharField(max_length=50)),
                ('kcal', models.FloatField(blank=True, default=None, null=True)),
                ('carbs', models.FloatField(blank=True, default=None, null=True)),
                ('protein', models.FloatField(blank=True, default=None, null=True)),
                ('fat', models.FloatField(blank=True, default=None, null=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.userprofile')),
                ('meal_elements', models.ManyToManyField(default='', to='meals.mealtemplateelement')),
            ],
        ),
        migrations.CreateModel(
            name='Meal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(auto_now_add=True)),
                ('quantity', models.FloatField()),
                ('kcal', models.FloatField(default=None)),
                ('carbs', models.FloatField(blank=True, default=None, null=True)),
                ('protein', models.FloatField(blank=True, default=None, null=True)),
                ('fat', models.FloatField(blank=True, default=None, null=True)),
                ('fiber', models.FloatField(blank=True, default=None, null=True)),
                ('saturated_fat', models.FloatField(blank=True, default=None, null=True)),
                ('cholesterol', models.FloatField(blank=True, default=None, null=True)),
                ('sodium', models.FloatField(blank=True, default=None, null=True)),
                ('sugar', models.FloatField(blank=True, default=None, null=True)),
                ('potassium', models.FloatField(blank=True, default=None, null=True)),
                ('serving_grams', models.FloatField(blank=True, default=None, null=True)),
                ('serving_ml', models.FloatField(blank=True, default=None, null=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.userprofile')),
                ('ingredient', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='meals.ingredient')),
            ],
        ),
        migrations.AddField(
            model_name='ingredient',
            name='category',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_DEFAULT, to='meals.ingredientcategory'),
        ),
        migrations.AddField(
            model_name='ingredient',
            name='created_by',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounts.userprofile'),
        ),
        migrations.AddField(
            model_name='ingredient',
            name='unit',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.SET_DEFAULT, to='meals.ingredientunit'),
        ),
    ]
