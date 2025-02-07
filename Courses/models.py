# models.py

from django.db import models

class Group(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.name

class SubGroup(models.Model):
    name = models.CharField(max_length=200)
    group = models.ForeignKey(Group, related_name='subgroups', on_delete=models.CASCADE)
    description = models.TextField()

    def __str__(self):
        return self.name

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(default="No description available")
    group = models.ForeignKey(Group, related_name='courses', null=True, blank=True, on_delete=models.SET_NULL)
    subgroup = models.ForeignKey(SubGroup, related_name='courses', null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
