from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from learn.models import LearnTopic
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
    # true if any LearnTopic for the user's stage was created after their last Learn visit
    has_new_learn_content = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'email',
            'full_name',
            'country',
            'motherhood_stage',
            'onboarding_complete',
            'pregnancy_week',
            'due_date',
            'baby_age_months',
            'feeding_method',
            'stage_reason',
            'marital_status',
            'number_of_children',
            'employment_status',
            'notifications_enabled',
            'epds_prompt_dismissed_at',
            'last_visited_learn_at',
            'learn_coachmark_dismissed',
            'exploring_tour_completed',
            'has_new_learn_content',
            'created_at',
            'healthcare_contacts',
        ]
        read_only_fields = ['email', 'created_at', 'has_new_learn_content']

    def get_has_new_learn_content(self, obj):
        # never visited — everything is "new" to them
        if obj.last_visited_learn_at is None:
            return True
        return LearnTopic.objects.filter(
            stage=obj.motherhood_stage,
            created_at__gt=obj.last_visited_learn_at,
        ).exists()

    def update(self, instance, validated_data):
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.country = validated_data.get('country', instance.country)
        instance.motherhood_stage = validated_data.get('motherhood_stage', instance.motherhood_stage)
        instance.onboarding_complete = validated_data.get('onboarding_complete', instance.onboarding_complete)
        instance.pregnancy_week = validated_data.get('pregnancy_week', instance.pregnancy_week)
        instance.due_date = validated_data.get('due_date', instance.due_date)
        instance.baby_age_months = validated_data.get('baby_age_months', instance.baby_age_months)
        instance.feeding_method = validated_data.get('feeding_method', instance.feeding_method)
        instance.stage_reason = validated_data.get('stage_reason', instance.stage_reason)
        instance.marital_status = validated_data.get('marital_status', instance.marital_status)
        instance.number_of_children = validated_data.get('number_of_children', instance.number_of_children)
        instance.employment_status = validated_data.get('employment_status', instance.employment_status)
        instance.notifications_enabled = validated_data.get('notifications_enabled', instance.notifications_enabled)
        instance.epds_prompt_dismissed_at = validated_data.get(
            'epds_prompt_dismissed_at', instance.epds_prompt_dismissed_at
        )
        instance.last_visited_learn_at = validated_data.get(
            'last_visited_learn_at', instance.last_visited_learn_at
        )
        instance.learn_coachmark_dismissed = validated_data.get(
            'learn_coachmark_dismissed', instance.learn_coachmark_dismissed
        )
        instance.exploring_tour_completed = validated_data.get(
            'exploring_tour_completed', instance.exploring_tour_completed
        )
        instance.save()
        return instance
