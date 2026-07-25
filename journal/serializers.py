from rest_framework import serializers
from .models import JournalEntry


class JournalEntrySerializer(serializers.ModelSerializer):
    mood_tags = serializers.ListField(
        child=serializers.ChoiceField(choices=JournalEntry.MOOD_CHOICES),
        required=False,
    )

    class Meta:
        model = JournalEntry
        fields = ['id', 'body_text', 'mood_tags', 'sentiment_score', 'created_at']
        read_only_fields = ['id', 'sentiment_score', 'created_at']

    def validate_body_text(self, value):
        if not value.strip():
            raise serializers.ValidationError('Journal entry cannot be empty.')
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # bridges pre-multi-tag entries into the same list shape as new ones, so the
        # frontend never has to special-case an entry created before this field existed
        data['mood_tags'] = instance.effective_mood_tags
        return data
