from datetime import timedelta

from django.shortcuts import get_object_or_404
from django.utils import timezone
from drf_spectacular.utils import PolymorphicProxySerializer, extend_schema
from rest_framework import serializers
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from checkins.models import CheckIn
from epds.models import EPDSResult
from messages_app.selector import get_love_bombing_messages

from .models import HealthcareContact

CLINICAL_RELATIONSHIPS = {HealthcareContact.Relationship.GP, HealthcareContact.Relationship.MIDWIFE}
MOOD_TREND_DAYS = 30


class MoodHistoryItemSerializer(serializers.Serializer):
    date = serializers.DateField()
    mood_score = serializers.IntegerField()


class SleepHistoryItemSerializer(serializers.Serializer):
    date = serializers.DateField()
    sleep_score = serializers.IntegerField()


class EPDSScoreItemSerializer(serializers.Serializer):
    score = serializers.IntegerField()
    positive_screen = serializers.BooleanField()
    likely_depression = serializers.BooleanField()
    created_at = serializers.DateTimeField()


class MoodTrendItemSerializer(serializers.Serializer):
    date = serializers.DateField()
    mood_score = serializers.IntegerField()


class ClinicalContactViewSerializer(serializers.Serializer):
    view = serializers.ChoiceField(choices=['clinical'])
    contact_name = serializers.CharField()
    relationship_type = serializers.CharField()
    user_name = serializers.CharField()
    mood_history = MoodHistoryItemSerializer(many=True)
    sleep_history = SleepHistoryItemSerializer(many=True)
    epds_scores = EPDSScoreItemSerializer(many=True)


class PersonalContactViewSerializer(serializers.Serializer):
    view = serializers.ChoiceField(choices=['personal'])
    contact_name = serializers.CharField()
    relationship_type = serializers.CharField()
    user_name = serializers.CharField()
    mood_trend = MoodTrendItemSerializer(many=True)
    current_streak = serializers.IntegerField()
    love_bombing_triggered = serializers.BooleanField()


PublicContactViewResponseSerializer = PolymorphicProxySerializer(
    component_name='PublicContactViewResponse',
    serializers=[ClinicalContactViewSerializer, PersonalContactViewSerializer],
    resource_type_field_name='view',
)


def _current_streak(user):
    dates = set(CheckIn.objects.filter(user=user).values_list('date', flat=True))
    cursor = timezone.localdate()
    if cursor not in dates:
        cursor -= timedelta(days=1)
    streak = 0
    while cursor in dates:
        streak += 1
        cursor -= timedelta(days=1)
    return streak


class PublicContactView(APIView):
    # accessed via a contact's private link — no login, identified entirely by the token
    permission_classes = [AllowAny]
    serializer_class = ClinicalContactViewSerializer

    @extend_schema(responses=PublicContactViewResponseSerializer)
    def get(self, request, token):
        contact = get_object_or_404(HealthcareContact, unique_token=token)
        user = contact.user

        if contact.relationship_type in CLINICAL_RELATIONSHIPS:
            checkins = CheckIn.objects.filter(user=user).order_by('date')
            epds_results = EPDSResult.objects.filter(user=user).order_by('-created_at')[:10]
            return Response({
                'view': 'clinical',
                'contact_name': contact.name,
                'relationship_type': contact.relationship_type,
                'user_name': user.full_name,
                'mood_history': [{'date': c.date.isoformat(), 'mood_score': c.mood_score} for c in checkins],
                'sleep_history': [{'date': c.date.isoformat(), 'sleep_score': c.sleep_score} for c in checkins],
                'epds_scores': [
                    {
                        'score': result.score,
                        'positive_screen': result.positive_screen,
                        'likely_depression': result.likely_depression,
                        'created_at': result.created_at.isoformat(),
                    }
                    for result in epds_results
                ],
            })

        since = timezone.localdate() - timedelta(days=MOOD_TREND_DAYS)
        recent_checkins = CheckIn.objects.filter(user=user, date__gte=since).order_by('date')
        return Response({
            'view': 'personal',
            'contact_name': contact.name,
            'relationship_type': contact.relationship_type,
            'user_name': user.full_name,
            'mood_trend': [{'date': c.date.isoformat(), 'mood_score': c.mood_score} for c in recent_checkins],
            'current_streak': _current_streak(user),
            'love_bombing_triggered': bool(get_love_bombing_messages(user)),
        })
