from rest_framework import generics, status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Product, Cart, CartItem, Order, OrderItem
from .serializers import ProductSerializer, CartSerializer
from django.shortcuts import get_object_or_404
import requests
from django.http import JsonResponse
from django.conf import settings
from .utils import get_pesapal_token
import json
import requests
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

# Public: list & detail
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

# Admin only: create, update, delete
class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]

class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]

class ProductDeleteView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]

def get_user_cart(user):
    """Helper to fetch or create a cart for a user"""
    cart, created = Cart.objects.get_or_create(user=user)
    return cart

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart = get_user_cart(request.user)
    items = cart.items.select_related("product")

    data = [
        {
            "id": item.id,
            "product": {
                "id": item.product.id,
                "name": item.product.name,
                "price": item.product.price,
                "image": item.product.image.url if item.product.image else None,
            },
            "quantity": item.quantity,
            "total_price": item.quantity * item.product.price,
        }
        for item in items
    ]

    return Response({"cart_id": cart.id, "items": data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get("product_id")
    quantity = int(request.data.get("quantity", 1))

    product = get_object_or_404(Product, id=product_id)
    cart = get_user_cart(request.user)

    cart_item, created = CartItem.objects.get_or_create(
        cart=cart, product=product, defaults={"quantity": quantity}
    )

    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    return Response({"message": "Item added to cart"}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    product_id = request.data.get("product_id")

    cart = get_user_cart(request.user)
    try:
        item = CartItem.objects.get(cart=cart, product_id=product_id)
        item.delete()
        return Response({"message": "Item removed"}, status=status.HTTP_200_OK)
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def checkout(request):
    phone = request.data.get("phone_number")
    address = request.data.get("address")

    if not phone or not address:
        return Response({"error": "Phone number and address required"}, status=400)

    try:
        cart = Cart.objects.get(user=request.user)
    except Cart.DoesNotExist:
        return Response({"error": "Cart is empty"}, status=400)

    if not cart.items.exists():
        return Response({"error": "No items in cart"}, status=400)

    total_amount = sum(item.product.price * item.quantity for item in cart.items.all())

    # Create order
    order = Order.objects.create(
        user=request.user,
        phone_number=phone,
        address=address,
        status="pending",
        total_amount=total_amount,
    )

    # Move items from cart to order
    for item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price,
        )

    # Clear cart
    cart.items.all().delete()

    return Response({
        "message": "Order placed successfully",
        "order_id": order.id,
        "total_amount": str(order.total_amount)  # send amount too
    })