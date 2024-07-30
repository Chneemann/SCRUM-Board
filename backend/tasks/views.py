from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication
from tasks.models import TaskItem, SubtaskItem
from tasks.serializers import  TaskItemSerializer, SubtaskItemSerializer
from rest_framework import status
from rest_framework.response import Response

class TaskItemView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    
    def get_object(self, pk):
        try:
            return TaskItem.objects.get(pk=pk)
        except TaskItem.DoesNotExist:
            return Response({"error": "Todo item not found."}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk=None):
        board_id = request.query_params.get('board_id', None)
        
        if pk:
            try:
                task = TaskItem.objects.get(pk=pk)
                serializer = TaskItemSerializer(task)
            except TaskItem.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            if board_id is not None:
                tasks = TaskItem.objects.filter(board_id=board_id)
            else:
                tasks = TaskItem.objects.all()
            serializer = TaskItemSerializer(tasks, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = TaskItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      
    def put(self, request, pk):
        snippet = self.get_object(pk)
        serializer = TaskItemSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, pk):
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

    def get(self, request):
        task_id = request.query_params.get('task_id', None)

        if task_id is not None:
            subtasks = SubtaskItem.objects.filter(task_id=task_id)
        else:
            subtasks = SubtaskItem.objects.all()

        serializer = SubtaskItemSerializer(subtasks, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = SubtaskItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        snippet = self.get_object(pk)
        serializer = SubtaskItemSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, pk):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)