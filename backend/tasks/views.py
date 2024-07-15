from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication
from tasks.models import TaskItem, SubtaskItem
from tasks.serializers import  TaskItemSerializer, SubtaskItemSerializer
from django.contrib.auth import get_user_model, authenticate
from rest_framework import status
from rest_framework.response import Response

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

    def put(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = SubtaskItemSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)