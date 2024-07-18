from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication
from boards.models import BoardItem
from boards.serializers import  BoardItemSerializer
from django.contrib.auth import get_user_model, authenticate
from rest_framework import status
from rest_framework.response import Response

class BoardItemView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    
    def get_object(self, pk):
        try:
            return BoardItem.objects.get(pk=pk)
        except BoardItem.DoesNotExist:
            return Response({"error": "Todo item not found."}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk=None, format=None):
        if pk:
            try:
              task = BoardItem.objects.get(pk=pk)
              serializer = BoardItemSerializer(task)
            except task.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            tasks = BoardItem.objects.all()
            serializer = BoardItemSerializer(tasks, many=True)
        return Response(serializer.data)
   