'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Topnav: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();
    const { openCart, items } = useCart();
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    return (
        <nav 
        className="w-full text-white p-4 md:p-8 lg:p-12 flex justify-start items-center space-x-4 md:space-x-10 lg:space-x-20 text-xs md:text-lg lg:text-xl font-serif" 
        style={{position: 'absolute', top: 0, zIndex: 10, background: 'linear-gradient(to bottom, black, transparent)', userSelect: 'none' }}
        >
            <Image src="/icons/logo.svg" alt="Logo" className="h-10 md:h-12 lg:h-14" width={180} height={120} />
            <Link href="/" className="truncate" title="Home">Home</Link>
            <Link href="/" className="truncate" title="Hotdogs">Hotdogs</Link>
            <Link href="/" className="truncate" title="Contact Us">Contact Us</Link>
            
            <div className="flex ml-auto items-center space-x-4">
                {isLoggedIn ? (
                    <>
                        <button 
                            onClick={openCart}
                            className="flex items-center mr-12"
                        >
                            <span>Your Cart</span>
                            {itemCount > 0 && (
                                <span className="ml-1 bg-[#6C1814] px-2 py-0.5 rounded-full text-sm">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                        <div className="relative group">
                            <button className="truncate" title="Account">
                                Account
                            </button>
                            <div className="absolute text-base right-0 mt-2 w-48 bg-[#1f1f1fbe] text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href="/" className="block px-4 py-2 hover:bg-gray-700">Account Info</Link>
                                <Link href="/" className="block px-4 py-2 hover:bg-gray-700">Purchase History</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-700">Logout</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <Link href="/Login" title="Login">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Topnav;