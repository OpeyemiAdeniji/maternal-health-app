from datetime import timedelta

from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from checkins.models import CheckIn
from epds.models import EPDSResult
from messages_app.selector import get_love_bombing_messages

from .models import HealthcareContact

CLINICAL_RELATIONSHIPS = {HealthcareContact.Relationship.GP, HealthcareContact.Relationship.MIDWIFE}
MOOD_TREND_DAYS = 30


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
