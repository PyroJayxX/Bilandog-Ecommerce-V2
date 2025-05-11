from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

class RegisterView(APIView):
    permission_classes = []
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    permission_classes = []
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                "access": str(refresh.access_token),  # Access token
                "refresh": str(refresh),              # Refresh token
                "user_id": user.id
            }, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({"message": "User logged out successfully"}, status=status.HTTP_200_OK)
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = RegisterSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        user = request.user
        data = request.data
        current_password = data.get('current_password')
        
        # Verify current password
        if not authenticate(username=user.username, password=current_password):
            return Response({'current_password': 'Current password is incorrect'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Update basic fields
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.address = data.get('address', user.address)
        user.contact = data.get('contact', user.contact)
        
        # Update password if provided
        new_password = data.get('new_password')
        if new_password:
            user.set_password(new_password)
        
        # Save changes
        try:
            user.save()
            return Response({'message': 'Profile updated successfully'}, 
                           status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, 
                           status=status.HTTP_400_BAD_REQUEST)
