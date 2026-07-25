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

    class MaritalStatus(models.TextChoices):
        SINGLE = 'single', 'Single'
        MARRIED_PARTNERED = 'married_partnered', 'Married / Partnered'
        DIVORCED_SEPARATED = 'divorced_separated', 'Divorced / Separated'
        WIDOWED = 'widowed', 'Widowed'
        PREFER_NOT_TO_SAY = 'prefer_not_to_say', 'Prefer not to say'

    class EmploymentStatus(models.TextChoices):
        FULL_TIME = 'full_time', 'Working full-time'
        PART_TIME = 'part_time', 'Working part-time'
        STAY_AT_HOME = 'stay_at_home', 'Stay-at-home parent'
        STUDYING = 'studying', 'Studying'
        NOT_WORKING = 'not_working', 'Not currently working'
        PREFER_NOT_TO_SAY = 'prefer_not_to_say', 'Prefer not to say'

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
    # set once the user finishes the full onboarding flow (stage questions + Safety Net) —
    # gates access to the Dashboard and other protected screens until then
    onboarding_complete = models.BooleanField(default=False)
    # onboarding follow-up details — only some apply, depending on motherhood_stage
    pregnancy_week = models.IntegerField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    baby_age_months = models.IntegerField(null=True, blank=True)
    feeding_method = models.CharField(max_length=100, blank=True, default='')
    stage_reason = models.CharField(max_length=200, blank=True, default='')
    # seasoned-mother-specific follow-up details — all optional, same as the other stages'
    marital_status = models.CharField(max_length=20, choices=MaritalStatus.choices, blank=True, default='')
    number_of_children = models.PositiveIntegerField(null=True, blank=True)
    employment_status = models.CharField(max_length=20, choices=EmploymentStatus.choices, blank=True, default='')
    # device push token for FCM — blank until the user grants notification permission
    fcm_token = models.TextField(blank=True, default='')
    notifications_enabled = models.BooleanField(default=True)
    # last time the user dismissed the post-registration EPDS nudge — null until dismissed once
    epds_prompt_dismissed_at = models.DateTimeField(null=True, blank=True)
    # last time the user actually opened the Learn page — null until their first visit
    last_visited_learn_at = models.DateTimeField(null=True, blank=True)
    # separate from last_visited_learn_at: tracks the one-time Learn coach-mark, not page visits
    learn_coachmark_dismissed = models.BooleanField(default=False)
    # de-dup guard for the love-bombing personal-contact SMS — null until the first alert is
    # ever sent; prevents re-sending every day a low-mood streak continues
    last_love_bombing_contact_alert_at = models.DateTimeField(null=True, blank=True)
    # tracks the one-time guided tour shown to exploring-stage users on their first Dashboard visit
    exploring_tour_completed = models.BooleanField(default=False)
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
