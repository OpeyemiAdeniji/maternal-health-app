from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import LearnTopic
from .serializers import LearnTopicDetailSerializer, LearnTopicListSerializer


class LearnTopicListView(generics.ListAPIView):
    serializer_class = LearnTopicListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return LearnTopic.objects.filter(stage=self.request.user.motherhood_stage).order_by('order')


class LearnTopicDetailView(generics.RetrieveAPIView):
    serializer_class = LearnTopicDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # scoping the queryset to the requester's own stage means a cross-stage id
        # simply isn't found — DRF's default get_object() 404s instead of leaking content
        return LearnTopic.objects.filter(stage=self.request.user.motherhood_stage)
