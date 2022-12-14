# Generated by Django 4.1.2 on 2022-12-16 23:46

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name_pl', models.CharField(default='', max_length=100)),
                ('name_en', models.CharField(max_length=100)),
                ('person_count', models.IntegerField(blank=True, null=True)),
                ('difficulty_pl', models.CharField(blank=True, max_length=50, null=True)),
                ('difficulty_en', models.CharField(blank=True, max_length=50, null=True)),
                ('author', models.CharField(blank=True, max_length=100, null=True)),
                ('duration', models.CharField(blank=True, max_length=30, null=True)),
                ('ingredients_pl', models.JSONField(blank=True, default=dict)),
                ('ingredients_en', models.JSONField(blank=True, default=dict)),
                ('steps_pl', models.JSONField(blank=True, default=dict)),
                ('steps_en', models.JSONField(blank=True, default=dict)),
                ('verified', models.BooleanField(blank=True, default=True, null=True)),
            ],
        ),
    ]
