from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.models import HealthcareContact
from authentication.serializers import HealthcareContactSerializer

from .resources import IRISH_SUPPORT_RESOURCES


class SupportResourcesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {}
        contact = HealthcareContact.objects.filter(user=request.user).first()
        if contact:
            data['personal_contact'] = HealthcareContactSerializer(contact).data
        data['resources'] = IRISH_SUPPORT_RESOURCES
        return Response(data)
