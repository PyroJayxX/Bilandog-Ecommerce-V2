from django.urls import path
from .views import CartView, ProductListView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('products/', ProductListView.as_view(), name='products')

]