from django.http import Http404
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, generics
from django.contrib.auth.models import User
from kanbanboard.models import TaskItem
from kanbanboard.serializers import TaskItemSerializer, UserSerializer
from django.contrib.auth import get_user_model
from rest_framework.authentication import TokenAuthentication
from rest_framework import status

class TaskItemView(APIView):
    # authentication_classes = [authentication.TokenAuthentication]
    # permission_classes = [permissions.IsAdminUser]
    
    def get_object(self, pk):
        try:
            return TaskItem.objects.get(pk=pk)
        except TaskItem.DoesNotExist:
            raise Http404

    def get(self, request, pk=None, format=None):
        if pk:
            task = TaskItem.objects.get(pk=pk)
            serializer = TaskItemSerializer(task)
        else:
            tasks = TaskItem.objects.all()
            serializer = TaskItemSerializer(tasks, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = TaskItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      
    def put(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = TaskItemSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
      
class UserList(generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
