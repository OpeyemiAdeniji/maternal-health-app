from django.db import migrations

TITLE = 'Recognizing Your Own Needs'
OLD_PHRASE = 'NHS guidance on mental wellbeing points out that'
NEW_PHRASE = 'HSE guidance on mental wellbeing points out that'


def fix_source_reference(apps, schema_editor):
    LearnTopic = apps.get_model('learn', 'LearnTopic')
    topic = LearnTopic.objects.filter(title=TITLE).first()
    if topic and OLD_PHRASE in topic.content:
        topic.content = topic.content.replace(OLD_PHRASE, NEW_PHRASE)
        topic.save(update_fields=['content'])


def revert_source_reference(apps, schema_editor):
    LearnTopic = apps.get_model('learn', 'LearnTopic')
    topic = LearnTopic.objects.filter(title=TITLE).first()
    if topic and NEW_PHRASE in topic.content:
        topic.content = topic.content.replace(NEW_PHRASE, OLD_PHRASE)
        topic.save(update_fields=['content'])


class Migration(migrations.Migration):

    dependencies = [
        ("learn", "0004_learntopic_attribution"),
    ]

    operations = [
        migrations.RunPython(fix_source_reference, revert_source_reference),
    ]
