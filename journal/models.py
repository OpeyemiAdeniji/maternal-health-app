from django.db import models
from django.conf import settings


class JournalEntry(models.Model):
    MOOD_CHOICES = [
        ('struggling', 'Struggling'),
        ('overwhelmed', 'Overwhelmed'),
        ('exhausted', 'Exhausted'),
        ('low', 'Low'),
        ('anxious', 'Anxious'),
        ('tired', 'Tired'),
        ('okay', 'Okay'),
        ('neutral', 'Neutral'),
        ('hopeful', 'Hopeful'),
        ('calm', 'Calm'),
        ('grateful', 'Grateful'),
        ('happy', 'Happy'),
        ('energised', 'Energised'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='journal_entries')
    body_text = models.TextField()
    # legacy single-tag field, no longer written to by new code, kept so old entries keep their data
    mood_tag = models.CharField(max_length=20, choices=MOOD_CHOICES, blank=True, default='')
    # current format: a list of tag values, validated against MOOD_CHOICES by the serializer
    mood_tags = models.JSONField(default=list, blank=True)
    sentiment_score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} – {self.created_at:%Y-%m-%d}"

    @property
    def effective_mood_tags(self):
        # bridges pre-multi-tag entries (only mood_tag set) into the same list shape as new entries, so every consumer can treat mood_tags uniformly
        if self.mood_tags:
            return self.mood_tags
        return [self.mood_tag] if self.mood_tag else []
