from datetime import timedelta

import anthropic
from django.conf import settings
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from checkins.models import CheckIn
from journal.models import JournalEntry

from .models import ChatMessage
from .serializers import ChatInputSerializer, ChatMessageSerializer


def _stage_context(user):
    stage = user.motherhood_stage

    if stage == 'pregnant':
        details = []
        if user.pregnancy_week:
            details.append(f"{user.pregnancy_week} weeks along")
        if user.due_date:
            details.append(f"due {user.due_date}")
        if details:
            return f"They are pregnant, {', '.join(details)}."
        return "They are pregnant."

    if stage == 'postpartum':
        details = []
        if user.baby_age_months is not None:
            details.append(f"gave birth {user.baby_age_months} months ago")
        if user.feeding_method:
            details.append(f"are currently {user.feeding_method}")
        if len(details) == 2:
            return f"They {details[0]} and {details[1]}."
        if details:
            return f"They {details[0]}."
        return None

    if stage in ('seasoned', 'exploring'):
        if user.stage_reason:
            return f"Context: {user.stage_reason}."
        return None

    return None


def build_system_prompt(user):
    since = timezone.localdate() - timedelta(days=7)
    checkins = CheckIn.objects.filter(user=user, date__gte=since).order_by('date')
    journal_entries = JournalEntry.objects.filter(user=user)[:3]

    if checkins:
        mood_summary = ', '.join(
            f"{c.date}: mood {c.mood_score}/5, sleep {c.sleep_score}/5" for c in checkins
        )
    else:
        mood_summary = 'No check-ins logged in the last 7 days.'

    if journal_entries:
        journal_summary = ', '.join(
            f"{', '.join(e.effective_mood_tags) or 'untagged'} (sentiment {e.sentiment_score:.2f})"
            if e.sentiment_score is not None else (', '.join(e.effective_mood_tags) or 'untagged')
            for e in journal_entries
        )
    else:
        journal_summary = 'No recent journal entries.'

    intro = (
        f"You are Moda, a warm and supportive maternal mental health companion inside the "
        f"Modacare app. You are talking with {user.full_name}."
    )
    stage_context = _stage_context(user)
    if stage_context:
        intro = f"{intro} {stage_context}"

    return (
        f"{intro}\n\n"
        f"Their check-ins from the last 7 days: {mood_summary}\n"
        f"Their recent journal sentiment: {journal_summary}\n\n"
        "Be gentle, empathetic, and encouraging. Never diagnose any condition, and never "
        "present yourself as a replacement for professional care. If anything in the "
        "conversation suggests the user is struggling or needs real support, gently "
        "encourage them to speak to their GP or midwife."
    )


class ChatView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatInputSerializer

    @extend_schema(request=ChatInputSerializer, responses=ChatMessageSerializer)
    def post(self, request):
        serializer = ChatInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        ChatMessage.objects.create(user=user, role='user', content=serializer.validated_data['content'])

        # last 10 messages, oldest first, to keep conversation context
        recent = ChatMessage.objects.filter(user=user).order_by('-created_at')[:10]
        recent = list(reversed(recent))

        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        response = client.messages.create(
            model='claude-haiku-4-5-20251001',
            max_tokens=1024,
            system=build_system_prompt(user),
            messages=[{'role': m.role, 'content': m.content} for m in recent],
        )
        reply_text = response.content[0].text

        assistant_message = ChatMessage.objects.create(user=user, role='assistant', content=reply_text)
        return Response(ChatMessageSerializer(assistant_message).data)


class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatMessageSerializer

    def get(self, request):
        messages = ChatMessage.objects.filter(user=request.user).order_by('-created_at')[:20]
        messages = list(reversed(messages))
        return Response(ChatMessageSerializer(messages, many=True).data)
