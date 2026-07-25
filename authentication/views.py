import logging

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from notifications.email import send_password_reset_email, send_welcome_email

from .models import HealthcareContact, User
from .password_reset import PasswordResetToken, generate_reset_token, validate_reset_token
from .serializers import HealthcareContactSerializer, RegisterSerializer, LoginSerializer, ProfileSerializer
from .sms import send_safety_net_link

logger = logging.getLogger(__name__)

# view for register
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        try:
            send_welcome_email(user.email, user.full_name)
        except Exception:
            logger.exception('Failed to send welcome email to %s', user.email)

        return Response({'message': 'Account created successfully.'}, status=status.HTTP_201_CREATED)

# view for login
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        return Response({
            'access': data['access'],
            'refresh': data['refresh'],
            'user': {
                'email': data['user'].email,
                'full_name': data['user'].full_name,
                'motherhood_stage': data['user'].motherhood_stage,
            },
        })

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '')
        user = User.objects.filter(email=email).first()

        if user:
            reset_token = generate_reset_token(user)
            try:
                send_password_reset_email(user.email, user.full_name, reset_token.token)
            except Exception:
                logger.exception('Failed to send password reset email to %s', user.email)

        # same response either way — don't reveal whether the email exists
        return Response({'message': "If that email exists, we've sent a reset link."})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token', '')
        new_password = request.data.get('new_password', '')
        confirm_password = request.data.get('confirm_password', '')

        if new_password != confirm_password:
            return Response({'confirm_password': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
        if len(new_password) < 8:
            return Response({'new_password': 'Password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        user = validate_reset_token(token)
        if not user:
            return Response({'token': 'This reset link is invalid or has expired.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save(update_fields=['password'])
        PasswordResetToken.objects.filter(token=token).update(is_used=True)

        return Response({'message': 'Password updated successfully.'})


# view for profile
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    # no DELETE, no list — just the logged-in user's own profile
    http_method_names = ['get', 'put', 'patch', 'head', 'options']

    def get_object(self):
        return self.request.user


class HealthcareContactListCreateView(generics.ListCreateAPIView):
    serializer_class = HealthcareContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HealthcareContact.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        contact = serializer.save(user=self.request.user)
        send_safety_net_link(
            contact_name=contact.name,
            phone_number=contact.phone,
            relationship_type=contact.relationship_type,
            token=contact.unique_token,
            user_name=self.request.user.full_name,
        )


class HealthcareContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HealthcareContactSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        return HealthcareContact.objects.filter(user=self.request.user)


class SaveFCMTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get('token', '')
        if not token:
            return Response({'detail': 'Token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        request.user.fcm_token = token
        request.user.save(update_fields=['fcm_token'])
        return Response({'detail': 'Token saved.'})
