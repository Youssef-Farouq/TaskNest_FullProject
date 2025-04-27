from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TaskViewSet,
    user_list_with_task_count,
    toggle_user_active_status,
    toggle_user_admin_status,
    delete_user,
    edit_user,
    user_tasks
)

router = DefaultRouter()
router.register('tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
    path('users/', user_list_with_task_count),
    path('users/<int:user_id>/toggle-active/', toggle_user_active_status),
    path('users/<int:user_id>/toggle-admin/', toggle_user_admin_status),
    path('users/<int:user_id>/delete/', delete_user),
    path('users/<int:user_id>/edit/', edit_user),
    path('users/<int:user_id>/tasks/', user_tasks),
]
