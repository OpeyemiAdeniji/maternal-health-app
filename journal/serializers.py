from rest_framework import serializers
from .models import JournalEntry


class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['id', 'body_text', 'mood_tag', 'sentiment_score', 'created_at']
        read_only_fields = ['id', 'sentiment_score', 'created_at']

    def validate_body_text(self, value):
        if not value.strip():
            raise serializers.ValidationError('Journal entry cannot be empty.')
        return value
