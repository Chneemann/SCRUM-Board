from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, generics
from django.contrib.auth.models import User
from kanbanboard.models import TaskItem
from kanbanboard.serializers import TaskItemSerializer, UserSerializer
from django.contrib.auth import get_user_model
from rest_framework.authentication import TokenAuthentication

class TaskItemView(APIView):
    # authentication_classes = [authentication.TokenAuthentication]
    # permission_classes = [permissions.IsAdminUser]

    def get(self, request, format=None):
        tasks = TaskItem.objects.all()
        serializer = TaskItemSerializer(tasks, many=True)
        return Response(serializer.data)
      
class UserList(generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
