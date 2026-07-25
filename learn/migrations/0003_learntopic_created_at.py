import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("learn", "0002_seed_learn_topics"),
    ]

    operations = [
        migrations.AddField(
            model_name="learntopic",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
