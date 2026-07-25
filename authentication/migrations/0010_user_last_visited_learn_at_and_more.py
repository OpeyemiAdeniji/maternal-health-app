from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0009_user_epds_prompt_dismissed_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="last_visited_learn_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="user",
            name="learn_coachmark_dismissed",
            field=models.BooleanField(default=False),
        ),
    ]
