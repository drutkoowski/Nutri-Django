# Generated by Django 4.1.2 on 2022-11-14 11:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0007_alter_exercise_unit'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='workout',
            name='quantity',
        ),
    ]