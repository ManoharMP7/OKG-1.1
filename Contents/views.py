from django.shortcuts import render, get_object_or_404
from Courses.models import Course

def contents_list(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    return render(request, 'Contents/contents.html', {'course': course})

# Create your views here.
