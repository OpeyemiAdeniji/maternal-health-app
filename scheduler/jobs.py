import random
from datetime import timedelta

from django.utils import timezone

from authentication.models import HealthcareContact, User
from authentication.safety_net_views import _current_streak
from authentication.sms import PERSONAL_RELATIONSHIPS, send_love_bombing_contact_alert
from checkins.models import CheckIn
from messages_app.models import SupportiveMessage
from messages_app.selector import (
    get_daily_affirmation_category,
    get_daily_affirmation_message,
    get_love_bombing_messages,
    get_love_bombing_streak_start,
)
from notifications.email import send_weekly_summary_email
from notifications.models import AppNotification
from notifications.tasks import send_push_notification
from support.models import DailyRoutine
from support.routines import DAILY_ROUTINES

from .scheduler import scheduler

# how long an ongoing streak can go between contact alerts, so a very long stretch still checks back in periodically
LOVE_BOMBING_CONTACT_ALERT_COOLDOWN_DAYS = 7


def send_daily_affirmations():
    users = User.objects.filter(is_active=True, notifications_enabled=True).exclude(fcm_token='')
    for user in users:
        category = get_daily_affirmation_category(user)
        message = get_daily_affirmation_message(user)
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


def _notify_personal_contacts_if_due(user, now):
    # only Partner/Friend/Family, GP/Midwife are clinical contacts and never get this
    streak_start = get_love_bombing_streak_start(user)
    if streak_start is None:
        return

    last_alert = user.last_love_bombing_contact_alert_at
    if last_alert is not None:
        last_alert_local = timezone.localtime(last_alert)
        is_same_streak = streak_start <= last_alert_local.date()
        cooldown_elapsed = (now - last_alert) >= timedelta(days=LOVE_BOMBING_CONTACT_ALERT_COOLDOWN_DAYS)
        if is_same_streak and not cooldown_elapsed:
            return  # already alerted contacts for this exact streak, no cooldown reset yet

    personal_contacts = HealthcareContact.objects.filter(
        user=user, relationship_type__in=PERSONAL_RELATIONSHIPS
    )
    if not personal_contacts.exists():
        return  # nothing to do, the user still gets their own push notification above

    for contact in personal_contacts:
        send_love_bombing_contact_alert(
            contact_name=contact.name,
            phone_number=contact.phone,
            token=contact.unique_token,
            user_name=user.full_name,
        )

    user.last_love_bombing_contact_alert_at = now
    user.save(update_fields=['last_love_bombing_contact_alert_at'])


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

        _notify_personal_contacts_if_due(user, now)


def _week_bounds(reference_date):
    # weeks run Monday to Sunday, mirroring the frontend's convention
    start = reference_date - timedelta(days=reference_date.weekday())
    end = start + timedelta(days=6)
    return start, end


def _average_mood(user, start, end):
    # one score per day (the most recent check-in), not one per row, so multiple check-ins in a day don't skew the average
    checkins = CheckIn.objects.filter(user=user, date__gte=start, date__lte=end)
    daily_mood = {}
    for c in checkins:
        daily_mood.setdefault(c.date, c.mood_score)
    if not daily_mood:
        return None
    return sum(daily_mood.values()) / len(daily_mood)


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
