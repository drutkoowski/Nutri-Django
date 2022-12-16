# Generated by Django 4.1.2 on 2022-10-29 17:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('meals', '0013_alter_ingredient_carbs_alter_ingredient_cholesterol_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='IngredientCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pl_category_name', models.CharField(blank=True, max_length=100)),
                ('en_category_name', models.CharField(blank=True, max_length=100)),
            ],
        ),
        migrations.AddField(
            model_name='ingredient',
            name='category',
            field=models.ForeignKey(blank=True, default='', null=True, on_delete=django.db.models.deletion.CASCADE, to='meals.ingredientcategory'),
        ),
    ]
