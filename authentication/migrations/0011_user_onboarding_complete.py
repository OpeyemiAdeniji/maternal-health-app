from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0010_user_last_visited_learn_at_and_more"),
    ]

    operations = [
        # backfill existing accounts as already onboarded (default=True is a one-off
        # backfill value here) — the model's real default of False only applies to
        # accounts created after this migration, who must go through onboarding
        migrations.AddField(
            model_name="user",
            name="onboarding_complete",
            field=models.BooleanField(default=True),
            preserve_default=False,
        ),
    ]
