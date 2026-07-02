import random

from checkins.models import CheckIn

from .templates import MESSAGE_TEMPLATES

SUSTAINED_LOW_MOOD_DAYS = 5


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
