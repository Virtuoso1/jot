from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import requests, base64
from rest_framework import status
from products.models import Order  # if your Order is in products.models, import from there
from rest_framework.response import Response
import logging
logger = logging.getLogger(__name__)
# 1. Get Pesapal token
def get_pesapal_token():
    url = "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken"
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    payload = {
            "consumer_key": settings.PESAPAL_CONSUMER_KEY,
            "consumer_secret": settings.PESAPAL_CONSUMER_SECRET,
        }
    
    response = requests.post(url, json=payload, headers=headers)
    print("Pesapal token response:", response.status_code, response.text)
    
    response.raise_for_status()
    return response.json().get("token")


# 2. Checkout -> Pesapal order init
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    try:

        order_id = request.data.get("order_id")
        amount = request.data.get("amount")
        email = request.data.get("email")
        phone = request.data.get("phone_number")

        if not order_id:
            return Response({"error": "Missing order_id"}, status=status.HTTP_400_BAD_REQUEST)

        if amount is None:
            return Response({"error": "Missing amount"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = float(amount)
        except (TypeError, ValueError):
            return Response({"error": "Amount must be a valid number"}, status=status.HTTP_400_BAD_REQUEST)

        if not phone:
            return Response({"error": "Missing phone number"}, status=status.HTTP_400_BAD_REQUEST)

        if not email:
            return Response({"error": "Missing email"}, status=status.HTTP_400_BAD_REQUEST)

        token = get_pesapal_token()

        payload = {
            "id": str(order_id),
            "currency": "KES",
            "amount": str(amount),
            "description": f"Payment for Order {order_id}",
            "callback_url": "http://localhost:3000/checkout/",
            "notification_id": "",  # required from Pesapal dashboard
            "billing_address": {
                "email_address": email,
                "phone_number": phone,
                "first_name": request.user.username,
                "country_code": "KE",
            }
        }

        res = requests.post(
            "https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            },
            json=payload
        )

        try:
            response_data = res.json()  # try parsing JSON
        except ValueError:
            return Response({"error": "Pesapal returned non-JSON", "raw": res.text}, status=500)
        print("Pesapal raw response:", res.status_code, res.text)

        return Response(response_data, status=res.status_code)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
# 3. IPN endpoint (Pesapal calls this after payment)
@csrf_exempt
@api_view(["POST"])
def pesapal_ipn(request):
    """
    Pesapal IPN listener
    """
    try:
        data = request.data
        print("IPN received:", data)

        order_tracking_id = data.get("OrderTrackingId")
        order_merchant_reference = data.get("OrderMerchantReference")
        status = data.get("Status")

        # TODO: Update your Order model accordingly
        order = Order.objects.get(id=order_merchant_reference.replace("ORDER-", ""))
        order.status = status
        order.save()

        return Response({"message": "IPN received"}, status=200)

    except Exception as e:
        print("IPN error:", str(e))
        return Response({"error": str(e)}, status=400)
