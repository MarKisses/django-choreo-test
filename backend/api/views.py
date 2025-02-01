from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import serializers
from rest_framework.response import Response


from .serializers import UserSerializer, NoteSerializer
from .models import User, Note


class CreateUserView(generics.CreateAPIView, generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        user = User.objects.get(id=1)
        serializer = UserSerializer(user)
        
        return Response(serializer.data)


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            raise serializers.ValidationError(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def perform_destroy(self, instance):
        instance.delete()
