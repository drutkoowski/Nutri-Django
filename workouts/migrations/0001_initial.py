# Generated by Django 4.1.2 on 2022-11-11 12:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0003_alter_userprofile_goal_kg'),
    ]

    operations = [
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pl_name', models.CharField(blank=True, max_length=100)),
                ('en_name', models.CharField(max_length=100)),
                ('kcal', models.FloatField(default=None)),
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
            name='ExerciseUnit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pl_name', models.CharField(max_length=50)),
                ('en_name', models.CharField(max_length=50)),
                ('multiplier', models.IntegerField(blank=True, default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Workout',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(auto_now_add=True)),
                ('quantity', models.FloatField()),
                ('kcal_burnt', models.FloatField(default=None)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.userprofile')),
                ('exercise', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='workouts.exercise')),
            ],
        ),
        migrations.CreateModel(
            name='ExerciseTemplateElement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.FloatField()),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.userprofile')),
                ('exercise', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='workouts.exercise')),
            ],
        ),
        migrations.CreateModel(
            name='ExerciseTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('workout_name', models.CharField(max_length=50)),
                ('kcal_burnt', models.FloatField(blank=True, default=None, null=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.userprofile')),
                ('workout_elements', models.ManyToManyField(default='', to='workouts.exercisetemplateelement')),
            ],
        ),
        migrations.AddField(
            model_name='exercise',
            name='category',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_DEFAULT, to='workouts.exercisecategory'),
        ),
        migrations.AddField(
            model_name='exercise',
            name='unit',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='workouts.exerciseunit'),
        ),
    ]