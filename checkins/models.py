from django.db import models
from django.conf import settings


class CheckIn(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='checkins')
    date = models.DateField(auto_now_add=True)
    mood_score = models.IntegerField()   # 1–5
    sleep_score = models.IntegerField()  # 1–5
    trigger_note = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # one check-in per user per day, enforced at DB level
        unique_together = ('user', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.email} – {self.date}"
