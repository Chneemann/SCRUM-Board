from django.db import models
from django.conf import settings
from .class_assets import PRIORITY_CHOICES, STATUS_CHOICES, COLOR_CHOICES

class SubtaskItem(models.Model):
    title = models.CharField(max_length=50,blank=True)
    task_id = models.ForeignKey('TaskItem',on_delete=models.CASCADE,blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,blank=True)
    status = models.BooleanField(default=False)
    
    def __str__(self):
        return f'({self.id}) {self.task_id} - {self.title} - {self.author}'

class TaskItem(models.Model):
    title = models.CharField(max_length=50,blank=True)
    description = models.TextField(max_length=500,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,blank=True)
    assigned = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='assigned_tasks', blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium') 
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='todo')
    color = models.CharField(max_length=10, choices=COLOR_CHOICES, default='todo')
    
    def __str__(self):
        return f'({self.id}) {self.title} - {self.description}'