from django.urls import path

from .views import DailyAffirmationView, LatestMessageView, LoveBombingView

urlpatterns = [
    path('latest/', LatestMessageView.as_view(), name='messages-latest'),
    path('love-bombing/', LoveBombingView.as_view(), name='messages-love-bombing'),
    path('daily-affirmation/', DailyAffirmationView.as_view(), name='messages-daily-affirmation'),
]
