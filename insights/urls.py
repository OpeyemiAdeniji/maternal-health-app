from django.urls import path

from .views import InsightsView

urlpatterns = [
    path('', InsightsView.as_view(), name='insights'),
]
