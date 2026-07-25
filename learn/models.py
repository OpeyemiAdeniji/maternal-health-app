from django.db import models

from authentication.models import User


class LearnTopic(models.Model):
    stage = models.CharField(max_length=20, choices=User.MotherhoodStage.choices)
    title = models.CharField(max_length=200)
    summary = models.CharField(max_length=300)
    content = models.TextField()
    category = models.CharField(max_length=100, blank=True, default='')
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    # attribution — left blank for topics that are general guidance with no single
    # authoritative source (e.g. general parenting tips); never fabricated
    source_name = models.CharField(max_length=50, blank=True, default='')
    source_url = models.URLField(blank=True, default='')
    # full display sentence, worded precisely per source — e.g. a thematic-fit source
    # (like APA on parental stress, rather than an exact "mental load" match) needs
    # honest wording that a generic template couldn't guarantee
    attribution_note = models.CharField(max_length=200, blank=True, default='')
    last_reviewed_at = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['stage', 'order']

    def __str__(self):
        return f"[{self.stage}] {self.title}"
