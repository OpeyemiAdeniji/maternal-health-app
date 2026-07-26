from django.conf import settings
from django.db import models
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.models import HealthcareContact

from .serializers import LoveNoteActionResponseSerializer, LoveNoteDetailSerializer


class LoveNote(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='love_notes')
    sender_name = models.CharField(max_length=255)
    sender_relationship = models.CharField(max_length=20, blank=True, default='')
    message_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - from {self.sender_name}"


class LoveNoteSerializer(serializers.ModelSerializer):
    # identifies which user this note is for, without requiring the sender to log in
    token = serializers.UUIDField(write_only=True)

    class Meta:
        model = LoveNote
        fields = ['token', 'message_text', 'created_at']
        read_only_fields = ['created_at']

    def validate_message_text(self, value):
        if not value.strip():
            raise serializers.ValidationError('Message cannot be empty.')
        return value

    def create(self, validated_data):
        contact = get_object_or_404(HealthcareContact, unique_token=validated_data.pop('token'))
        return LoveNote.objects.create(
            user=contact.user,
            sender_name=contact.name,
            sender_relationship=contact.relationship_type,
            message_text=validated_data['message_text'],
        )


class LoveNoteView(generics.CreateAPIView):
    serializer_class = LoveNoteSerializer
    permission_classes = [AllowAny]


class LatestLoveNoteView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LoveNoteDetailSerializer

    @extend_schema(responses=LoveNoteDetailSerializer)
    def get(self, request):
        note = LoveNote.objects.filter(user=request.user, is_read=False).first()
        if not note:
            return Response(None)
        return Response({
            'id': note.id,
            'sender_name': note.sender_name,
            'sender_relationship': note.sender_relationship,
            'message_text': note.message_text,
            'created_at': note.created_at,
        })


class MarkLoveNoteReadView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LoveNoteActionResponseSerializer

    @extend_schema(request=None, responses=LoveNoteActionResponseSerializer)
    def patch(self, request, pk):
        note = get_object_or_404(LoveNote, pk=pk, user=request.user)
        note.is_read = True
        note.save(update_fields=['is_read'])
        return Response({'detail': 'Marked as read.'})
