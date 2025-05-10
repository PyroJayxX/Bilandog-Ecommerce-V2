"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

{/* 
  ACKNOWLEDGEMENT: Modal inspired from 
  https://github.com/sonajX/BilanStore/blob/main/app/cart/page.tsx
  by the work of https://github.com/IEMDomain04 
*/}

interface CartItemType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  return (
    <div className="flex items-center p-3 bg-[#2a2a2a] rounded-lg text-white">
      <div className="mr-3 text-2xl">{item.emoji}</div>
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-300">₱{item.price.toFixed(2)} x {item.quantity}</p>
      </div>
      <div className="flex items-center">
        <button 
          className="px-2 py-1 bg-[#481401] text-white rounded-l-md"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="px-3 py-1 bg-[#2D0C01] text-white">{item.quantity}</span>
        <button 
          className="px-2 py-1 bg-[#481401] text-white rounded-r-md"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          +
        </button>
      </div>
      <button 
        className="ml-3 text-red-500 hover:text-red-300"
        onClick={() => onRemove(item.id)}
      >
        <span className="sr-only">Remove</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, checkout, isLoading } = useCart();
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);
  
  // Calculate cart total
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handle checkout process
  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setCheckoutStatus("Processing your order...");
    const result = await checkout();
    
    if (result.success) {
      setCheckoutStatus("Order placed successfully!");
      // Close cart after a delay to show success message
      setTimeout(() => {
        closeCart();
        setCheckoutStatus(null);
      }, 2000);
    } else {
      setCheckoutStatus(result.message || "Checkout failed");
      // Clear error message after delay
      setTimeout(() => {
        setCheckoutStatus(null);
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          
          {/* Cart sidebar */}
          <motion.aside
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#1e1e1e] shadow-2xl z-51 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-[#333333]">
              <h2 className="text-2xl font-bold text-white">Your Cart</h2>
              <button
                className="text-gray-400 hover:text-white text-2xl"
                onClick={closeCart}
                aria-label="Close cart"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <p className="text-center text-lg text-gray-400">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <CartItem 
                        item={item} 
                        onRemove={removeItem}
                        onUpdateQuantity={updateQuantity}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-[#333333] p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-white">Total:</span>
                <span className="text-lg font-bold text-white">₱{total.toFixed(2)}</span>
              </div>
              
              {checkoutStatus && (
                <div className={`text-center mb-3 p-2 rounded ${
                  checkoutStatus.includes('success') 
                    ? 'bg-green-800 text-white' 
                    : 'bg-red-800 text-white'
                }`}>
                  {checkoutStatus}
                </div>
              )}
              
              <button 
                className={`w-full ${isLoading || items.length === 0 
                  ? 'bg-[#6C1814] cursor-not-allowed' 
                  : 'bg-[#6C1814] hover:bg-[#d04e17] cursor-pointer'
                } text-white py-3 rounded transition-colors`}
                onClick={handleCheckout}
                disabled={isLoading || items.length === 0}
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}