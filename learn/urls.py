from django.urls import path

from .views import LearnTopicDetailView, LearnTopicListView

urlpatterns = [
    path('', LearnTopicListView.as_view(), name='learn-list'),
    path('<int:pk>/', LearnTopicDetailView.as_view(), name='learn-detail'),
]
