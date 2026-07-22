import random
from datetime import timedelta

from django.utils import timezone

from authentication.models import User
from authentication.safety_net_views import _current_streak
from checkins.models import CheckIn
from messages_app.models import SupportiveMessage
from messages_app.selector import get_daily_affirmation_category, get_love_bombing_messages, get_message
from notifications.email import send_weekly_summary_email
from notifications.models import AppNotification
from notifications.tasks import send_push_notification
from support.models import DailyRoutine
from support.routines import DAILY_ROUTINES

from .scheduler import scheduler


def send_daily_affirmations():
    users = User.objects.filter(is_active=True, notifications_enabled=True).exclude(fcm_token='')
    for user in users:
        category = get_daily_affirmation_category(user)
        message = get_message(category)
        SupportiveMessage.objects.create(user=user, message_text=message, category=category)
        send_push_notification(user, 'Your daily affirmation', message, AppNotification.NotificationType.AFFIRMATION)


def send_daily_routines():
    today = timezone.localdate()
    users = User.objects.filter(is_active=True)
    for user in users:
        if DailyRoutine.objects.filter(user=user, date=today).exists():
            continue

        stage = user.motherhood_stage if user.motherhood_stage in DAILY_ROUTINES else 'postpartum'
        routine = random.choice(DAILY_ROUTINES[stage])
        DailyRoutine.objects.create(
            user=user,
            routine_title=routine['title'],
            routine_description=routine['description'],
            routine_duration=routine['duration'],
            icon=routine['icon'],
            date=today,
        )

        if user.notifications_enabled:
            send_push_notification(
                user,
                "Today's Self-Care",
                f"{routine['title']} — {routine['description']}",
                AppNotification.NotificationType.ROUTINE,
            )


def send_love_bombing_check():
    users = User.objects.filter(is_active=True, notifications_enabled=True).exclude(fcm_token='')
    for user in users:
        messages = get_love_bombing_messages(user)
        if not messages:
            continue

        send_push_notification(user, 'We see you', messages[0], AppNotification.NotificationType.MOOD_ALERT)

        # space the other two out 2 hours apart via one-off scheduled jobs
        now = timezone.now()
        for offset_hours, message in zip((2, 4), messages[1:]):
            scheduler.add_job(
                send_push_notification,
                trigger='date',
                run_date=now + timedelta(hours=offset_hours),
                args=[user, 'We see you', message, AppNotification.NotificationType.MOOD_ALERT],
                id=f'love_bombing_{user.id}_{now.timestamp()}_{offset_hours}',
                misfire_grace_time=3600,
            )


def _week_bounds(reference_date):
    # weeks run Monday to Sunday, mirroring the frontend's convention
    start = reference_date - timedelta(days=reference_date.weekday())
    end = start + timedelta(days=6)
    return start, end


def _average_mood(user, start, end):
    scores = list(CheckIn.objects.filter(user=user, date__gte=start, date__lte=end).values_list('mood_score', flat=True))
    if not scores:
        return None
    return sum(scores) / len(scores)


def send_weekly_summary_emails():
    today = timezone.localdate()
    this_week_start, this_week_end = _week_bounds(today)
    last_week_start, last_week_end = _week_bounds(today - timedelta(days=7))

    users = User.objects.filter(is_active=True)
    for user in users:
        avg_this_week = _average_mood(user, this_week_start, this_week_end)
        if avg_this_week is None:
            continue  # nothing to summarise if they didn't check in this week

        avg_last_week = _average_mood(user, last_week_start, last_week_end)
        streak = _current_streak(user)
        send_weekly_summary_email(user.email, user.full_name, avg_this_week, avg_last_week, streak)
