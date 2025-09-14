from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "created_at")   # columns in list view
    search_fields = ("name", "description")         # search box
    list_filter = ("created_at",)                   # sidebar filters
