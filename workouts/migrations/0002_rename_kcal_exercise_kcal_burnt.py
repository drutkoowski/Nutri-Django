# Generated by Django 4.1.2 on 2022-11-11 13:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='exercise',
            old_name='kcal',
            new_name='kcal_burnt',
        ),
    ]