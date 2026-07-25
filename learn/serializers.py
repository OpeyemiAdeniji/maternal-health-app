from rest_framework import serializers

from .models import LearnTopic


class LearnTopicListSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearnTopic
        fields = ['id', 'stage', 'title', 'summary', 'category', 'order']


class LearnTopicDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearnTopic
        fields = ['id', 'stage', 'title', 'summary', 'content', 'category', 'order']
