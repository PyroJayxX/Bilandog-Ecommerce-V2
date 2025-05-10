"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import Notif from '../components/Notif';

interface CartItemType {
  id: number;
  name: string;
  quantity: number;
  price: number;
  emoji: string;
}

interface NotificationType {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
}

interface CartContextType {
  items: CartItemType[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItemType) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
  notification: NotificationType;
  showNotification: (type: "success" | "error", title: string, message: string) => void;
  closeNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, getToken } = useAuth();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [notification, setNotification] = useState<NotificationType>({
    isOpen: false,
    type: "error",
    title: "",
    message: ""
  });

  const showNotification = (type: "success" | "error", title: string, message: string) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  // Memoized fetchCartFromServer
  const fetchCartFromServer = useCallback(async () => {
    if (!isLoggedIn) {
      console.log("Not logged in, skipping cart fetch");
      return;
    }

    try {
      setIsLoading(true);
      const token = getToken();

      if (!token) {
        console.log("No auth token available");
        return;
      }

      console.log("Fetching cart with token:", token.substring(0, 10) + "...");

      const response = await fetch('http://localhost:8000/orders/cart/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.cart_items || []);
      } else {
        const errorData = await response.json();
        showNotification("error", "Cart Error", errorData.error || "Failed to load your cart");
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      showNotification("error", "Connection Error", "Could not connect to the server");
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, getToken]);

  // Memoized syncCartWithServer
  const syncCartWithServer = useCallback(async () => {
    if (!isLoggedIn) return;

    try {
      const token = getToken();

      if (!token) {
        console.log("No auth token available");
        return;
      }

      console.log("Sending request with token:", token.substring(0, 10) + "...");

      const response = await fetch('http://localhost:8000/orders/cart/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart_items: items })
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication failed - please log in again');
        } else {
          const errorData = await response.json();
          showNotification("error", "Sync Error", errorData.error || "Failed to save cart changes");
        }
      }
    } catch (error) {
      console.error('Error syncing cart with server:', error);
    }
  }, [isLoggedIn, getToken, items, showNotification]);

  // Memoized queueSyncToServer
  const queueSyncToServer = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      syncCartWithServer();
      syncTimeoutRef.current = null;
    }, 500);
  }, [syncCartWithServer]);

  // Load cart from backend when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      fetchCartFromServer();
    } else {
      setItems([]);
    }
  }, [isLoggedIn, fetchCartFromServer]);

  useEffect(() => {
    if (isLoggedIn && items.length > 0) {
      queueSyncToServer();
    }
  }, [items, isLoggedIn, queueSyncToServer]);

  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (item: CartItemType) => {
    if (!isLoggedIn) {
      showNotification(
        "error",
        "Login Required",
        "Please log in to add items to your cart"
      );
      return;
    }

    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);

      if (existingItem) {
        const newItems = currentItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );

        showNotification(
          "success",
          "Updated Cart",
          `${item.name} quantity updated to ${existingItem.quantity + item.quantity}`
        );

        return newItems;
      } else {
        showNotification("success", "Added to Cart", `${item.name} added to your cart`);
        return [...currentItems, item];
      }
    });

    queueSyncToServer();
  };

  const removeItem = (id: number) => {
    const itemToRemove = items.find(item => item.id === id);

    if (itemToRemove) {
      setItems(currentItems => currentItems.filter(item => item.id !== id));
      showNotification("success", "Removed from Cart", `${itemToRemove.name} removed from your cart`);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    setItems(currentItems => {
      const item = currentItems.find(i => i.id === id);

      if (!item) return currentItems;

      const newItems = currentItems.map(i =>
        i.id === id ? { ...i, quantity } : i
      );

      showNotification(
        "success",
        "Cart Updated",
        `${item.name} quantity updated to ${quantity}`
      );

      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    showNotification("success", "Cart Cleared", "All items have been removed from your cart");
  };

  const checkout = async (): Promise<{ success: boolean; message: string }> => {
    if (!isLoggedIn) {
      showNotification("error", "Checkout Failed", "You must be logged in to checkout");
      return { success: false, message: "You must be logged in to checkout" };
    }

    if (items.length === 0) {
      showNotification("error", "Checkout Failed", "Your cart is empty");
      return { success: false, message: "Your cart is empty" };
    }

    try {
      setIsLoading(true);
      const token = getToken();

      const response = await fetch('http://localhost:8000/orders/checkout/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setItems([]);
        showNotification("success", "Order Placed", "Your order has been placed successfully!");
        return { success: true, message: data.message };
      } else {
        showNotification("error", "Checkout Failed", data.error || "Checkout failed");
        return { success: false, message: data.error || "Checkout failed" };
      }
    } catch {
      const errorMessage = "Network error during checkout";
      showNotification("error", "Connection Error", errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      checkout,
      isLoading,
      notification,
      showNotification,
      closeNotification
    }}>
      {children}
      <Notif
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
