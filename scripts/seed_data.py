import random
from datetime import timedelta

from django.utils import timezone

from authentication.models import HealthcareContact, User
from checkins.models import CheckIn
from epds.models import EPDSResult
from journal.models import JournalEntry

DEMO_PASSWORD = 'ModacareDemo123!'
CHECKIN_DAYS = 30


def _clamp(value, low=1, high=5):
    return max(low, min(high, value))


def _stable_scores(day_index):
    return random.choice([3, 3, 4, 3, 4]), random.choice([3, 4, 3, 4])


def _decline_scores(day_index):
    progress = day_index / (CHECKIN_DAYS - 1)
    mood = _clamp(round(4 - 2 * progress) + random.choice([-1, 0, 0, 1]))
    sleep = random.choice([2, 3])
    return mood, sleep


def _volatile_scores(day_index):
    # flips between a good stretch and a bad stretch every few days
    if (day_index // 3) % 2 == 0:
        mood = random.randint(4, 5)
    else:
        mood = random.randint(1, 2)
    sleep = random.randint(2, 4)
    return mood, sleep


def _sleep_linked_scores(day_index):
    sleep = random.randint(1, 5)
    if sleep <= 2:
        mood = sleep  # low sleep always drags mood down with it
    else:
        mood = _clamp(sleep + random.choice([-1, 0, 0, 1]))
    return mood, sleep


def _elevated_risk_scores(day_index):
    return random.randint(1, 2), random.randint(1, 2)


USERS = [
    {
        'full_name': 'Sarah Byrne',
        'email': 'sarah.byrne@example.com',
        'scores_fn': _stable_scores,
        'epds_score': 4,
        'journal_entries': [
            ('Calm', 'Had a good walk today and felt pretty relaxed the whole time.'),
            ('Grateful', 'Grateful for my partner helping out with the night feeds this week.'),
            ('Hopeful', "Feeling like I'm finding a rhythm with the baby now."),
            ('Calm', 'A quiet day at home, nothing major to report, just steady.'),
            ('Tired', 'A bit tired today but overall doing okay.'),
        ],
    },
    {
        'full_name': 'Amara Okafor',
        'email': 'amara.okafor@example.com',
        'scores_fn': _decline_scores,
        'epds_score': 7,
        'journal_entries': [
            ('Hopeful', 'Still adjusting but feeling okay about things.'),
            ('Tired', 'Exhausted today, the nights are catching up with me.'),
            ('Anxious', "Keep worrying I'm not doing enough for the baby."),
            ('Overwhelmed', 'Everything feels like a lot right now.'),
            ('Overwhelmed', 'Struggling to keep on top of things this week.'),
        ],
    },
    {
        'full_name': 'Ciara Murphy',
        'email': 'ciara.murphy@example.com',
        'scores_fn': _volatile_scores,
        'epds_score': 6,
        'journal_entries': [
            ('Grateful', 'Such a lovely day, felt like myself again.'),
            ('Overwhelmed', "Today was really hard, don't know why it hit so suddenly."),
            ('Hopeful', 'Back to feeling more positive, one day at a time.'),
            ('Anxious', 'Rough day, felt on edge for no clear reason.'),
            ('Grateful', 'Great day today, really enjoyed time with the baby.'),
        ],
    },
    {
        'full_name': 'Fatima Hassan',
        'email': 'fatima.hassan@example.com',
        'scores_fn': _sleep_linked_scores,
        'epds_score': 14,
        'journal_entries': [
            ('Tired', "Barely slept last night and it showed in my mood today."),
            ('Calm', 'Slept really well and felt much steadier today.'),
            ('Tired', "Another rough night's sleep, feeling low because of it."),
            ('Hopeful', "Good night's sleep for once, feeling more like myself."),
            ('Tired', "Sleep has been so broken, it's really affecting how I feel."),
        ],
    },
    {
        'full_name': 'Emma Walsh',
        'email': 'emma.walsh@example.com',
        'scores_fn': _elevated_risk_scores,
        'epds_score': 18,
        'journal_entries': [
            ('Overwhelmed', 'Struggling most days, everything feels heavy.'),
            ('Anxious', "Can't seem to shake this constant worry."),
            ('Tired', 'So tired all the time, barely sleeping.'),
            ('Overwhelmed', 'Hard to get through the day at the moment.'),
            ('Anxious', 'Feeling low again today, hoping tomorrow is easier.'),
        ],
        'healthcare_contact': {
            'name': 'Dr. Aoife Kelly',
            'phone': '01 234 5678',
            'relationship_type': 'gp',
        },
    },
]


def _get_or_create_user(config):
    user = User.objects.filter(email=config['email']).first()
    if user:
        return user
    return User.objects.create_user(
        email=config['email'],
        full_name=config['full_name'],
        password=DEMO_PASSWORD,
    )


def _seed_checkins(user, scores_fn):
    if CheckIn.objects.filter(user=user).exists():
        return

    today = timezone.localdate()
    # auto_now_add always stamps "today" on save, so it has to be switched off
    # here to backdate check-ins across the last 30 days
    date_field = CheckIn._meta.get_field('date')
    date_field.auto_now_add = False
    try:
        for day_index in range(CHECKIN_DAYS):
            mood_score, sleep_score = scores_fn(day_index)
            CheckIn.objects.create(
                user=user,
                date=today - timedelta(days=CHECKIN_DAYS - 1 - day_index),
                mood_score=mood_score,
                sleep_score=sleep_score,
            )
    finally:
        date_field.auto_now_add = True


def _seed_journal_entries(user, entries):
    if JournalEntry.objects.filter(user=user).exists():
        return

    for mood_tag, body_text in entries:
        JournalEntry.objects.create(user=user, body_text=body_text, mood_tag=mood_tag)


def _epds_responses_for_score(score):
    # spread the target score across 10 answers, each capped at 3 (the EPDS max per item)
    responses = [0] * 10
    remaining = min(score, 30)
    indices = list(range(10))
    random.shuffle(indices)
    for i in indices:
        if remaining <= 0:
            break
        add = min(3, remaining)
        responses[i] = add
        remaining -= add
    return responses


def _seed_epds_result(user, score):
    if EPDSResult.objects.filter(user=user).exists():
        return

    EPDSResult.objects.create(
        user=user,
        score=score,
        responses=_epds_responses_for_score(score),
        positive_screen=score >= 10,
        likely_depression=score >= 13,
    )


def _seed_healthcare_contact(user, contact):
    HealthcareContact.objects.get_or_create(user=user, name=contact['name'], defaults=contact)


def seed():
    for config in USERS:
        user = _get_or_create_user(config)
        _seed_checkins(user, config['scores_fn'])
        _seed_journal_entries(user, config['journal_entries'])
        _seed_epds_result(user, config['epds_score'])

        contact = config.get('healthcare_contact')
        if contact:
            _seed_healthcare_contact(user, contact)
