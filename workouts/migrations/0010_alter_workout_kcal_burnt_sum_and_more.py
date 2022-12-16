# Generated by Django 4.1.2 on 2022-11-14 11:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0009_rename_kcal_burnt_workout_kcal_burnt_sum_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workout',
            name='kcal_burnt_sum',
            field=models.FloatField(blank=True, default=None),
        ),
        migrations.AlterField(
            model_name='workout',
            name='min_spent_sum',
            field=models.FloatField(blank=True),
        ),
    ]