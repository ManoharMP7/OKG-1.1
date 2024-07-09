# In your views.py

from django.shortcuts import render
from .models import Course

def courses(request):
    courses = Course.objects.all()
    return render(request, 'Courses/courses.html', {'courses': courses})


