import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer = () => {
  return (
    <>
        <hr />
        <div className="w-screen h-auto p-8 xl:my-5 md:mx-10 px-32 bg-[#171717] text-white hidden md:grid grid-cols-3 gap-10 justify-space items-start font-serif">
            <div className="flex flex-col items-start w-full mx-auto">
            <h1 className="text-[#F05A19] text-xl" style={{textShadow: '1px 0px 1px #F05A19'}}> About </h1>
            <Link href="/">About Us</Link>
            <Link href="/">Contact Us</Link>  
            <Link href="/">Store Locator</Link>
            <Link href="/">Allergen Information</Link>
            <Link href="/">Franchising</Link>
            </div>
            <div className="flex flex-col w-full items-start mx-auto">
            <h1 className="text-[#F05A19] text-xl" style={{textShadow: '1px 0px 1px #F05A19'}}> Quick Links </h1>
            <Link href="/">Feedback</Link>
            <Link href="/">Privacy Notice</Link>
            <Link href="/">Terms and Conditions</Link>
            <Link href="/">Corporate Information</Link>
            </div>
            <div className="flex flex-col w-full items-start mx-auto">
            <h1 className="text-[#F05A19] text-xl" style={{textShadow: '1px 0px 1px #F05A19'}}> Connect with Us </h1>
            <div className="md:flex space-x-4">
                <Image src="/icons/icon_twitter.svg" alt="Twitter" width={30} height={30} />
                <Image src="/icons/icon_fb.svg" alt="Facebook" width={30} height={30} />
                <Image src="/icons/icon_ig.svg" alt="Instagram" width={35} height={35} />
                <Image src="/icons/icon_tiktok.svg" alt="Instagram" width={30} height={30} />
            </div>
            <h1>@Bilandog_Corp</h1>
            </div>
        </div>

        <footer className="w-full h-20 bg-[#F05A19] flex justify-center items-center">
            <p className="text-white text-sm font-times">Copyright © 2021 Bilandog Corp. All Rights Reserved.</p>
        </footer>
    </>
  );
}

export default Footer;