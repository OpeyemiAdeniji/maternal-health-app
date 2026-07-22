from django.conf import settings
from django.db import models


class SupportiveMessage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='supportive_messages')
    message_text = models.TextField()
    category = models.CharField(max_length=50)
    is_llm_generated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} – {self.category}"


class DailyAffirmation(models.Model):
    # one affirmation per user per day — keeps the dashboard card stable all day
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='daily_affirmations')
    message_text = models.TextField()
    date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.email} – {self.date}"
