from rest_framework import serializers
from django.utils import timezone
from .models import CheckIn


class CheckInSerializer(serializers.ModelSerializer):
    date = serializers.DateField(read_only=True)

    class Meta:
        model = CheckIn
        fields = ['id', 'date', 'mood_score', 'sleep_score', 'trigger_note', 'created_at']
        read_only_fields = ['id', 'date', 'created_at']

    def validate_mood_score(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError('Mood score must be between 1 and 5.')
        return value

    def validate_sleep_score(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError('Sleep score must be between 1 and 5.')
        return value

    def validate(self, data):
        user = self.context['request'].user
        today = timezone.localdate()
        if CheckIn.objects.filter(user=user, date=today).exists():
            raise serializers.ValidationError("You've already submitted a check-in for today.")
        return data

    def create(self, validated_data):
        # inject user and today's date — not coming from the request body
        validated_data['user'] = self.context['request'].user
        validated_data['date'] = timezone.localdate()
        return super().create(validated_data)
