from django.http import Http404
from django.db.models import Q
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

    def get(self, request, pk=None, format=None):
        user = request.user 

        if pk:
            try:
                board = BoardItem.objects.get(pk=pk)
                if board.author != user and user not in board.assigned.all():
                    return Response({"error": "Not authorized to view this board."}, status=status.HTTP_403_FORBIDDEN)
                serializer = BoardItemSerializer(board)
            except BoardItem.DoesNotExist:
                return Response({"error": "Board not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            boards = BoardItem.objects.filter(
                Q(author=user) | Q(assigned=user)
            ).distinct()
            serializer = BoardItemSerializer(boards, many=True)

        return Response(serializer.data)