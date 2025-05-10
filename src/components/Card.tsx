import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';

interface CardProps {
  id: number | string;  
  image: string;
  name: string;
  price: string;
  emoji?: string;  // Optional emoji for cart display
}

const Card: React.FC<CardProps> = ({ id, image, name, price, emoji = '🌭' }) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = () => {
    // Convert string ID to number more explicitly
    const numericId = typeof id === 'number' ? id : parseInt(id, 10);
    
    // Parse price to ensure it's a number (remove currency symbols etc)
    const numericPrice = parseFloat(price.replace(/[^\d.-]/g, ''));
    
    addItem({
      id: numericId,
      name,
      price: numericPrice,
      quantity: 1,
      emoji
    });
    
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div className="flex flex-col items-start bg-[#481401] rounded-3xl h-fit w-full shadow-lg transition-transform transform hover:scale-105">
      <Image src={image} alt={name} layout="responsive" width={1} height={1} />
      <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full items-center justify-center p-4">
        <p className="col-span-1 row-span-1 md:truncate text-white" title={name}>{name}</p>
        <button 
          onClick={handleAddToCart}
          className={`col-span-1 row-span-2 ml-auto ${
            isAdding ? 'bg-green-500' : 'bg-[#EE9B70]'
          } text-[#481401] text-xl text-center rounded-xl w-12 h-12 flex items-center justify-center transition-colors`}
          aria-label="Add to cart"
        >
          {isAdding ? '✓' : '+'}
        </button>
        <p className="col-span-1 row-span-1 text-white">₱{price}</p>
      </div>
    </div>
  );
};

export default Card;