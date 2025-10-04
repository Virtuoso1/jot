from django.contrib import admin
from .models import Review, Product, Cart, CartItem,Order, OrderItem

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "created_at")   # columns in list view
    search_fields = ("name", "description")         # search box

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at")   # columns in list view
    search_fields = ("user__username",)      # search box

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("cart", "product", "quantity")   # columns in list view
    search_fields = ("cart__user__username", "product__name")  # search box

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["product", "quantity", "price"]

class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "phone_number", "address", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("user__username", "phone_number", "address")
    inlines = [OrderItemInline]

admin.site.register(Order, OrderAdmin)
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "user", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("product__name", "user__username", "comment")
