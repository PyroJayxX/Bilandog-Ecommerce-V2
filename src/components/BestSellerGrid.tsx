import React from "react";
import Card from "./Card";

export const BestSellerGrid: React.FC = () => {
  return (
    <div className="w-full min-h-screen text-white grid md:grid-cols-2 lg:grid-cols-3 gap-12 py-5 px-20 items-center">
        <Card image="/images/HDrill.png" price="79" name="Hotdog ni Edrill" />
        <Card image="/images/HDRimoo.png" price="69" name="Hotdog ni Rimoo" />
        <Card image="/images/HDLans.png" price="59" name="Hotdog ni Lans" />
        <Card image="/images/HDRoman.png" price="89" name="Hotdog ni Roman" />
        <Card image="/images/HDJM.png" price="99" name="Hotdog ni JM" />
        <Card image="/images/HDFred.png" price="80" name="Hotdog ni Habla" />
    </div>
  );
};

export default BestSellerGrid;