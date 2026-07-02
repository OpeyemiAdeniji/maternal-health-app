from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from .analysis import analyse_user_patterns
from .serializers import InsightCacheSerializer


class InsightsView(RetrieveAPIView):
    serializer_class = InsightCacheSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return analyse_user_patterns(self.request.user)
