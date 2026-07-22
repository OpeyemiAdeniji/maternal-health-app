from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, HealthcareContact


class HealthcareContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthcareContact
        fields = ['id', 'name', 'phone', 'relationship_type', 'unique_token', 'created_at']
        read_only_fields = ['id', 'unique_token', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'full_name', 'country', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data.pop('confirm_password'):
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password'],
        )
        if 'country' in validated_data:
            user.country = validated_data['country']
            user.save()
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
    # multiple contacts now live under /api/contacts/ — exposed here read-only for convenience
    healthcare_contacts = HealthcareContactSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'email',
            'full_name',
            'country',
            'motherhood_stage',
            'pregnancy_week',
            'due_date',
            'baby_age_months',
            'feeding_method',
            'stage_reason',
            'notifications_enabled',
            'created_at',
            'healthcare_contacts',
        ]
        read_only_fields = ['email', 'created_at']

    def update(self, instance, validated_data):
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.country = validated_data.get('country', instance.country)
        instance.motherhood_stage = validated_data.get('motherhood_stage', instance.motherhood_stage)
        instance.pregnancy_week = validated_data.get('pregnancy_week', instance.pregnancy_week)
        instance.due_date = validated_data.get('due_date', instance.due_date)
        instance.baby_age_months = validated_data.get('baby_age_months', instance.baby_age_months)
        instance.feeding_method = validated_data.get('feeding_method', instance.feeding_method)
        instance.stage_reason = validated_data.get('stage_reason', instance.stage_reason)
        instance.notifications_enabled = validated_data.get('notifications_enabled', instance.notifications_enabled)
        instance.save()
        return instance
