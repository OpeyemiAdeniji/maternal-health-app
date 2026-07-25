import logging
import os

from twilio.rest import Client

logger = logging.getLogger(__name__)

PERSONAL_RELATIONSHIPS = {'partner', 'friend', 'family'}


def send_safety_net_link(contact_name, phone_number, relationship_type, token, user_name):
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    messaging_service_sid = os.getenv('TWILIO_MESSAGING_SERVICE_SID')
    # kept for parity with the other Twilio settings — the messaging service SID is used as the sender, not this
    os.getenv('TWILIO_PHONE_NUMBER')
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')

    if not account_sid or not auth_token or not messaging_service_sid:
        logger.warning('Twilio is not configured — skipping safety net SMS to %s', contact_name)
        return

    link = f'{frontend_url}/safety-net/{token}'

    if relationship_type in PERSONAL_RELATIONSHIPS:
        body = (
            f'Hi {contact_name}, {user_name} has added you as a trusted support person on Modacare, '
            f'their maternal mental health companion. You can view their wellbeing updates and send '
            f'them a message of support here: {link}'
        )
    else:
        body = (
            f'Hello, {contact_name}. {user_name} has shared their maternal mental health tracking with '
            f'you via Modacare. You can view their clinical overview including mood history, sleep '
            f'patterns and EPDS scores here: {link}'
        )

    try:
        client = Client(account_sid, auth_token)
        client.messages.create(
            body=body,
            messaging_service_sid=messaging_service_sid,
            to=phone_number,
        )
    except Exception:
        # a failed SMS should never break whatever triggered it — just log and move on
        logger.exception('Failed to send safety net SMS to %s', contact_name)


def send_love_bombing_contact_alert(contact_name, phone_number, token, user_name):
    # personal contacts only (partner/friend/family) — deliberately warm and vague, no
    # mood scores, journal content, or other clinical detail ever go in this message
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    messaging_service_sid = os.getenv('TWILIO_MESSAGING_SERVICE_SID')
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')

    if not account_sid or not auth_token or not messaging_service_sid:
        logger.warning('Twilio is not configured — skipping love bombing contact alert to %s', contact_name)
        return

    link = f'{frontend_url}/safety-net/{token}'

    body = (
        f"Hi {contact_name}, this is Modacare. {user_name}'s companion noticed they might be "
        f"going through a tough stretch lately. A quick check-in from you could mean a lot "
        f"right now: {link}"
    )

    try:
        client = Client(account_sid, auth_token)
        client.messages.create(
            body=body,
            messaging_service_sid=messaging_service_sid,
            to=phone_number,
        )
    except Exception:
        logger.exception('Failed to send love bombing contact alert SMS to %s', contact_name)
