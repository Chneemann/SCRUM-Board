from django.db import models
from django.conf import settings

class SubtaskItem(models.Model):
    title = models.CharField(max_length=50,blank=True)
    task_id = models.ForeignKey('TaskItem',on_delete=models.CASCADE,blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,blank=True)
    
    def __str__(self):
        return f'({self.id}) {self.task_id} - {self.title} - {self.author}'

class TaskItem(models.Model):
    title = models.CharField(max_length=50,blank=True)
    description = models.TextField(max_length=500,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,blank=True)
    assigned = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='assigned_tasks', blank=True)
    priority = models.CharField(max_length=10, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='medium') 
    status = models.CharField(max_length=10, choices=[('todo', 'To-do'), ('dotoday', 'Do today'), ('inprogress', 'In progress'), ('done', 'Done')], default='todo')
    color = models.CharField(max_length=10, choices=[('yellow', 'Yellow'), ('green', 'Green'), ('blue', 'Blue'), ('red', 'Red'), ('orange', 'Orange'), ('purple', 'Purple'), ('magenta', 'Magenta'), ('cyan', 'Cyan')], default='todo')
    
    def __str__(self):
        return f'({self.id}) {self.title} - {self.description}'