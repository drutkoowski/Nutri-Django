# Generated by Django 4.1.2 on 2022-11-16 12:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0013_rename_kcal_burnt_workouttemplate_kcal_burnt_sum_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workouttemplate',
            name='workout_elements',
            field=models.ManyToManyField(default='', null=True, to='workouts.workouttemplateelement'),
        ),
    ]
