import uuid
from datetime import timedelta

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

TOKEN_LIFETIME = timedelta(hours=1)


class PasswordResetToken(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='password_reset_tokens',
    )
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.email} - {self.token}"


def generate_reset_token(user):
    return PasswordResetToken.objects.create(user=user)


def validate_reset_token(token_string):
    try:
        reset_token = PasswordResetToken.objects.get(token=token_string, is_used=False)
    except (PasswordResetToken.DoesNotExist, ValidationError, ValueError):
        return None

    if timezone.now() - reset_token.created_at > TOKEN_LIFETIME:
        return None

    return reset_token.user
