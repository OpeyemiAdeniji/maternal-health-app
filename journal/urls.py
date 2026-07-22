from django.urls import path
from .views import JournalEntryDetailView, JournalEntryListCreateView

urlpatterns = [
    path('', JournalEntryListCreateView.as_view(), name='journal-list-create'),
    path('<int:pk>/', JournalEntryDetailView.as_view(), name='journal-detail'),
]
