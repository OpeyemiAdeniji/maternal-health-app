from rest_framework import serializers

from authentication.serializers import HealthcareContactSerializer


class SupportResourceItemSerializer(serializers.Serializer):
    name = serializers.CharField()
    description = serializers.CharField()
    url = serializers.URLField()
    phone = serializers.CharField()


class SupportResourcesResponseSerializer(serializers.Serializer):
    personal_contact = HealthcareContactSerializer(required=False)
    resources = SupportResourceItemSerializer(many=True)
    stage_resources = SupportResourceItemSerializer(many=True)


class DailyRoutineResponseSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()
    duration = serializers.CharField()
    icon = serializers.CharField()


class LoveNoteDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    sender_name = serializers.CharField()
    sender_relationship = serializers.CharField()
    message_text = serializers.CharField()
    created_at = serializers.DateTimeField()


class LoveNoteActionResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()
