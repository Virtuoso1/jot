from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from products import views as product_views


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/products/", include("products.urls")),
    path("api/auth/", include("users.urls")),
    path("api/cart/", product_views.get_cart, name="get_cart"),
    path("api/cart/add/", product_views.add_to_cart, name="add_to_cart"),
    path("api/cart/remove/", product_views.remove_from_cart, name="remove_from_cart"),
    path("api/checkout/", product_views.checkout),
path("api/payments/", include("payments.urls")), 
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
