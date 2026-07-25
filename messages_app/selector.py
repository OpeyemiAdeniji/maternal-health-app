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
        # one representative score per day (the most recent check-in of that day) — otherwise a
        # single day with several low check-ins could double-count toward "sustained" low mood
        recent_checkins = CheckIn.objects.filter(
            user=checkin.user, date__lte=checkin.date
        ).order_by('-date', '-created_at')[:100]
        daily_mood = {}
        for c in recent_checkins:
            daily_mood.setdefault(c.date, c.mood_score)
            if len(daily_mood) >= SUSTAINED_LOW_MOOD_DAYS:
                break
        if len(daily_mood) == SUSTAINED_LOW_MOOD_DAYS and all(score <= 2 for score in daily_mood.values()):
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
    category = get_daily_affirmation_category(user)
    # only the plain 'daily_affirmation' category (no check-in logged yet today) varies by
    # stage — the mood-reaction categories (low_mood_checkin/after_journal/positive_checkin)
    # stay stage-agnostic, same as before
    if category != 'daily_affirmation':
        return get_message(category)

    stage_pool = MESSAGE_TEMPLATES['daily_affirmation']
    stage = user.motherhood_stage if user.motherhood_stage in stage_pool else 'exploring'
    return random.choice(stage_pool[stage])


def _consecutive_low_mood_run(user):
    # one representative score per day (the most recent check-in of that day). Without this, a
    # duplicate check-in on the same day breaks the consecutive-day walk below (its date no longer
    # matches the already-decremented expected_date), silently zeroing out a real streak.
    checkins = CheckIn.objects.filter(user=user).order_by('-date', '-created_at')[:100]
    daily_mood = {}
    for c in checkins:
        daily_mood.setdefault(c.date, c.mood_score)
        if len(daily_mood) >= LOVE_BOMBING_LOOKBACK_DAYS:
            break

    recent_dates = sorted(daily_mood.keys(), reverse=True)

    # count how many of the most recent days are low mood with no gaps in between
    consecutive_low = 0
    expected_date = None
    streak_start_date = None
    for date in recent_dates:
        if expected_date is not None and date != expected_date:
            break
        if daily_mood[date] > 2:
            break
        consecutive_low += 1
        streak_start_date = date
        expected_date = date - timedelta(days=1)

    return consecutive_low, streak_start_date


def get_love_bombing_messages(user):
    consecutive_low, _ = _consecutive_low_mood_run(user)
    if consecutive_low >= LOVE_BOMBING_MIN_CONSECUTIVE_DAYS:
        return random.sample(MESSAGE_TEMPLATES['love_bombing'], 3)
    return None


def get_love_bombing_streak_start(user):
    # start date of the current qualifying low-mood streak, or None if not triggered —
    # lets a caller tell a fresh streak apart from one it already alerted on
    consecutive_low, streak_start_date = _consecutive_low_mood_run(user)
    if consecutive_low >= LOVE_BOMBING_MIN_CONSECUTIVE_DAYS:
        return streak_start_date
    return None
