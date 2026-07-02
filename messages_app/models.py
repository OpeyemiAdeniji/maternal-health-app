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
