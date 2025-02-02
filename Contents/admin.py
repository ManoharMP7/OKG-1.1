from django.contrib import admin
from .models import Subtitle, PDF, Video, Note
from Courses.models import Course

class PDFInline(admin.TabularInline):
    model = PDF
    extra = 1

class VideoInline(admin.TabularInline):
    model = Video
    extra = 1

class NoteInline(admin.TabularInline):
    model = Note
    extra = 1

class SubtitleAdmin(admin.ModelAdmin):
    inlines = [PDFInline, VideoInline, NoteInline]

class SubtitleInline(admin.StackedInline):
    model = Subtitle
    extra = 1

class CourseAdmin(admin.ModelAdmin):
    inlines = [SubtitleInline]

admin.site.unregister(Course)
admin.site.register(Course, CourseAdmin)
admin.site.register(Subtitle, SubtitleAdmin)
