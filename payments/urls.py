from django.urls import path
from . import views

urlpatterns = [
    path("initiate/", views.initiate_payment, name="initiate_payment"),
path("ipn/", views.pesapal_ipn, name="pesapal_ipn"),
]
