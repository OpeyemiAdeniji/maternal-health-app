from django.db import migrations, models


# Sources verified via live web search on 2026-07-25 — real, working URLs on the
# organizations' own domains, matched to each topic's actual content. Two topics
# (Balancing Multiple Children, How to Be There Without Overstepping) have no
# single authoritative source and are deliberately left uncited rather than
# forced onto an unrelated page. "Managing Household Mental Load" uses APA's
# parental stress/burnout research as a thematic fit, worded honestly as such
# rather than implying an exact "mental load" citation.
ATTRIBUTIONS = {
    'What to Expect in Labor': (
        'NHS',
        'https://www.nhs.uk/pregnancy/labour-and-birth/the-stages-of-labour-and-birth/',
        'Reviewed using guidance from NHS.uk.',
    ),
    'Preparing Your Hospital Bag': (
        'NHS',
        'https://www.nhs.uk/pregnancy/labour-and-birth/preparing-for-the-birth/pack-your-bag-for-labour/',
        'Reviewed using guidance from NHS.uk.',
    ),
    'Understanding Your Birth Plan': (
        'NHS',
        'https://www.nhs.uk/pregnancy/labour-and-birth/preparing-for-the-birth/how-to-make-a-birth-plan/',
        'Reviewed using guidance from NHS.uk.',
    ),
    'Nutrition During Pregnancy': (
        'NHS',
        'https://www.nhs.uk/pregnancy/keeping-well/have-a-healthy-diet/',
        'Reviewed using guidance from NHS.uk.',
    ),
    'Baby Blues vs. Postpartum Depression': (
        'NHS',
        'https://www.nhs.uk/mental-health/conditions/postnatal-depression/',
        'Reviewed using guidance from NHS.uk.',
    ),
    'Feeding Basics (Breastfeeding and Formula)': (
        'NHS',
        'https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/',
        'Reviewed using guidance from NHS.uk.',
    ),
    'Getting Rest with a Newborn': (
        'NHS',
        'https://www.nhs.uk/baby/support-and-services/sleep-and-tiredness-after-having-a-baby/',
        'Reviewed using guidance from NHS.uk.',
    ),
    'Physical Recovery After Birth': (
        'NHS',
        'https://www.nhs.uk/pregnancy/labour-and-birth/your-body/',
        'Reviewed using guidance from NHS.uk.',
    ),
    'Recognizing Your Own Needs': (
        'HSE',
        'https://www.hse.ie/eng/about/who/healthwellbeing/about-us/minding-your-wellbeing.html',
        'Reviewed using guidance from HSE.ie.',
    ),
    'When to Seek Extra Support': (
        'HSE',
        'https://www2.hse.ie/mental-health/services-support/reasons-to-get-help-for-your-mental-health/',
        'Reviewed using guidance from HSE.ie.',
    ),
    'Managing Household Mental Load': (
        'APA',
        'https://www.apa.org/topics/stress/parental-burnout',
        'Informed by research on parental stress and burnout — APA.',
    ),
    'Supporting Someone Through Pregnancy': (
        'NHS',
        'https://www.nhs.uk/best-start-in-life/pregnancy/advice-for-partners/',
        'Reviewed using guidance from NHS.uk.',
    ),
    'Understanding Postpartum Changes': (
        'NHS',
        'https://www.nhs.uk/mental-health/conditions/post-natal-depression/symptoms/',
        'Reviewed using guidance from NHS.uk.',
    ),
    'Practical Ways to Help': (
        'NHS',
        'https://www.nhs.uk/baby/support-and-services/tips-for-new-parents/',
        'Reviewed using guidance from NHS.uk.',
    ),
    # 'Balancing Multiple Children' and 'How to Be There Without Overstepping'
    # intentionally omitted — general guidance, no single authoritative source found
}

REVIEWED_DATE = '2026-07-25'


def populate_attributions(apps, schema_editor):
    LearnTopic = apps.get_model('learn', 'LearnTopic')
    for title, (source_name, source_url, attribution_note) in ATTRIBUTIONS.items():
        LearnTopic.objects.filter(title=title).update(
            source_name=source_name,
            source_url=source_url,
            attribution_note=attribution_note,
            last_reviewed_at=REVIEWED_DATE,
        )


def clear_attributions(apps, schema_editor):
    LearnTopic = apps.get_model('learn', 'LearnTopic')
    LearnTopic.objects.filter(title__in=ATTRIBUTIONS.keys()).update(
        source_name='', source_url='', attribution_note='', last_reviewed_at=None
    )


class Migration(migrations.Migration):

    dependencies = [
        ("learn", "0003_learntopic_created_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="learntopic",
            name="source_name",
            field=models.CharField(blank=True, default="", max_length=50),
        ),
        migrations.AddField(
            model_name="learntopic",
            name="source_url",
            field=models.URLField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="learntopic",
            name="attribution_note",
            field=models.CharField(blank=True, default="", max_length=200),
        ),
        migrations.AddField(
            model_name="learntopic",
            name="last_reviewed_at",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.RunPython(populate_attributions, clear_attributions),
    ]
