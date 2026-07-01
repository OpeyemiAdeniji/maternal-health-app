from datetime import timedelta

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone


class EPDSResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='epds_results')
    score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(30)])
    responses = models.JSONField()
    positive_screen = models.BooleanField(default=False)
    likely_depression = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    next_due_at = models.DateTimeField()

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        # fallback in case a result is ever created outside the serializer
        if not self.next_due_at:
            self.next_due_at = timezone.now() + timedelta(days=14)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} – {self.score} ({self.created_at:%Y-%m-%d})"
