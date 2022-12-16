# Generated by Django 4.1.2 on 2022-12-16 23:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pl_name', models.CharField(blank=True, max_length=100)),
                ('en_name', models.CharField(max_length=100)),
                ('met', models.FloatField(default=1)),
                ('verified', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='ExerciseCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pl_category_name', models.CharField(blank=True, max_length=100)),
                ('en_category_name', models.CharField(blank=True, max_length=100)),
            ],
            options={
                'verbose_name_plural': 'Exercise categories',
            },
        ),
        migrations.CreateModel(
            name='ExerciseTimeUnit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pl_time_unit_name', models.CharField(blank=True, max_length=15)),
                ('en_time_unit_name', models.CharField(blank=True, max_length=15)),
            ],
            options={
                'verbose_name_plural': 'Exercise time units',
            },
        ),
        migrations.CreateModel(
            name='ExerciseUnit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pl_name', models.CharField(max_length=50)),
                ('en_name', models.CharField(max_length=50)),
                ('multiplier', models.IntegerField(blank=True, default=0)),
            ],
        ),
        migrations.CreateModel(
            name='WorkoutTemplateElement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('min_spent', models.FloatField()),
                ('kcal_burnt', models.FloatField()),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.userprofile')),
                ('exercise', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='workouts.exercise')),
            ],
        ),
        migrations.CreateModel(
            name='WorkoutTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('workout_name', models.CharField(max_length=50)),
                ('kcal_burnt_sum', models.FloatField(blank=True, default=None, null=True)),
                ('min_spent_sum', models.FloatField(default=None, null=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.userprofile')),
                ('workout_elements', models.ManyToManyField(default='', null=True, to='workouts.workouttemplateelement')),
            ],
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
        migrations.CreateModel(
            name='Workout',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(auto_now_add=True)),
                ('min_spent_sum', models.FloatField(blank=True, null=True)),
                ('kcal_burnt_sum', models.FloatField(blank=True, null=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.userprofile')),
                ('workout_elements', models.ManyToManyField(default='', to='workouts.workoutelement')),
            ],
        ),
        migrations.AddField(
            model_name='exercise',
            name='category',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_DEFAULT, to='workouts.exercisecategory'),
        ),
        migrations.AddField(
            model_name='exercise',
            name='created_by',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounts.userprofile'),
        ),
        migrations.AddField(
            model_name='exercise',
            name='time_unit',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_DEFAULT, to='workouts.exercisetimeunit'),
        ),
        migrations.AddField(
            model_name='exercise',
            name='unit',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='workouts.exerciseunit'),
        ),
    ]
