from datetime import timedelta

from django.utils import timezone
from rest_framework import serializers

from .models import EPDSResult


class EPDSSubmitSerializer(serializers.ModelSerializer):
    responses = serializers.ListField(
        child=serializers.IntegerField(min_value=0, max_value=3)
    )

    class Meta:
        model = EPDSResult
        fields = ['id', 'responses', 'score', 'positive_screen', 'likely_depression', 'created_at', 'next_due_at']
        read_only_fields = ['id', 'score', 'positive_screen', 'likely_depression', 'created_at', 'next_due_at']

    def validate_responses(self, value):
        if len(value) != 10:
            raise serializers.ValidationError('EPDS requires exactly 10 responses.')
        return value

    def create(self, validated_data):
        score = sum(validated_data['responses'])
        validated_data['score'] = score
        validated_data['positive_screen'] = score >= 10
        validated_data['likely_depression'] = score >= 13
        validated_data['next_due_at'] = timezone.now() + timedelta(days=14)
        return super().create(validated_data)
