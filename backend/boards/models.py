from django.db import models
from django.conf import settings
from django.db import models

class BoardItem(models.Model):
    title = models.CharField(max_length=50,blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,blank=True)
    assigned = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='assigned_board', blank=True)
  
    def __str__(self):
        return f'({self.id}) {self.author}'
