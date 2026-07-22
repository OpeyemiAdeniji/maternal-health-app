from django.urls import path

from .routines_view import DailyRoutineView
from .views import SupportResourcesView

urlpatterns = [
    path('', SupportResourcesView.as_view(), name='support-resources'),
    path('routine/', DailyRoutineView.as_view(), name='support-routine'),
]
