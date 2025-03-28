from django.contrib import admin
from .models import Hotdog, User, Cart, Order

admin.site.register(Hotdog)
admin.site.register(User)
admin.site.register(Cart)
admin.site.register(Order)