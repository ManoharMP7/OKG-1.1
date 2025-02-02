from django.db import models
from Courses.models import Course
from ckeditor.fields import RichTextField

class Subtitle(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='subtitles')
    title = models.CharField(max_length=200)

    def __str__(self):
        return self.title

class PDF(models.Model):
    subtitle = models.ForeignKey(Subtitle, on_delete=models.CASCADE, related_name='pdfs')
    name = models.CharField(max_length=200, default='Untitled PDF')
    file = models.FileField(upload_to='media/pdfs/')

    def __str__(self):
        return self.name

class Video(models.Model):
    subtitle = models.ForeignKey(Subtitle, on_delete=models.CASCADE, related_name='videos')
    name = models.CharField(max_length=200, default='Untitled Video')
    url = models.URLField(blank=True, null=True)
    file = models.FileField(upload_to='media/videos/', blank=True, null=True)

    def __str__(self):
        return self.name

class Note(models.Model):
    subtitle = models.ForeignKey(Subtitle, on_delete=models.CASCADE, related_name='notes')
    name = models.CharField(max_length=200, default='Untitled Note')
    content = RichTextField()

    def __str__(self):
        return self.name
