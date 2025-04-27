# tasks/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Task
from .serializers import TaskSerializer

# Main Task ViewSet for normal users
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.tasks.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

# Admin: Get all users with task count
@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_list_with_task_count(request):
    users = User.objects.all()
    data = []
    for user in users:
        data.append({
            'id': user.id,
            'username': user.username,
            'is_active': user.is_active,
            'is_staff': user.is_staff,
            'task_count': user.tasks.count()
        })
    return Response(data)

# Admin: Delete a specific user
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        if user == request.user:
            return Response({"error": "You cannot delete yourself."}, status=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# Admin: Edit a user's username
@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def edit_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        username = request.data.get('username')
        if username:
            if User.objects.exclude(id=user_id).filter(username=username).exists():
                return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
            user.username = username
            user.save()
            return Response({"message": "User updated successfully"})
        else:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# Admin: Get tasks of a specific user
@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_tasks(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        tasks = user.tasks.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# Admin: Toggle user active status
@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def toggle_user_active_status(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        if user == request.user:
            return Response({"error": "You cannot deactivate yourself."}, status=status.HTTP_400_BAD_REQUEST)
        user.is_active = not user.is_active
        user.save()
        return Response({"message": "User status toggled successfully"})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# Admin: Toggle user admin role
@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def toggle_user_admin_status(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        if user == request.user:
            return Response({"error": "You cannot change your own admin status."}, status=status.HTTP_400_BAD_REQUEST)
        user.is_staff = not user.is_staff
        user.save()
        return Response({"message": "User admin status toggled successfully"})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
