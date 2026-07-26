import random

from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DailyRoutine
from .routines import DAILY_ROUTINES
from .serializers import DailyRoutineResponseSerializer


class DailyRoutineView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DailyRoutineResponseSerializer

    @extend_schema(responses=DailyRoutineResponseSerializer)
    def get(self, request):
        today = timezone.localdate()
        routine = DailyRoutine.objects.filter(user=request.user, date=today).first()

        if not routine:
            stage = request.user.motherhood_stage if request.user.motherhood_stage in DAILY_ROUTINES else 'postpartum'
            picked = random.choice(DAILY_ROUTINES[stage])
            routine = DailyRoutine.objects.create(
                user=request.user,
                routine_title=picked['title'],
                routine_description=picked['description'],
                routine_duration=picked['duration'],
                icon=picked['icon'],
                date=today,
            )

        return Response({
            'title': routine.routine_title,
            'description': routine.routine_description,
            'duration': routine.routine_duration,
            'icon': routine.icon,
        })
