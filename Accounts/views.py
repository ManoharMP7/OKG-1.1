from django.shortcuts import render, redirect

# Create your views here.
def login_view(request):
    # Your view logic here
    return render(request, 'Accounts/login.html')