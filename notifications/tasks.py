import logging

from firebase_admin import messaging

from authentication.models import User
from messages_app.selector import get_love_bombing_messages, get_message

from .firebase import initialize_firebase
from .models import AppNotification

logger = logging.getLogger(__name__)


def send_push_notification(user, title, body, notification_type=AppNotification.NotificationType.AFFIRMATION):
    # every push also lands in the in-app notification centre, regardless of whether the device has a push token or the send below succeeds
    AppNotification.objects.create(user=user, title=title, message=body, notification_type=notification_type)

    if not user.fcm_token:
        return

    try:
        initialize_firebase()
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            token=user.fcm_token,
        )
        messaging.send(message)
    except Exception:
        # push failures shouldn't ever break the caller, just log and move on
        logger.exception('Failed to send push notification to %s', user.email)


def send_daily_affirmation():
    users = User.objects.filter(is_active=True).exclude(fcm_token='')
    for user in users:
        message = get_message('daily_affirmation')
        send_push_notification(user, 'Your daily affirmation', message, AppNotification.NotificationType.AFFIRMATION)


def send_love_bombing_notifications():
    users = User.objects.filter(is_active=True).exclude(fcm_token='')
    for user in users:
        messages = get_love_bombing_messages(user)
        if not messages:
            continue

        # in production this would be spaced across the day via a scheduled job, kept simple here
        for message in messages:
            send_push_notification(user, 'We see you', message, AppNotification.NotificationType.MOOD_ALERT)
