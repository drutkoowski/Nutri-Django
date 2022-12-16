# Generated by Django 4.1.2 on 2022-12-16 22:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_userprofile_biceps_json_userprofile_calves_json_and_more'),
        ('workouts', '0015_workouttemplateelement_kcal_burnt'),
    ]

    operations = [
        migrations.AddField(
            model_name='exercise',
            name='created_by',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounts.userprofile'),
        ),
        migrations.AddField(
            model_name='exercise',
            name='verified',
            field=models.BooleanField(default=True),
        ),
    ]
