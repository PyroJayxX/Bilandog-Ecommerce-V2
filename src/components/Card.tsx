import React from 'react';
import Image from 'next/image';

interface CardProps {
  image: string;
  name: string;
  price: string;
}

const Card: React.FC<CardProps> = ({ image, name, price }) => {
  return (
    <div className="flex flex-col items-start bg-[#481401] rounded-3xl">
      <Image src={image} alt={name} layout="responsive" width={1} height={1} />
      <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full items-center justify-center p-4">
      <p className="col-span-1 row-span-1 md:truncate" title={name}>{name}</p>
      <button className="col-span-1 row-span-2 ml-auto bg-[#EE9B70] text-[#481401] text-xl text-center rounded-xl w-12 h-12 flex items-center justify-center">+</button>
      <p className="col-span-1 row-span-1">₱{price}</p>
      </div>
    </div>
  );
};

export default Card;