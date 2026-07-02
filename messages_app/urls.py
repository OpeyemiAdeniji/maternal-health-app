from django.urls import path

from .views import LatestMessageView

urlpatterns = [
    path('latest/', LatestMessageView.as_view(), name='messages-latest'),
]
