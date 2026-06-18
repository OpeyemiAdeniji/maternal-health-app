from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, HealthcareContact


class HealthcareContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthcareContact
        fields = ['name', 'phone', 'notes']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    # optional at registration — user can add this later via profile
    healthcare_contact = HealthcareContactSerializer(required=False)

    class Meta:
        model = User
        fields = ['email', 'full_name', 'password', 'confirm_password', 'healthcare_contact']

    def validate(self, data):
        if data['password'] != data.pop('confirm_password'):
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        contact_data = validated_data.pop('healthcare_contact', None)
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password'],
        )
        if contact_data:
            HealthcareContact.objects.create(user=user, **contact_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid credentials.')
        if not user.is_active:
            raise serializers.ValidationError('Account is disabled.')
        refresh = RefreshToken.for_user(user)
        return {
            'user': user,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }


class ProfileSerializer(serializers.ModelSerializer):
    healthcare_contact = HealthcareContactSerializer(required=False)

    class Meta:
        model = User
        fields = ['email', 'full_name', 'created_at', 'healthcare_contact']
        read_only_fields = ['email', 'created_at']

    def update(self, instance, validated_data):
        contact_data = validated_data.pop('healthcare_contact', None)
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.save()

        if contact_data is not None:
            HealthcareContact.objects.update_or_create(user=instance, defaults=contact_data)

        return instance
