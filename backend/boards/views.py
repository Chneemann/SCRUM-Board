from django.http import Http404
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication
from boards.models import BoardItem
from boards.serializers import  BoardItemSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

class BoardItemView(APIView):
    authentication_classes = [authentication.TokenAuthentication]

    def get_object(self, pk):
        try:
            return BoardItem.objects.get(pk=pk)
        except BoardItem.DoesNotExist:
            raise NotFound({"error": "Board not found."})

    def get(self, request, pk=None):
        if pk:
            return self.get_single_board(request.user, pk)
        return self.get_user_boards(request.user)

    def post(self, request):
        return self.create_board_item(request.data)

    def put(self, request, pk):
        return self.update_board_item(pk, request.data)

    def delete(self, request, pk):
        return self.delete_board_item(pk)

    def get_single_board(self, user, pk):
        board = self.get_object(pk)
        if not self.is_authorized_to_view(user, board):
            return Response({"error": "Not authorized to view this board."}, status=status.HTTP_403_FORBIDDEN)
        serializer = BoardItemSerializer(board)
        return Response(serializer.data)

    def get_user_boards(self, user):
        boards = BoardItem.objects.filter(
            Q(author=user) | Q(assigned=user)
        ).distinct()
        serializer = BoardItemSerializer(boards, many=True)
        return Response(serializer.data)

    def create_board_item(self, data):
        serializer = BoardItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update_board_item(self, pk, data):
        board = self.get_object(pk)
        serializer = BoardItemSerializer(board, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete_board_item(self, pk):
        board = self.get_object(pk)
        board.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def is_authorized_to_view(self, user, board):
        return board.author == user or user in board.assigned.all()
