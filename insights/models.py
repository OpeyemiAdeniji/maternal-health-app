from django.conf import settings
from django.db import models


class InsightCache(models.Model):
    TREND_CHOICES = [
        ('improving', 'Improving'),
        ('declining', 'Declining'),
        ('stable', 'Stable'),
        ('insufficient_data', 'Insufficient Data'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='insight_cache')
    trend_direction = models.CharField(max_length=20, choices=TREND_CHOICES, default='insufficient_data')
    correlation_strength = models.FloatField(null=True, blank=True)
    insight_cards = models.JSONField(default=list)
    computed_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} – {self.trend_direction}"
