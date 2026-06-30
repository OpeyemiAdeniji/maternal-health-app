from django.urls import path
from .views import JournalEntryListCreateView

urlpatterns = [
    path('', JournalEntryListCreateView.as_view(), name='journal-list-create'),
]
