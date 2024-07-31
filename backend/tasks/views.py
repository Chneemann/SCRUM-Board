from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication
from tasks.models import TaskItem, SubtaskItem
from tasks.serializers import  TaskItemSerializer, SubtaskItemSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

class TaskItemView(APIView):
    authentication_classes = [authentication.TokenAuthentication]

    def get_object(self, pk):
        try:
            return TaskItem.objects.get(pk=pk)
        except TaskItem.DoesNotExist:
            raise NotFound({"error": "Todo item not found."})

    def get(self, request, pk=None):
        if pk:
            return self.get_task_item(pk)
        return self.get_task_items(request.query_params.get('board_id'))

    def post(self, request):
        return self.create_task_item(request.data)

    def put(self, request, pk):
        return self.update_task_item(pk, request.data)

    def delete(self, request, pk):
        return self.delete_task_item(pk)

    def get_task_item(self, pk):
        task = self.get_object(pk)
        serializer = TaskItemSerializer(task)
        return Response(serializer.data)

    def get_task_items(self, board_id):
        if board_id:
            tasks = TaskItem.objects.filter(board_id=board_id)
        else:
            tasks = TaskItem.objects.all()
        serializer = TaskItemSerializer(tasks, many=True)
        return Response(serializer.data)

    def create_task_item(self, data):
        serializer = TaskItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update_task_item(self, pk, data):
        task = self.get_object(pk)
        serializer = TaskItemSerializer(task, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete_task_item(self, pk):
        task = self.get_object(pk)
        task.delete()
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
        return self.get_subtasks(task_id)

    def post(self, request):
        return self.create_subtask(request.data)

    def put(self, request, pk):
        return self.update_subtask(pk, request.data)

    def delete(self, request, pk):
        return self.delete_subtask(pk)

    def get_subtasks(self, task_id):
        if task_id:
            subtasks = SubtaskItem.objects.filter(task_id=task_id)
        else:
            subtasks = SubtaskItem.objects.all()
        serializer = SubtaskItemSerializer(subtasks, many=True)
        return Response(serializer.data)

    def create_subtask(self, data):
        serializer = SubtaskItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update_subtask(self, pk, data):
        subtask = self.get_object(pk)
        serializer = SubtaskItemSerializer(subtask, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete_subtask(self, pk):
        subtask = self.get_object(pk)
        subtask.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
