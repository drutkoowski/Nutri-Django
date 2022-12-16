# Generated by Django 4.1.2 on 2022-10-31 13:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('meals', '0022_remove_ingredientcategory_multiplier_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='meal',
            name='carbs',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='meal',
            name='cholesterol',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='meal',
            name='fat',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='meal',
            name='fiber',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='meal',
            name='kcal',
            field=models.FloatField(default=None),
        ),
        migrations.AddField(
            model_name='meal',
            name='potassium',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='meal',
            name='protein',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='meal',
            name='saturated_fat',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='meal',
            name='serving_grams',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='meal',
            name='serving_ml',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='meal',
            name='sodium',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='meal',
            name='sugar',
            field=models.FloatField(blank=True, default=None, null=True),
        ),
    ]
