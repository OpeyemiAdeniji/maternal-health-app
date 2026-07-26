from rest_framework import serializers
from .models import AppNotification


class AppNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppNotification
        fields = ['id', 'title', 'message', 'notification_type', 'is_read', 'created_at']
        read_only_fields = ['id', 'title', 'message', 'notification_type', 'created_at']


class NotificationActionResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()
