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

    class Meta:
        ordering = ['stage', 'order']

    def __str__(self):
        return f"[{self.stage}] {self.title}"
