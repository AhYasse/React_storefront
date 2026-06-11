import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { updateQuantityOptimistic, removeItemOptimistic } from '@/store/cartSlice';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch = useAppDispatch();
  
  // Read cart items directly from Redux (automatically persisted to localStorage)
  const cartItems = useAppSelector((state) => state.cart.items);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    // The reducer automatically removes the item if newQuantity <= 0
    dispatch(updateQuantityOptimistic({ id, quantity: newQuantity }));
  };

  const handleRemove = (id: string) => {
    dispatch(removeItemOptimistic(id));
    toast.success('Item removed');
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to get started!</p>
        <Link 
          to="/"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {cartItems.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row items-center p-6 border-b last:border-b-0 hover:bg-gray-50 transition">
            <div className="h-24 w-24 bg-gray-200 rounded-xl flex-shrink-0 flex items-center justify-center mb-4 sm:mb-0">
              <span className="text-gray-400 text-sm">Image</span>
            </div>
            
            <div className="sm:ml-6 flex-grow mb-4 sm:mb-0 text-center sm:text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-blue-600 font-bold text-lg">${item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <button 
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                className="p-2 rounded-lg hover:bg-gray-200 transition"
                aria-label="Decrease quantity"
              >
                <Minus className="w-5 h-5 text-gray-700" />
              </button>
              <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
              <button 
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className="p-2 rounded-lg hover:bg-gray-200 transition"
                aria-label="Increase quantity"
              >
                <Plus className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <button 
              onClick={() => handleRemove(item.id)}
              className="sm:ml-6 text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
              aria-label="Remove item"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        ))}

        <div className="p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-bold text-gray-900">Total:</span>
            <span className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/"
              className="flex-1 bg-gray-200 text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-300 transition text-center"
            >
              Continue Shopping
            </Link>
            <Link 
              to="/checkout"
              className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}