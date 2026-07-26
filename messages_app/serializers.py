from rest_framework import serializers

from .models import SupportiveMessage


class SupportiveMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportiveMessage
        fields = ['id', 'message_text', 'category', 'is_llm_generated', 'created_at']
        read_only_fields = fields


class DailyAffirmationResponseSerializer(serializers.Serializer):
    message_text = serializers.CharField()


class LoveBombingResponseSerializer(serializers.Serializer):
    is_triggered = serializers.BooleanField()
    messages = serializers.ListField(child=serializers.CharField())
