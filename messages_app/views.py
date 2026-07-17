from django.http import Http404
from django.utils import timezone
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DailyAffirmation, SupportiveMessage
from .selector import get_daily_affirmation_message, get_love_bombing_messages
from .serializers import SupportiveMessageSerializer


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

    def get(self, request):
        messages = get_love_bombing_messages(request.user)
        if messages:
            return Response({'is_triggered': True, 'messages': messages})
        return Response({'is_triggered': False, 'messages': []})


class DailyAffirmationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        affirmation = DailyAffirmation.objects.filter(user=request.user, date=today).first()

        if not affirmation:
            message = get_daily_affirmation_message(request.user)
            affirmation = DailyAffirmation.objects.create(user=request.user, message_text=message)

        return Response({'message_text': affirmation.message_text})
