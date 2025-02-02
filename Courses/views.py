# In your views.py

from django.shortcuts import render
from .models import Course

def courses(request):
    courses = Course.objects.all()
    background_info = "This is some background information."
    return render(request, 'Courses/courses.html', {'courses': courses, 'background_info': background_info})


