from django.conf import settings
from django.db import models


class AppNotification(models.Model):
    class NotificationType(models.TextChoices):
        LOVE_NOTE = 'love_note', 'Love note'
        AFFIRMATION = 'affirmation', 'Affirmation'
        MOOD_ALERT = 'mood_alert', 'Mood alert'
        EPDS_REMINDER = 'epds_reminder', 'EPDS reminder'
        ROUTINE = 'routine', 'Daily routine'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=20,
        choices=NotificationType.choices,
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.title}"
