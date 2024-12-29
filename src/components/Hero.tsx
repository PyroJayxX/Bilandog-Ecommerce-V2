import React from 'react';
import Link from 'next/link';
export const Hero: React.FC = () => {

    return (
        <div className='flex flex-col w-full h-full p-32 items-start'>
          <div className='flex-grow text-white font-serif text-6xl flex flex-col p-8 justify-center items-center' style={{ textShadow: "2px 2px 4px rgba(16, 16, 16, 0.5)" }}>
            <h1 className='p-2 py-2'> 
              Hotdog <span>anywhere</span>,
            </h1>
            <h1 className='p-2 py-2'> 
              <span>Wherever</span> you are.
            </h1>
          </div>

          <div className='flex justify-center p-7 flex'>
            <button className='bg-[#6C1814] text-white text-xl p-3 m-4 rounded-2xl hover:bg-[#926F10] hover:text-white font-serif shadow-xl' style={{ textShadow: "2px 2px 4px rgba(16, 16, 16, 0.5)" }}>
              <span className="px-6">Shop Now</span>
            </button>
            <Link href='/about' className='p-6 pl-3 font-sans font-light text-normal text-xl text-[#FFE2C4]' style={{ textShadow: "2px 2px 4px rgba(20, 20, 20, 0.5)" }}>
                Learn More
            </Link>
          </div>
        </div>
    )
}

export default Hero;