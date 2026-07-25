from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.models import HealthcareContact
from authentication.serializers import HealthcareContactSerializer

from .resources import STAGE_RESOURCES, SUPPORT_RESOURCES


class SupportResourcesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {}
        contact = HealthcareContact.objects.filter(user=request.user).first()
        if contact:
            data['personal_contact'] = HealthcareContactSerializer(contact).data
        country = request.user.country
        data['resources'] = SUPPORT_RESOURCES.get(country, SUPPORT_RESOURCES['IRELAND'])
        data['stage_resources'] = STAGE_RESOURCES.get(request.user.motherhood_stage, [])
        return Response(data)
