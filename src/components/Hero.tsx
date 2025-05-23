import React from 'react';
import Link from 'next/link';

export const Hero: React.FC = () => {
    return (
        <div className = 'flex flex-col grow shrink spacey-3 justify-center md:justify-end items-center md:items-start text-white font-serif text-3xl p-10 sm:text-5xl md:text-6xl md:px-20 xl:p-28 xl:text-7xl' style={{ backgroundImage: "url('/images/hero.png')", backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
            <div className = "flex grow shrink spacey-3 text-xl" style={{ zIndex:0, position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.7)"}}></div>
            <h1 className = "relative z-10" style={{textShadow: "2px 2px 4px rgba(16, 16, 16, 0.8)"}}>Hotdogs anytime,</h1>
            <h1 className = "relative z-10" style={{textShadow: "2px 2px 4px rgba(16, 16, 16, 0.8)"}}>Anywhere you are.</h1>
            <div className="relative z-10 flex items-center gap-4">
            <button className='bg-[#6C1814] text-white text-xl px-3 py-1 my-8 rounded-xl md:text-2xl md:px-6 md:py-2 md:my-16 md:rounded-2xl hover:bg-[#d04e17] hover:text-white font-serif shadow-xl'
                style={{ textShadow: "2px 2px 4px rgba(16, 16, 16, 0.5)" }}>Shop Now</button>
              <Link href="/">
                <h1 className='text-[#FFE2C4] text-xl md:text-2xl font-serif hover:underline'>Learn More</h1>
              </Link>
            </div>
        </div>
    )
}

export default Hero;