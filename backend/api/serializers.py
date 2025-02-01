from rest_framework import serializers

from .models import User, Note


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = "__all__"
        extra_kwargs = {
            "author": {"read_only": True},
        }


class UserSerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "name", "password", "notes"]
        extra_kwargs = {
            "password": {
                "write_only": True,
                "style": {"input_type": "password"},
                "required": True,
            },
            # "notes": {"read_only": True, "many": True },
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
