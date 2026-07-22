import logging
import os

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

logger = logging.getLogger(__name__)

BRAND_COLOR = '#b00fa8'


def _send(to_email, subject, html_content):
    api_key = os.getenv('SENDGRID_API_KEY')
    from_email = os.getenv('SENDGRID_FROM_EMAIL')

    if not api_key or not from_email:
        logger.warning('SendGrid is not configured — skipping email to %s', to_email)
        return

    message = Mail(from_email=from_email, to_emails=to_email, subject=subject, html_content=html_content)
    try:
        SendGridAPIClient(api_key).send(message)
    except Exception:
        logger.exception('Failed to send email to %s', to_email)


def send_welcome_email(user_email, user_name):
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
    html_content = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="color: {BRAND_COLOR};">Modacare</h1>
      <p>Hi {user_name}, we are so glad you are here.</p>
      <p>Modacare is your private space to check in with yourself, track how you are feeling, and get
        the support you deserve. You do not have to do this alone.</p>
      <a href="{frontend_url}" style="display: inline-block; margin-top: 16px; padding: 12px 24px;
        background-color: {BRAND_COLOR}; color: #ffffff; text-decoration: none; border-radius: 12px;">
        Open Modacare
      </a>
      <p style="margin-top: 32px; font-size: 12px; color: #737373;">
        This is a safe, private space. Your data is never shared.
      </p>
    </div>
    """
    _send(user_email, f'Welcome to Modacare, {user_name}', html_content)


def send_weekly_summary_email(user_email, user_name, avg_mood_this_week, avg_mood_last_week, streak):
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')

    if avg_mood_last_week is None:
        trend = ''
        comparison = ''
    elif avg_mood_this_week >= avg_mood_last_week:
        trend = ' ▲'
        comparison = f'Last week: {avg_mood_last_week:.1f}'
    else:
        trend = ' ▼'
        comparison = f'Last week: {avg_mood_last_week:.1f}'

    html_content = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="color: {BRAND_COLOR};">Modacare</h1>
      <p>Hi {user_name}, here is how your week looked.</p>
      <p style="font-size: 32px; font-weight: bold; color: #2d2d2d; margin-bottom: 0;">
        {avg_mood_this_week:.1f}{trend}
      </p>
      <p style="color: #737373; margin-top: 4px;">Average mood this week. {comparison}</p>
      <p style="color: #737373;">Current streak: {streak} day{'s' if streak != 1 else ''}</p>
      <p>Keep showing up for yourself — every check-in matters.</p>
      <a href="{frontend_url}" style="display: inline-block; margin-top: 16px; padding: 12px 24px;
        background-color: {BRAND_COLOR}; color: #ffffff; text-decoration: none; border-radius: 12px;">
        Open Modacare
      </a>
    </div>
    """
    _send(user_email, 'Your Modacare weekly check-in summary', html_content)


def send_password_reset_email(user_email, user_name, token):
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
    reset_link = f'{frontend_url}/reset-password/{token}'
    html_content = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="color: {BRAND_COLOR};">Modacare</h1>
      <p>Hi {user_name}, we received a request to reset your password.</p>
      <a href="{reset_link}" style="display: inline-block; margin-top: 16px; padding: 12px 24px;
        background-color: {BRAND_COLOR}; color: #ffffff; text-decoration: none; border-radius: 12px;">
        Reset Password
      </a>
      <p style="margin-top: 24px; color: #737373;">This link expires in 1 hour.</p>
      <p style="color: #737373;">If you did not request this, you can safely ignore this email.</p>
    </div>
    """
    _send(user_email, 'Reset your Modacare password', html_content)
