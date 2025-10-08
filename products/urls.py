from django.urls import path
from .views import (
    ProductListView, ProductDetailView,
    ProductCreateView, ProductUpdateView, ProductDeleteView
)
from . import views

urlpatterns = [
    path("", ProductListView.as_view(), name="product-list"),
    path("<int:pk>/", ProductDetailView.as_view(), name="product-detail"),
    path("create/", ProductCreateView.as_view(), name="product-create"),
    path("<int:pk>/update/", ProductUpdateView.as_view(), name="product-update"),
    path("<int:pk>/delete/", ProductDeleteView.as_view(), name="product-delete"),
    path("cart/<int:cart_item_id>/review/", views.submit_review, name="submit_review"),
    path("featured/", views.featured_products, name="featured_products"),
    path("pesapal/initiate/", views.pesapal_test, name="pesapal_initiate"),
    path("pesapal/ipn/", views.pesapal_ipn, name="pesapal_ipn"),
]
