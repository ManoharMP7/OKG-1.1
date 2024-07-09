from django.shortcuts import render


def dev_ops(request):
    return render(request, 'DevOps/devops.html')
