'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopNav from '../../components/TopNav';
import Footer from '../../components/Footer';
import Image from 'next/image';

// Define the type for a cart item
interface CartItemType {
  id: number;
  name: string;
  quantity: number;
  price: number;
  emoji: string;
}

// Simple CartItem component
const CartItem = ({ item }: { item: CartItemType }) => {
  return (
    <div className="flex items-center p-3 bg-[#2a2a2a] rounded-lg text-white">
      <div className="mr-3 text-2xl">{item.emoji}</div>
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-300">₱{item.price.toFixed(2)} x {item.quantity}</p>
      </div>
      <div className="flex items-center">
        <button className="px-2 py-1 bg-[#481401] text-white rounded-l-md">-</button>
        <span className="px-3 py-1 bg-[#2D0C01] text-white">{item.quantity}</span>
        <button className="px-2 py-1 bg-[#481401] text-white rounded-r-md">+</button>
      </div>
      <button className="ml-3 text-red-500 hover:text-red-300">
        <span className="sr-only">Remove</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

const mockCartItems = [
    { id: 1, name: 'Hotdog ni Edrill', quantity: 2, price: 79, emoji: '🌭' },
    { id: 2, name: 'Hotdog ni Rimoo', quantity: 1, price: 69, emoji: '🌭' },
    { id: 3, name: 'Hotdog ni Lans', quantity: 1, price: 59, emoji: '🌭' }
];

const CartPage = () => {
    const [open, setOpen] = useState(false);
    const total = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="w-full min-h-screen flex flex-col bg-[#171717]">
            <div className="h-20">
                <TopNav />
            </div>
            
            <div className="fixed top-6 right-6 z-40">
                <button 
                    onClick={() => setOpen(true)} 
                    className="bg-[#6C1814] text-white px-4 py-2 rounded hover:bg-[#d04e17]"
                >
                    Open Cart
                </button>
            </div>
            
            <AnimatePresence>
                {open && (
                    <motion.aside
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#1e1e1e] shadow-2xl z-50 flex flex-col"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                    >
                        <div className="flex justify-between items-center p-6 border-b border-[#333333]">
                            <h2 className="text-2xl font-bold text-white">Your Cart</h2>
                            <button
                                className="text-gray-400 hover:text-white text-2xl"
                                onClick={() => setOpen(false)}
                                aria-label="Close cart"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {mockCartItems.length === 0 ? (
                                <p className="text-center text-lg text-gray-400">Your cart is empty 😢</p>
                            ) : (
                                <div className="space-y-4">
                                    {mockCartItems.map((item, idx) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 40 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.08 }}
                                        >
                                            <CartItem item={item} />
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
                            <button className="w-full bg-[#6C1814] text-white py-3 rounded hover:bg-[#d04e17]">
                                Proceed to Checkout
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
            
            <div className="flex-grow flex items-center justify-center py-8">
                <div className="container mx-auto px-4 text-center text-white">
                    <motion.h1
                        className="text-3xl md:text-5xl font-bold mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Your Cart
                    </motion.h1>
                    <div className="text-lg">
                        Click the cart button at the top right to view your items.
                    </div>
                    
                    <div className="mt-12">
                        <Image 
                            src="/images/hotdog-cart.png" 
                            alt="Hotdog cart" 
                            width={400} 
                            height={300}
                            className="mx-auto opacity-70"
                        />
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default CartPage;