# Generated by Django 4.1.2 on 2022-10-27 20:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('meals', '0003_remove_meal_ingredients_meal_ingredients'),
    ]

    operations = [
        migrations.RenameField(
            model_name='meal',
            old_name='ingredients',
            new_name='ingredient',
        ),
    ]
