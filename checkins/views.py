from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import CheckIn
from .serializers import CheckInSerializer


class CheckInListCreateView(generics.ListCreateAPIView):
    serializer_class = CheckInSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CheckIn.objects.filter(user=self.request.user)
