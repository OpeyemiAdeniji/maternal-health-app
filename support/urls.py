from django.urls import path

from .views import SupportResourcesView

urlpatterns = [
    path('', SupportResourcesView.as_view(), name='support-resources'),
]
