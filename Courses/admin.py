from django.contrib import admin
from .models import Group, SubGroup, Course

class GroupAdmin(admin.ModelAdmin):
    list_display = ('name',)

class SubGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'group')
    list_filter = ('group',)

class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'group', 'subgroup')
    list_filter = ('group', 'subgroup')

# Register models to the admin site
admin.site.register(Group, GroupAdmin)
admin.site.register(SubGroup, SubGroupAdmin)
admin.site.register(Course, CourseAdmin)
