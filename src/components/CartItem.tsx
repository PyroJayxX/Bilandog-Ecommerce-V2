import { motion } from 'framer-motion';

type CartItemProps = {
    item: {
        id: number;
        name: string;
        quantity: number;
        price: number;
        emoji: string;
    };
};

const CartItem = ({ item }: CartItemProps) => {
    return (
        <motion.div
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
        >
            <div className="flex items-center gap-4">
                <span className="text-3xl">{item.emoji}</span>
                <div>
                    <div className="text-base font-bold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                </div>
            </div>
            <div className="text-right text-gray-900 font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
            </div>
        </motion.div>
    );
};

export default CartItem;