from django.urls import path
from .views import EPDSListCreateView

urlpatterns = [
    path('', EPDSListCreateView.as_view(), name='epds-list-create'),
]
