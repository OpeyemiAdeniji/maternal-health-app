from django.db import models
from django.conf import settings


class JournalEntry(models.Model):
    MOOD_CHOICES = [
        ('Anxious', 'Anxious'),
        ('Hopeful', 'Hopeful'),
        ('Tired', 'Tired'),
        ('Calm', 'Calm'),
        ('Overwhelmed', 'Overwhelmed'),
        ('Grateful', 'Grateful'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='journal_entries')
    body_text = models.TextField()
    mood_tag = models.CharField(max_length=20, choices=MOOD_CHOICES, blank=True, default='')
    sentiment_score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} – {self.created_at:%Y-%m-%d}"
