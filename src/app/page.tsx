import Image from "next/image";
import TopNav from "../components/TopNav";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-x-hidden"> 
    
      <div className="relative flex flex-col w-full h-full">
        <Image src="/images/hero.png" alt="hero" layout="fill" objectFit="cover" className="filter brightness-50" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col">
          <TopNav />
          <Hero />
        </div>
      </div>

      <div className="w-screen h-full bg-white p-8" >
        <h1 className="text-4xl font-bold text-center">Welcome to our site</h1>
      </div>
    </div>
  );
}