from asyncio import exceptions
from django.http import Http404
from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, generics
from kanbanboard.models import TaskItem, SubtaskItem
from kanbanboard.serializers import  TaskItemSerializer, SubtaskItemSerializer, UserSerializer
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            token.key,
        }) 
        
class LogoutView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
  
    def get(self, request, format=None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
      
class AuthView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
  
    def get(self, request, format=None):
        if request.user.is_authenticated:
            return Response(request.user.id, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
      
class TaskItemView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    
    def get_object(self, pk):
        try:
            return TaskItem.objects.get(pk=pk)
        except TaskItem.DoesNotExist:
            return Response({"error": "Todo item not found."}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk=None, format=None):
        if pk:
            try:
              task = TaskItem.objects.get(pk=pk)
              serializer = TaskItemSerializer(task)
            except task.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
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

class SubtaskItemView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    
    def get_object(self, pk):
        try:
            return SubtaskItem.objects.get(pk=pk)
        except SubtaskItem.DoesNotExist:
            raise Http404

    def get(self, request, pk=None, format=None):
        if pk:
            task = SubtaskItem.objects.get(pk=pk)
            serializer = SubtaskItemSerializer(task)
        else:
            tasks = SubtaskItem.objects.all()
            serializer = SubtaskItemSerializer(tasks, many=True)
        return Response(serializer.data)
      
    def post(self, request, format=None):
        serializer = SubtaskItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserListView(generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer