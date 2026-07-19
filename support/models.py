from django.conf import settings
from django.db import models

# split into its own module, imported here so Django's app registry picks it up for migrations
from .love_notes import LoveNote  # noqa: F401


class DailyRoutine(models.Model):
    # persists the routine picked for a user on a given day, so the dashboard
    # keeps showing the same one all day instead of a new random pick per request
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='daily_routines')
    routine_title = models.CharField(max_length=255)
    routine_description = models.TextField()
    routine_duration = models.CharField(max_length=50)
    icon = models.CharField(max_length=50, default='breath')
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.email} – {self.routine_title} ({self.date})"
