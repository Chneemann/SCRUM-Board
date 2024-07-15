from rest_framework import serializers
from tasks.models import TaskItem, SubtaskItem
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User

class TaskItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskItem
        fields = '__all__'
 
class SubtaskItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubtaskItem
        fields = '__all__'