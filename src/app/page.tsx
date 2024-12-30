import Image from "next/image";
import TopNav from "../components/TopNav";
import Hero from "../components/Hero";
import BestSellerGrid from "../components/BestSellerGrid";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-x-hidden"> 
      <TopNav />
      
      <div className="relative flex flex-col w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full grid">
          <Hero />
        </div>
      </div>

      <div className="w-screen h-full bg-white p-8" >
        <div className="flex relative">
          <h1 className="text-4xl font-bold text-center italic font-serif flex-grow">Best Sellers</h1>
          <Image src="/icons/cart_icon.svg" alt="Arrow" width={40} height={40} className="absolute right-10" />
        </div>
        <hr className="border-[#A4A4A4] my-8" />
        <BestSellerGrid />
      </div>
    </div>
  );
}