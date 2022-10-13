from django.shortcuts import render


# Create your views here.

def home_page(request):
    return render(request, 'home/index.html')


def login_view(request):
    return render(request, 'accounts/login.html')