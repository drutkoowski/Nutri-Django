# Generated by Django 4.1.2 on 2022-11-11 13:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0002_rename_kcal_exercise_kcal_burnt'),
    ]

    operations = [
        migrations.AddField(
            model_name='exercise',
            name='met',
            field=models.FloatField(default=1),
        ),
        migrations.AddField(
            model_name='exercise',
            name='min_spent',
            field=models.FloatField(default=1),
            preserve_default=False,
        ),
    ]