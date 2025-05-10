from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from decimal import Decimal
from .models import Product, Order, OrderItem


class CartView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get the current cart items for the user"""
        try:
            # Handle multiple incomplete orders if they exist
            incomplete_orders = Order.objects.filter(
                user=request.user, 
                is_completed=False
            )
            
            # Handle case where multiple incomplete orders exist
            if incomplete_orders.count() > 1:
                # Keep only the most recent cart, mark others as completed
                latest_order = incomplete_orders.order_by('-created_at').first()
                incomplete_orders.exclude(id=latest_order.id).update(
                    is_completed=True, 
                    completed_at=timezone.now()
                )
                cart_order = latest_order
            else:
                cart_order = incomplete_orders.first()
                
            # If no cart exists, return empty cart
            if not cart_order:
                return Response({"cart_items": []}, status=status.HTTP_200_OK)
            
            # Get order items with their product details
            order_items = OrderItem.objects.filter(order=cart_order).select_related('product')
            
            # Format cart items for response
            cart_items = []
            for item in order_items:
                cart_items.append({
                    "id": item.product.id,
                    "name": item.product.name,
                    "price": float(item.price_at_purchase),
                    "quantity": item.quantity,
                    "emoji": "🌭"  # Default emoji
                })
            
            return Response({"cart_items": cart_items}, status=status.HTTP_200_OK)
        
        except Exception as e:
            # Log the error for debugging
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """Update the entire cart"""
        try:
            # Get cart items from request
            cart_items = request.data.get('cart_items', [])
            
            # Handle multiple incomplete orders if they exist
            incomplete_orders = Order.objects.filter(
                user=request.user, 
                is_completed=False
            )
            
            # Handle case where multiple incomplete orders exist
            if incomplete_orders.count() > 1:
                # Keep only the most recent cart, mark others as completed
                latest_order = incomplete_orders.order_by('-created_at').first()
                incomplete_orders.exclude(id=latest_order.id).update(
                    is_completed=True, 
                    completed_at=timezone.now()
                )
                cart_order = latest_order
            elif incomplete_orders.exists():
                cart_order = incomplete_orders.first()
            else:
                # Create new order if none exists
                cart_order = Order.objects.create(
                    user=request.user,
                    is_completed=False,
                    total_price=Decimal('0.00')
                )
            
            # Clear existing items before adding new ones
            OrderItem.objects.filter(order=cart_order).delete()
            
            # Add new items and calculate total price
            total_price = Decimal('0.00')
            
            for item in cart_items:
                try:
                    product_id = item.get('id')
                    quantity = item.get('quantity', 1)
                    price = Decimal(str(item.get('price', 0)))
                    
                    # Validate the product exists
                    try:
                        product = Product.objects.get(id=product_id)
                    except Product.DoesNotExist:
                        continue  # Skip items with invalid product IDs
                    
                    # Create the order item
                    OrderItem.objects.create(
                        order=cart_order,
                        product=product,
                        quantity=quantity,
                        price_at_purchase=price
                    )
                    
                    # Add to total price
                    item_total = price * quantity
                    total_price += item_total
                    
                except Exception as item_error:
                    # Log item-specific error but continue processing other items
                    print(f"Error processing cart item: {item_error}")
                    continue
            
            # Update order total
            cart_order.total_price = total_price
            cart_order.save()
            
            return Response({"message": "Cart updated successfully"}, status=status.HTTP_200_OK)
        
        except Exception as e:
            # Log the error for debugging
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ProductListView(APIView):
    permission_classes = [AllowAny]  # Public endpoint - no authentication needed
    
    def get(self, request):
        """Get all available products"""
        try:
            products = Product.objects.all()
            
            # Format products for response
            product_list = []
            for product in products:
                product_list.append({
                    "id": product.id,
                    "name": product.name,
                    "price": float(product.price),
                    "image_file": product.image_file,
                    "description": product.description
                })
            
            return Response(product_list, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)