from rest_framework import serializers
from boards.models import BoardItem

class BoardItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardItem
        fields = '__all__'