from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0011_user_onboarding_complete"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="last_love_bombing_contact_alert_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
