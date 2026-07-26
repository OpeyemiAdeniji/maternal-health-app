from datetime import timedelta

import anthropic
from django.conf import settings
from django.http import Http404
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from checkins.models import CheckIn
from journal.models import JournalEntry

from .models import DailyAffirmation, SupportiveMessage
from .selector import get_daily_affirmation_message, get_love_bombing_messages
from .serializers import DailyAffirmationResponseSerializer, LoveBombingResponseSerializer, SupportiveMessageSerializer

AFFIRMATION_SYSTEM_PROMPT = (
    "You are Moda, a warm caring maternal mental health companion. Write a short "
    "personal daily affirmation for a user. Keep it under 60 words, 2-3 sentences "
    "maximum. Feel like a caring friend not a clinical tool. Never diagnose. "
    "Reference something specific about their data."
)


def _weekly_mood(user):
    # last 7 days including today, one representative score per day (the most recent check-in of
    # that day) rather than one per row — otherwise a day with several check-ins would skew both
    # the average and the recent-vs-earlier trend split
    since = timezone.localdate() - timedelta(days=6)
    checkins = CheckIn.objects.filter(user=user, date__gte=since).order_by('-date', '-created_at')

    daily_mood = {}
    for c in checkins:
        daily_mood.setdefault(c.date, c.mood_score)
    if not daily_mood:
        return None, None

    scores = [daily_mood[d] for d in sorted(daily_mood.keys())]  # chronological

    average = sum(scores) / len(scores)

    recent, earlier = scores[-3:], scores[:-3]
    if not earlier:
        trend = 'stable'
    else:
        recent_avg = sum(recent) / len(recent)
        earlier_avg = sum(earlier) / len(earlier)
        if recent_avg > earlier_avg:
            trend = 'improving'
        elif recent_avg < earlier_avg:
            trend = 'declining'
        else:
            trend = 'stable'

    return average, trend


def _build_affirmation_prompt(user):
    average_mood, trend = _weekly_mood(user)
    first_name = user.full_name.split(' ')[0] if user.full_name else 'there'

    lines = [
        f"Their name is {first_name}.",
        f"Their motherhood stage is: {user.get_motherhood_stage_display()}.",
    ]
    if average_mood is not None:
        lines.append(f"Their average mood this week is {average_mood:.1f}/5, and the trend is {trend}.")
    else:
        lines.append("They haven't logged any check-ins this week.")

    mood_labels = dict(JournalEntry.MOOD_CHOICES)
    recent_moods = [
        ', '.join(mood_labels.get(tag, tag) for tag in entry.effective_mood_tags)
        for entry in JournalEntry.objects.filter(user=user)[:2]
        if entry.effective_mood_tags
    ]
    if recent_moods:
        lines.append(f"Their recent journal mood tags are: {', '.join(recent_moods)}.")

    lines.append("Write a warm, personal daily affirmation specific to their situation.")
    return '\n'.join(lines)


def _generate_ai_affirmation(user):
    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    response = client.messages.create(
        model='claude-haiku-4-5-20251001',
        max_tokens=150,
        system=AFFIRMATION_SYSTEM_PROMPT,
        messages=[{'role': 'user', 'content': _build_affirmation_prompt(user)}],
    )
    return response.content[0].text.strip()


class LatestMessageView(RetrieveAPIView):
    serializer_class = SupportiveMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # model ordering is already -created_at, so first() is the latest
        message = SupportiveMessage.objects.filter(user=self.request.user).first()
        if message is None:
            raise Http404
        return message


class LoveBombingView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LoveBombingResponseSerializer

    @extend_schema(responses=LoveBombingResponseSerializer)
    def get(self, request):
        messages = get_love_bombing_messages(request.user)
        if messages:
            return Response({'is_triggered': True, 'messages': messages})
        return Response({'is_triggered': False, 'messages': []})


class DailyAffirmationView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DailyAffirmationResponseSerializer

    @extend_schema(responses=DailyAffirmationResponseSerializer)
    def get(self, request):
        today = timezone.localdate()
        affirmation = DailyAffirmation.objects.filter(user=request.user, date=today).first()

        if not affirmation:
            try:
                message = _generate_ai_affirmation(request.user)
            except Exception:
                message = get_daily_affirmation_message(request.user)
            affirmation = DailyAffirmation.objects.create(user=request.user, message_text=message)

        return Response({'message_text': affirmation.message_text})
