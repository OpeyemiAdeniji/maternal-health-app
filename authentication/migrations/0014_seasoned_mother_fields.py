from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0013_user_exploring_tour_completed"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="marital_status",
            field=models.CharField(
                blank=True,
                choices=[
                    ("single", "Single"),
                    ("married_partnered", "Married / Partnered"),
                    ("divorced_separated", "Divorced / Separated"),
                    ("widowed", "Widowed"),
                    ("prefer_not_to_say", "Prefer not to say"),
                ],
                default="",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="user",
            name="number_of_children",
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="user",
            name="employment_status",
            field=models.CharField(
                blank=True,
                choices=[
                    ("full_time", "Working full-time"),
                    ("part_time", "Working part-time"),
                    ("stay_at_home", "Stay-at-home parent"),
                    ("studying", "Studying"),
                    ("not_working", "Not currently working"),
                    ("prefer_not_to_say", "Prefer not to say"),
                ],
                default="",
                max_length=20,
            ),
        ),
    ]
