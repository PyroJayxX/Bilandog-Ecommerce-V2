import React, { useState } from 'react';

'use client';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        { id: 1, name: 'Item 1', price: 10, quantity: 1 },
        { id: 2, name: 'Item 2', price: 20, quantity: 2 },
    ]);

    const handleRemoveItem = (id: number) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const handleQuantityChange = (id: number, quantity: number) => {
        setCartItems(
            cartItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div>
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            <span>{item.name}</span> - ${item.price} x
                            <input
                                type="number"
                                value={item.quantity}
                                min="1"
                                onChange={e =>
                                    handleQuantityChange(item.id, parseInt(e.target.value, 10))
                                }
                            />
                            <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <h2>Total: ${total.toFixed(2)}</h2>
        </div>
    );
};

export default CartPage;