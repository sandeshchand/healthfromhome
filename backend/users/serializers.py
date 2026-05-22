from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_patient_family', 'password')
        read_only_fields = ('is_patient_family',)
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['is_patient_family'] = True
        user = User.objects.create_user(**validated_data)
        return user
