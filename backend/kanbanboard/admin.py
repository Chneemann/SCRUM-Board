from django.contrib import admin
from kanbanboard.models import TaskItem, SubtaskItem

# Register your models here.
admin.site.register(TaskItem)
admin.site.register(SubtaskItem)