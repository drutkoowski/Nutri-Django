# Generated by Django 4.1.2 on 2022-12-17 14:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_userprofile_is_elo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='is_elo',
        ),
    ]
