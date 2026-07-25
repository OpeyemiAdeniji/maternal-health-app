from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("journal", "0002_alter_journalentry_mood_tag"),
    ]

    operations = [
        migrations.AddField(
            model_name="journalentry",
            name="mood_tags",
            field=models.JSONField(blank=True, default=list),
        ),
    ]
