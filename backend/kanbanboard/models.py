from urllib import request
from django.db import models
from django.conf import settings

class TaskItem(models.Model):
    title = models.CharField(max_length=50,blank=True)
    description = models.TextField(max_length=500,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,blank=True)
    status = models.CharField(max_length=15,blank=True)
    color = models.CharField(max_length=15, default='yellow')
    
    def __str__(self):
        return f'({self.id}) {self.title} - {self.description}'

