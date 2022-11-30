# Generated by Django 4.1.2 on 2022-11-24 23:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0003_alter_recipe_steps_en_alter_recipe_steps_pl'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='ingredients_en',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='ingredients_pl',
            field=models.JSONField(blank=True, default=dict),
        ),
    ]