from django.shortcuts import render
from .models import Group, Course

def courses(request):
    groups = Group.objects.all()  # Fetch all groups
    # Attempt to get the "Default" group, and create it if it doesn't exist
    default_group, created = Group.objects.get_or_create(name="Default")

    courses = Course.objects.all()  # Fetch all courses

    # Filter courses that don't belong to any group or subgroup (they will be in the default group)
    default_group_courses = courses.filter(group=None, subgroup=None)
    
    return render(request, 'Courses/courses.html', {
        'groups': groups,
        'default_group_courses': default_group_courses,
        'courses': courses
    })
