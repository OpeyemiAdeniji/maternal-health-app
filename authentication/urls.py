from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='auth-register'),
    path('login/', views.LoginView.as_view(), name='auth-login'),
    path('forgot-password/', views.ForgotPasswordView.as_view(), name='auth-forgot-password'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='auth-reset-password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='auth-token-refresh'),
    path('profile/', views.ProfileView.as_view(), name='auth-profile'),
    path('account/', views.DeleteAccountView.as_view(), name='auth-delete-account'),
    path('fcm-token/', views.SaveFCMTokenView.as_view(), name='auth-fcm-token'),
]
