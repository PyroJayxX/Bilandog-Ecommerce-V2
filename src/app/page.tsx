import Image from "next/image";
import TopNav from "../components/TopNav";
import Hero from "../components/Hero";
import BestSellerGrid from "../components/BestSellerGrid";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-x-hidden bg-[#171717]"> 
      <div className="relative flex flex-col w-full h-full">
        <TopNav />
        <div className="absolute top-0 left-0 w-full h-full grid">
          <Hero />
        </div>
      </div>

      <div className="w-full h-full p-8 xl:my-5" >
        <div className="flex relative">
          <h1 className="text-4xl xl:text-5xl font-bold text-center italic font-serif flex-grow text-white">Best Sellers</h1>
          <Image src="/icons/cart_icon.svg" alt="Arrow" width={40} height={40} className="m-auto md:absolute md:right-10 filter invert" />
        </div>
        <hr className="border-[#A4A4A4] md:my-8 xl:my-10" />
        <BestSellerGrid />
      </div>
    </div>
  );
}