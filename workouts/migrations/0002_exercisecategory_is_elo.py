# Generated by Django 4.1.2 on 2022-12-16 23:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='exercisecategory',
            name='is_elo',
            field=models.BooleanField(default=True),
        ),
    ]
