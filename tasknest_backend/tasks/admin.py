from django.contrib import admin
from .models import Task
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'completed', 'priority', 'due_date')
    list_filter = ('completed', 'priority')
    search_fields = ('title', 'description', 'user__username')

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_active', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email')

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
