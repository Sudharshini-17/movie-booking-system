from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAuthenticatedAndActive(BasePermission):
    """
    Deny inactive users even if a stale JWT still validates.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_active)


class IsStaffOrReadOnly(BasePermission):
    """
    Staff full access; others read-only (useful for reference/list endpoints).
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class IsSelfOrStaff(BasePermission):
    """
    Object-level: user may act on self; staff may act on any user.
    Expects view.get_object() to return a User instance when used with detail routes.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_staff:
            return True
        return getattr(obj, "pk", None) == user.pk
