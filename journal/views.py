import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import JournalEntry
from .serializers import JournalEntrySerializer

nltk.download('vader_lexicon', quiet=True)


class JournalEntryListCreateView(generics.ListCreateAPIView):
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        sid = SentimentIntensityAnalyzer()
        score = sid.polarity_scores(serializer.validated_data['body_text'])['compound']
        serializer.save(user=self.request.user, sentiment_score=score)
