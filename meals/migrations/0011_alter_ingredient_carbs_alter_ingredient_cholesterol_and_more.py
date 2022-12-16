# Generated by Django 4.1.2 on 2022-10-29 13:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('meals', '0010_alter_ingredient_sodium'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ingredient',
            name='carbs',
            field=models.DecimalField(blank=True, decimal_places=5, default='0', max_digits=7),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='cholesterol',
            field=models.DecimalField(blank=True, decimal_places=5, default='0', max_digits=7),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='fat',
            field=models.DecimalField(blank=True, decimal_places=5, default='0', max_digits=7),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='fiber',
            field=models.DecimalField(blank=True, decimal_places=5, default='0', max_digits=7),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='kcal',
            field=models.DecimalField(decimal_places=5, default='0', max_digits=7),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='potassium',
            field=models.DecimalField(blank=True, decimal_places=5, default='0', max_digits=7),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='protein',
            field=models.DecimalField(blank=True, decimal_places=5, default='0', max_digits=7),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='saturated_fat',
            field=models.DecimalField(blank=True, decimal_places=5, default='0', max_digits=7),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='serving_grams',
            field=models.DecimalField(blank=True, decimal_places=5, default='0', max_digits=7),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='sugar',
            field=models.DecimalField(blank=True, decimal_places=5, default='0', max_digits=7),
        ),
    ]
