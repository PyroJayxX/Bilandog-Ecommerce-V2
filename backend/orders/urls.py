from django.urls import path
from .views import CartView, ProductListView, OrderHistoryView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('products/', ProductListView.as_view(), name='products'),
    path('history/', OrderHistoryView.as_view(), name='order_history'),
]