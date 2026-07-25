from rest_framework import serializers
from django.utils import timezone
from messages_app.selector import get_message_for_checkin
from .models import CheckIn


class CheckInSerializer(serializers.ModelSerializer):
    date = serializers.DateField(read_only=True)
    supportive_message = serializers.SerializerMethodField()

    class Meta:
        model = CheckIn
        fields = ['id', 'date', 'mood_score', 'sleep_score', 'trigger_note', 'created_at', 'supportive_message']
        read_only_fields = ['id', 'date', 'created_at', 'supportive_message']

    def get_supportive_message(self, obj):
        # only set on the instance we just created (see create() below) — a plain
        # queryset fetch (list/retrieve) won't have this, so history views don't pay
        # for the lookup or get a re-rolled message on every read
        message_text = getattr(obj, '_supportive_message_text', None)
        return {'message_text': message_text} if message_text else None

    def validate_mood_score(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError('Mood score must be between 1 and 5.')
        return value

    def validate_sleep_score(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError('Sleep score must be between 1 and 5.')
        return value

    def create(self, validated_data):
        # inject user and today's date — not coming from the request body
        validated_data['user'] = self.context['request'].user
        validated_data['date'] = timezone.localdate()
        checkin = super().create(validated_data)
        checkin._supportive_message_text = get_message_for_checkin(checkin)
        return checkin
