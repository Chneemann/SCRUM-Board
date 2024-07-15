from django.contrib import admin
from tasks.models import TaskItem, SubtaskItem

# Register your models here.
admin.site.register(TaskItem)
admin.site.register(SubtaskItem)