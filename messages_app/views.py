from django.http import Http404
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from .models import SupportiveMessage
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
