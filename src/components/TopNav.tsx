'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

export const Topnav: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();

    const handleLogout = () => {
        logout();
        // Optional: Redirect to home page
        window.location.href = "/";
    };

    return (
        <nav 
        className="w-full text-white p-4 md:p-8 lg:p-12 flex justify-start items-center grow shrink space-x-4 md:space-x-10 lg:space-x-20 text-xs md:text-lg lg:text-xl font-serif" 
        style={{position: 'absolute', top: 0, zIndex: 1000, background: 'linear-gradient(to bottom, black, transparent)', userSelect: 'none' }}
        >
            <Image src="/icons/logo.svg" alt="Logo" className="h-10 md:h-12 lg:h-14" width={180} height={120} />
            <Link href="/" className="truncate" title="Home">Home</Link>
            <Link href="/" className="truncate" title="Hotdogs">Hotdogs</Link>
            <Link href="/" className="truncate" title="Contact Us">Contact Us</Link>
            {isLoggedIn ? (
            <div className="relative ml-auto group">
                <button className="truncate" title="Account">
                    Account
                </button>
                <div className="absolute text-base right-0 mt-2 w-48 bg-[#1f1f1fbe] text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href="/" className="block px-4 py-2 hover:bg-gray-700">Account Info</Link>
                    <Link href="/" className="block px-4 py-2 hover:bg-gray-700">Your Cart</Link>
                    <Link href="/" className="block px-4 py-2 hover:bg-gray-700">Purchase History</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-700">Logout</button>
                </div>
            </div>
            ) : (
            <Link href="/Login" className="truncate ml-auto" title="Login">Login</Link>
            )}
        </nav>
    );
};

export default Topnav;