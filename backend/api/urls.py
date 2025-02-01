from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import CreateUserView, NoteListCreate, NoteDelete

urlpatterns = [
    path("register/", CreateUserView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("notes/", NoteListCreate.as_view(), name="notes"),
    path("notes/delete/<int:pk>/", NoteDelete.as_view(), name="delete_note"),
]
