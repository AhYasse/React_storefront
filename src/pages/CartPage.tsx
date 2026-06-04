import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  // Placeholder cart items
  const cartItems = [
    { id: '1', name: 'Product 1', price: 99.99, quantity: 2 },
    { id: '2', name: 'Product 2', price: 49.99, quantity: 1 },
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
          <div key={item.id} className="flex items-center p-6 border-b last:border-b-0 hover:bg-gray-50 transition">
            <div className="h-24 w-24 bg-gray-200 rounded-xl flex-shrink-0 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image</span>
            </div>
            
            <div className="ml-6 flex-grow">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-blue-600 font-bold text-lg">${item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-lg hover:bg-gray-200 transition">
                <Minus className="w-5 h-5 text-gray-700" />
              </button>
              <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
              <button className="p-2 rounded-lg hover:bg-gray-200 transition">
                <Plus className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <button className="ml-6 text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition">
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        ))}

        <div className="p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-bold text-gray-900">Total:</span>
            <span className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</span>
          </div>
          <div className="flex space-x-4">
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