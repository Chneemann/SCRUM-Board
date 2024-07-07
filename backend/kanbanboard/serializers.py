from rest_framework import serializers
from kanbanboard.models import TaskItem
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class TaskItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskItem
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields =('id', 'first_name', 'last_name',)