import random
from datetime import timedelta

from django.utils import timezone

from checkins.models import CheckIn

from .templates import MESSAGE_TEMPLATES

SUSTAINED_LOW_MOOD_DAYS = 5
LOVE_BOMBING_LOOKBACK_DAYS = 7
LOVE_BOMBING_MIN_CONSECUTIVE_DAYS = 5


def get_message(category):
    return random.choice(MESSAGE_TEMPLATES[category])


def get_message_for_checkin(checkin):
    if checkin.mood_score <= 2:
        recent = CheckIn.objects.filter(user=checkin.user).order_by('-date')[:SUSTAINED_LOW_MOOD_DAYS]
        if len(recent) == SUSTAINED_LOW_MOOD_DAYS and all(c.mood_score <= 2 for c in recent):
            return get_message('sustained_low_mood')
        return get_message('low_mood_checkin')

    if checkin.sleep_score <= 2:
        return get_message('low_sleep')

    if checkin.mood_score >= 4:
        return get_message('positive_checkin')

    return None


def get_message_for_epds(epds_result):
    if epds_result.score >= 10:
        return get_message('epds_elevated')
    return None


def get_daily_affirmation_category(user):
    todays_checkin = CheckIn.objects.filter(user=user, date=timezone.localdate()).first()
    if not todays_checkin:
        return 'daily_affirmation'
    if todays_checkin.mood_score <= 2:
        return 'low_mood_checkin'
    if todays_checkin.mood_score == 3:
        return 'after_journal'
    return 'positive_checkin'


def get_daily_affirmation_message(user):
    return get_message(get_daily_affirmation_category(user))


def get_love_bombing_messages(user):
    recent = list(CheckIn.objects.filter(user=user).order_by('-date')[:LOVE_BOMBING_LOOKBACK_DAYS])

    # count how many of the most recent days are low mood with no gaps in between
    consecutive_low = 0
    expected_date = None
    for checkin in recent:
        if expected_date is not None and checkin.date != expected_date:
            break
        if checkin.mood_score > 2:
            break
        consecutive_low += 1
        expected_date = checkin.date - timedelta(days=1)

    if consecutive_low >= LOVE_BOMBING_MIN_CONSECUTIVE_DAYS:
        return random.sample(MESSAGE_TEMPLATES['love_bombing'], 3)
    return None
