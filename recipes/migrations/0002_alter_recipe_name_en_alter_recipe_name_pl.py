# Generated by Django 4.1.2 on 2022-12-17 10:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='name_en',
            field=models.CharField(max_length=150),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='name_pl',
            field=models.CharField(default='', max_length=150),
        ),
    ]
