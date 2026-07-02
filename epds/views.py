from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import EPDSResult
from .serializers import EPDSSubmitSerializer


class EPDSListCreateView(generics.ListCreateAPIView):
    serializer_class = EPDSSubmitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EPDSResult.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
