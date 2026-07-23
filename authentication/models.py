import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

# split into its own module, imported here so Django's app registry picks it up for migrations
from .password_reset import PasswordResetToken  # noqa: F401


class UserManager(BaseUserManager):
    # we use email to log in, not username
    def create_user(self, email, full_name, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name)
        # set_password handles hashing, never store plain text
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password):
        user = self.create_user(email, full_name, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    class Country(models.TextChoices):
        IRELAND = 'IRELAND', 'Ireland'
        UNITED_KINGDOM = 'UNITED_KINGDOM', 'United Kingdom'
        UNITED_STATES = 'UNITED_STATES', 'United States'
        CANADA = 'CANADA', 'Canada'
        AUSTRALIA = 'AUSTRALIA', 'Australia'

    class MotherhoodStage(models.TextChoices):
        PREGNANT = 'pregnant', 'Pregnant'
        POSTPARTUM = 'postpartum', 'Postpartum'
        SEASONED = 'seasoned', 'Seasoned mother'
        EXPLORING = 'exploring', 'Just exploring'

    # swapped username for email as the login field
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    country = models.CharField(
        max_length=20,
        choices=Country.choices,
        default=Country.IRELAND,
        blank=True,
    )
    motherhood_stage = models.CharField(
        max_length=20,
        choices=MotherhoodStage.choices,
        default=MotherhoodStage.POSTPARTUM,
        blank=True,
    )
    # onboarding follow-up details — only some apply, depending on motherhood_stage
    pregnancy_week = models.IntegerField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    baby_age_months = models.IntegerField(null=True, blank=True)
    feeding_method = models.CharField(max_length=100, blank=True, default='')
    stage_reason = models.CharField(max_length=200, blank=True, default='')
    # device push token for FCM — blank until the user grants notification permission
    fcm_token = models.TextField(blank=True, default='')
    notifications_enabled = models.BooleanField(default=True)
    # last time the user dismissed the post-registration EPDS nudge — null until dismissed once
    epds_prompt_dismissed_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.email


class HealthcareContact(models.Model):
    # a user's "Safety Net" — can have several: partner, friends, family, GP, midwife
    class Relationship(models.TextChoices):
        PARTNER = 'partner', 'Partner'
        FRIEND = 'friend', 'Best Friend'
        FAMILY = 'family', 'Family'
        GP = 'gp', 'GP'
        MIDWIFE = 'midwife', 'Midwife'

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='healthcare_contacts'
    )
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    relationship_type = models.CharField(
        max_length=20,
        choices=Relationship.choices,
        default=Relationship.PARTNER,
    )
    # powers this contact's private safety-net link — never exposed except as part of that URL
    unique_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.name} ({self.relationship_type})"
