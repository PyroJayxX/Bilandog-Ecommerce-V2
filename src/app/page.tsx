import Image from "next/image";
import TopNav from "../components/TopNav";
import Hero from "../components/Hero";
import BestSellerGrid from "../components/BestSellerGrid";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="w-full h-full overflow-x-hidden bg-[#171717]"> 
      
      <div className="relative flex flex-col w-full h-full">
        <TopNav />
        <div className="w-full h-dvh grid">
          <Hero />
        </div>
      </div>

      <div className="w-full h-full p-8 px-20 xl:my-5">
        <div className="flex relative">
          <h1 className="text-4xl xl:text-5xl font-bold text-center italic font-serif grow text-white">Best Sellers</h1>
          <Image src="/icons/cart_icon.svg" alt="Arrow" width={40} height={40} className="m-auto md:absolute md:right-10 filter invert" />
        </div>
        <hr className="border-[#A4A4A4] my-4 md:my-8 xl:my-10" />
        <BestSellerGrid />
      </div>

      <div>
        <Footer />
      </div>

    </div>
  );
}