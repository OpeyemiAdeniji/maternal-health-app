from django.urls import path
from . import views

urlpatterns = [
    path('', views.CheckInListCreateView.as_view(), name='checkin-list-create'),
]
