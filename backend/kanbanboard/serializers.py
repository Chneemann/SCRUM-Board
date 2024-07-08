from rest_framework import serializers
from kanbanboard.models import TaskItem, SubtaskItem
from django.contrib.auth import get_user_model

class TaskItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskItem
        fields = '__all__'
 
class SubtaskItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubtaskItem
        fields = '__all__'
             
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields =('id', 'first_name', 'last_name',)
    