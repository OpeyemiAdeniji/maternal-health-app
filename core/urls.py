"""Root URL configuration for the Modacare API."""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from authentication.safety_net_views import PublicContactView
from authentication.views import HealthcareContactDetailView, HealthcareContactListCreateView
from support.love_notes import LoveNoteView, LatestLoveNoteView, MarkLoveNoteReadView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    path('api/auth/', include('authentication.urls')),
    path('api/checkins/', include('checkins.urls')),
    path('api/journal/', include('journal.urls')),
    path('api/epds/', include('epds.urls')),
    path('api/insights/', include('insights.urls')),
    path('api/support/', include('support.urls')),
    path('api/messages/', include('messages_app.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/learn/', include('learn.urls')),

    # public safety-net contact link, no auth, identified by the contact's own token
    path('api/safety-net/<uuid:token>/', PublicContactView.as_view(), name='safety-net-public'),
    # authenticated management of a user's own safety-net contacts
    path('api/contacts/', HealthcareContactListCreateView.as_view(), name='auth-contacts'),
    path('api/contacts/<int:pk>/', HealthcareContactDetailView.as_view(), name='auth-contact-detail'),

    path('api/love-notes/', LoveNoteView.as_view(), name='love-notes-create'),
    path('api/love-notes/latest/', LatestLoveNoteView.as_view(), name='love-notes-latest'),
    path('api/love-notes/<int:pk>/read/', MarkLoveNoteReadView.as_view(), name='love-notes-mark-read'),
]
