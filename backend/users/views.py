from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, generics
from users.serializers import UserSerializer, LoginSerializer
from django.contrib.auth import get_user_model, authenticate
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

class LoginView(APIView):
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            email = serializer.data['email']
            password = serializer.data['password']
            user = authenticate(email=email, password=password)

            if user:
                token, created = Token.objects.get_or_create(user=user)
                return Response(token.key, status=status.HTTP_200_OK)
            else:
                content = {'detail':
                           ('Unable to login with provided credentials.')}
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)

        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        
class LogoutView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
  
    def get(self, request, format=None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
      
class RegisterView(APIView):
    def post(self, request):
        serialized = UserSerializer(data=request.data) 
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)
          
          
class AuthView(ObtainAuthToken):
    authentication_classes = [authentication.TokenAuthentication]
  
    def get(self, request, format=None):
        if request.user.is_authenticated:
            return Response(request.user.id, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
      
class UserListView(generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer