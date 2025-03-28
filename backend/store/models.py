from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):  
    address = models.TextField()  
    contact_number = models.CharField(max_length=15)  
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

class Hotdog(models.Model):  
    name = models.CharField(max_length=100)  
    price = models.DecimalField(max_digits=6, decimal_places=2)  
    stock = models.IntegerField()  

    def __str__(self):
        return self.name  

class Order(models.Model):  
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    hotdog = models.ForeignKey(Hotdog, on_delete=models.CASCADE)  
    quantity = models.PositiveIntegerField()  
    order_date = models.DateTimeField(auto_now_add=True)  

    def total_price(self):
        return self.quantity * self.hotdog.price  

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hotdog = models.ForeignKey(Hotdog, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.user.username} - {self.hotdog.name} ({self.quantity})"

    def total_price(self):
        return self.quantity * self.hotdog.price
