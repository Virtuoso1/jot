import json
from rest_framework import generics, status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Product,Review, Cart, CartItem, Order, OrderItem
from .serializers import ProductSerializer, ReviewSerializer
from django.shortcuts import get_object_or_404
import requests
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from .utils import get_pesapal_token
import logging
import requests
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

PESAPAL_BASE = "https://pay.pesapal.com/v3"
CONSUMER_KEY = "yILI5XZrO9FY6NagVBQH2LL7M7Ah5Oak"
CONSUMER_SECRET = "flOPF4Z2WyspBP7hE/ehECvcEgk="
@csrf_exempt
def pesapal_ipn(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    try:
        data = json.loads(request.body)
        order_tracking_id = data.get("OrderTrackingId")
        merchant_reference = data.get("OrderMerchantReference")
    except Exception as e:
        return JsonResponse({"error": f"Invalid payload: {str(e)}"}, status=400)

    if not order_tracking_id or not merchant_reference:
        return JsonResponse({"error": "Missing order identifiers"}, status=400)

    # 1. Get token
    token_res = requests.post(
        f"{PESAPAL_BASE}/api/Auth/RequestToken",
        json={"consumer_key": CONSUMER_KEY, "consumer_secret": CONSUMER_SECRET},
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    )
    token = token_res.json().get("token")
    if not token:
        return JsonResponse({"error": "Failed to authenticate with Pesapal"}, status=500)

    # 2. Query payment status
    status_res = requests.get(
        f"{PESAPAL_BASE}/api/Transactions/GetTransactionStatus?orderTrackingId={order_tracking_id}",
        headers={"Authorization": f"Bearer {token}", "Accept": "application/json"},
    )

    try:
        status_json = status_res.json()
    except Exception:
        return JsonResponse({"error": "Invalid status response", "raw": status_res.text}, status=500)

    payment_status = status_json.get("payment_status_description")  # e.g. "COMPLETED", "FAILED"

    # 3. Update your order
    try:
        order = Order.objects.get(id=merchant_reference)
        if payment_status and payment_status.upper() == "COMPLETED":
            order.status = "paid"
            
        elif payment_status and payment_status.upper() in ["FAILED", "CANCELLED"]:
            order.status = "cancelled"
        order.save()
        # You could also handle FAILED / CANCELLED if you like
    except Order.DoesNotExist:
        return JsonResponse({"error": f"Order {merchant_reference} not found"}, status=404)

    return JsonResponse({"message": "IPN processed", "status": payment_status})
@csrf_exempt
def pesapal_test(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)
    try:
        data = json.loads(request.body)
    except Exception as e:
        return JsonResponse({"error": f"Invalid JSON body: {str(e)}"}, status=400)
    
    # 1. Get token
    token_res = requests.post(
        f"{PESAPAL_BASE}/api/Auth/RequestToken",
        json={"consumer_key": CONSUMER_KEY, "consumer_secret": CONSUMER_SECRET},
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    ) 
    try:
        token_json = token_res.json()
    except Exception:
        return JsonResponse({"error": f"Token response not JSON", "raw": token_res.text}, status=500)
    
    token = token_json.get("token")
    if not token:
        return JsonResponse({"error": "Failed to get token"}, status=500)

    # 2. Submit order (hardcoded minimal payload)
    payload = {
        "id": data.get("order_id"),
        "currency": "KES",
        "amount": float(data.get("amount", 1.0)),
        "description": "Test payment",
        "callback_url": "https://justonethoughtjot.com/confirm",
        "notification_id": "11e5b5b9-d391-4cb4-a552-db3cc3ef3548",
        "billing_address": {
            "email_address": data.get("email"),
            "phone_number": data.get("phone"),
            "first_name": "Test",
            "last_name": "User",
            "line_1": "N/A",
            "country_code": "KE",
        },
    }

    order_res = requests.post(
        f"{PESAPAL_BASE}/api/Transactions/SubmitOrderRequest",
        json=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    try:
        return JsonResponse(order_res.json(), safe=False, status=order_res.status_code)
    except Exception:
        return JsonResponse({"error": "Pesapal did not return JSON", "raw": order_res.text},status=order_res.status_code,)
# views.py
@csrf_exempt
def pesapal_callback_api(request):
    merchant_reference = request.GET.get("OrderMerchantReference")
    order_tracking_id = request.GET.get("OrderTrackingId")

    if not merchant_reference or not order_tracking_id:
        return JsonResponse({"status": "error", "message": "Missing reference"}, status=400)

    # 1. Get token
    token_res = requests.post(
        f"{PESAPAL_BASE}/api/Auth/RequestToken",
        json={"consumer_key": CONSUMER_KEY, "consumer_secret": CONSUMER_SECRET},
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    )
    token = token_res.json().get("token")

    # 2. Query status
    status_res = requests.get(
        f"{PESAPAL_BASE}/api/Transactions/GetTransactionStatus?orderTrackingId={order_tracking_id}",
        headers={"Authorization": f"Bearer {token}", "Accept": "application/json"},
    )
    status_json = status_res.json()
    payment_status = status_json.get("payment_status_description", "UNKNOWN")

    # 3. Update order
    try:
        order = Order.objects.get(id=int(merchant_reference))
        if payment_status.upper() == "COMPLETED":
            order.status = "paid"
            order.save()
    except Order.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Order not found"}, status=404)

    return JsonResponse({"status": payment_status.lower(), "message": f"Your payment is {payment_status}"})



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
        prod = item.product
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price,
        )
        if prod.quantity >= item.quantity:
            prod.quantity -= item.quantity
            prod.save()
        else:
            # If stock is not enough, rollback and cancel order
            order.delete()
            return Response({
                "error": f"Not enough stock for {prod.name}. Available: {prod.quantity}"
            }, status=400)

    # Clear cart
    cart.items.all().delete()

    return Response({
        "message": "Order placed successfully",
        "order_id": order.id,
        "total_amount": str(order.total_amount)  # send amount too
    })
@api_view(["GET"])
def featured_products(request):
    featured = Product.objects.filter(is_featured=True)
    serializer = ProductSerializer(featured, many=True, context={"request": request})
    return Response(serializer.data)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_review(request, cart_item_id):
    try:
        cart_item = CartItem.objects.get(id=cart_item_id, cart__user=request.user)
    except CartItem.DoesNotExist:
        return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)
    
    rating = request.data.get("rating")
    comment = request.data.get("comment")
    
    if not rating:
        return Response({"error": "Rating is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    review = Review.objects.create(
            product=cart_item.product,
            user=request.user,
            rating=rating,
            comment=comment
        )
    
    return Response(
            {"message": "Review submitted successfully", "review_id": review.id},
            status=status.HTTP_201_CREATED
        )