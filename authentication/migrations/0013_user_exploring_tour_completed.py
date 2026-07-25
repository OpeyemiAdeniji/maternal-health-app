from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0012_user_last_love_bombing_contact_alert_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="exploring_tour_completed",
            field=models.BooleanField(default=False),
        ),
    ]
