import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Topnav: React.FC = () => {
    return (
        <nav className="text-white opacity-100 p-16 flex justify-start flex-grow space-x-20 text-2xl font-serif" style={{position: 'relative', top: 0, zIndex: 1000, background: 'linear-gradient(to bottom, black, transparent)' }}>
            <Image src="/icons/logo.svg" alt="Logo" className="ml-28 h-10" width={100} height={100} />
            <Link href="/">Home</Link>
            <Link href="/">Hotdogs</Link>
            <Link href="/">Contact Us</Link>
            <Link href="/">Services</Link>
        </nav>
    )
}

export default Topnav;