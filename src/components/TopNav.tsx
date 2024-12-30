import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Topnav: React.FC = () => {
    return (
        <nav className="w-full text-white p-4 md:p-8 lg:p-12 flex justify-start items-center flex-grow flex-shrink space-x-4 md:space-x-10 lg:space-x-20 text-sm md:text-xl lg:text-2xl font-serif" style={{position: 'fixed', top: 0, zIndex: 1000, background: 'linear-gradient(to bottom, black, transparent)', userSelect: 'none' }}>
            <Image src="/icons/logo.svg" alt="Logo" className="h-10 md:h-12 lg:h-14" width={180} height={120} />
            <Link href="/">Home</Link>
            <Link href="/">Hotdogs</Link>
            <Link href="/">Contact Us</Link>
            <Link href="/">Services</Link>
        </nav>
    )
}

export default Topnav;
