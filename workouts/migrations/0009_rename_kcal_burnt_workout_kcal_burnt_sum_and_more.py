# Generated by Django 4.1.2 on 2022-11-14 11:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0008_remove_workout_quantity'),
    ]

    operations = [
        migrations.RenameField(
            model_name='workout',
            old_name='kcal_burnt',
            new_name='kcal_burnt_sum',
        ),
        migrations.RenameField(
            model_name='workout',
            old_name='min_spent',
            new_name='min_spent_sum',
        ),
        migrations.RemoveField(
            model_name='workout',
            name='exercise',
        ),
        migrations.CreateModel(
            name='WorkoutElement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('min_spent', models.FloatField()),
                ('kcal_burnt', models.FloatField(default=None)),
                ('exercise', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='workouts.exercise')),
            ],
        ),
        migrations.AddField(
            model_name='workout',
            name='workout_elements',
            field=models.ManyToManyField(default='', to='workouts.workoutelement'),
        ),
    ]