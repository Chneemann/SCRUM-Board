from rest_framework import serializers
from kanbanboard.models import TaskItem

class TaskItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskItem
        fields = '__all__'