"use client";

import { useState, useEffect } from 'react';
import TopNav from '../../components/TopNav';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface OrderItemType {
  id: number;
  product_name: string;
  quantity: number;
  price_at_purchase: number;
}

interface OrderType {
  id: number;
  created_at: string;
  completed_at: string;
  total_price: number;
  order_items: OrderItemType[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function PurchaseHistory() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const { isLoggedIn, getToken } = useAuth();
  const router = useRouter();

  // Check auth first, then load data
  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!isLoggedIn) {
        router.push('/Login');
        return;
      }
      
      setCheckingAuth(false);
    };
    
    checkAuthentication();
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (checkingAuth) return;
    
    const fetchOrderHistory = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) throw new Error('No authentication token found');
        
        const response = await fetch('http://localhost:8000/orders/history/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication expired. Please log in again.');
          }
          throw new Error('Failed to fetch order history');
        }

        const data = await response.json();
        setOrders(data);
      } catch(err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching order history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [checkingAuth, getToken]);

  // Show loading during auth check
  if (checkingAuth) {
    return (
      <div className="flex flex-col min-h-screen bg-[#171717]">
        <div className="h-20">
          <TopNav />
        </div>
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#6C1814] border-r-transparent" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="text-white mt-4">Checking authentication...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Toggle order details expand/collapse
  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };

  return (
    <div className="flex flex-col overflow-x-hidden min-h-screen bg-[#171717]">
      {/* Navigation */}
      <div className="h-20">
        <TopNav />
      </div>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-32 py-24">
        <h1 className="text-3xl font-bold text-white mb-8">Purchase History</h1>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#6C1814] border-r-transparent" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="text-white mt-4">Loading your order history...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900 text-white p-4 rounded-md mb-6">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#1e1e1e] p-8 rounded-md text-center">
            <p className="text-white text-lg">You haven&apos;t placed any orders yet.</p>
            <button 
              onClick={() => router.push('/')}
              className="mt-4 bg-[#6C1814] text-white px-6 py-2 rounded hover:bg-[#d04e17] transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#1e1e1e] rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#2a2a2a] text-white">
                  <th className="py-3 px-4 text-left">Order ID</th>
                  <th className="py-3 px-4 text-left">Date Ordered</th>
                  <th className="py-3 px-4 text-left">Total</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <>
                    <tr 
                      key={order.id} 
                      className="border-b border-[#333] text-white hover:bg-[#2a2a2a] cursor-pointer"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      <td className="py-3 px-4">#{order.id}</td>
                      <td className="py-3 px-4">{formatDate(order.created_at)}</td>
                      <td className="py-3 px-4">₱{order.total_price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          className="bg-[#481401] text-white px-3 py-1 rounded text-sm"
                        >
                          {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr className="bg-[#262626]">
                        <td colSpan={4} className="py-4 px-6">
                          <div className="text-white">
                            <h3 className="font-semibold mb-2">Order Items:</h3>
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-[#333]">
                                  <th className="py-2 px-3 text-left">Product</th>
                                  <th className="py-2 px-3 text-center">Quantity</th>
                                  <th className="py-2 px-3 text-right">Price</th>
                                  <th className="py-2 px-3 text-right">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.order_items.map((item) => (
                                  <tr key={item.id} className="border-b border-[#444]">
                                    <td className="py-2 px-3">{item.product_name}</td>
                                    <td className="py-2 px-3 text-center">{item.quantity}</td>
                                    <td className="py-2 px-3 text-right">₱{item.price_at_purchase.toFixed(2)}</td>
                                    <td className="py-2 px-3 text-right">
                                      ₱{(item.quantity * item.price_at_purchase).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="font-semibold">
                                  <td colSpan={3} className="py-2 px-3 text-right">Order Total:</td>
                                  <td className="py-2 px-3 text-right">₱{order.total_price.toFixed(2)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}