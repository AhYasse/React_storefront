import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import { useAppDispatch } from '@/store/store';
import { addItemOptimistic } from '@/store/cartSlice';
import { CartItem } from '@/types';
import toast from 'react-hot-toast';

// Mock featured products data
const featuredProducts = [
  { 
    id: '1', 
    name: 'Wireless Headphones', 
    price: 99.99, 
    description: 'Premium noise-canceling wireless headphones with 30h battery life.' 
  },
  { 
    id: '2', 
    name: 'Smart Watch Pro', 
    price: 199.99, 
    description: 'Track your fitness, notifications, and health metrics in style.' 
  },
  { 
    id: '3', 
    name: 'Mechanical Keyboard', 
    price: 149.99, 
    description: 'Tactile switches, RGB backlighting, and a premium aluminum build.' 
  },
  { 
    id: '4', 
    name: '4K Webcam', 
    price: 79.99, 
    description: 'Crystal clear video calls with auto-focus and a built-in microphone.' 
  },
];

export default function Home() {
  const dispatch = useAppDispatch();

  const handleAddToCart = (product: typeof featuredProducts[0]) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    };

    // 1. Instantly update Redux state (and localStorage via Persist)
    dispatch(addItemOptimistic(cartItem));
    
    // 2. Show success notification
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-8 md:p-16 text-center shadow-lg">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Welcome to ShopHub
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
        >
          Discover premium products at unbeatable prices. Quality meets affordability.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.3 }}
        >
          <Link 
            to="/cart" 
            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition shadow-md"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            View Your Cart
          </Link>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
            >
              {/* Clickable Image Area */}
              <Link to={`/product/${product.id}`} className="block relative h-48 bg-gray-100 group-hover:bg-gray-200 transition">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400 font-medium">Product Image</span>
                </div>
              </Link>

              {/* Card Content */}
              <div className="p-4 flex flex-col flex-grow">
                {/* Clickable Title */}
                <Link to={`/product/${product.id}`} className="block mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                  {product.description}
                </p>
                
                {/* Price and Add to Cart Button */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <span className="text-xl font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 text-sm font-medium"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}