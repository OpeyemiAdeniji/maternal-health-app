from rest_framework import serializers

from .models import InsightCache


class InsightCacheSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsightCache
        fields = ['id', 'trend_direction', 'correlation_strength', 'insight_cards', 'computed_at']
        read_only_fields = fields
