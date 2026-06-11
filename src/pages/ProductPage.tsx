import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { addItemAsync } from '@/store/cartSlice';
import { useAppDispatch } from '@/store/store';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    // Create the cart item payload
    const cartItem = {
      id: id || 'unknown',
      name: `Premium Product ${id}`,
      price: 99.99,
      quantity: 1,
    };

    // Dispatch optimistic update
    dispatch(addItemAsync(cartItem));
    
    // Show success notification
    toast.success('Added to cart!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Image */}
          <div className="h-96 md:h-[500px] bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-lg font-medium">Product Image Placeholder</span>
          </div>

          {/* Product Details */}
          <div className="p-8 md:p-12 flex flex-col justify-between">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2 block">Category</span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Premium Product {id}
              </h1>
              <p className="text-3xl font-bold text-gray-900 mb-6">$99.99</p>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                This is a placeholder description for the product. It highlights the key features, 
                benefits, and specifications of the item. Designed for durability and style, 
                it is the perfect addition to your collection.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-gray-600">
                  <span className="font-semibold mr-2 w-24">Category:</span> Electronics
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-semibold mr-2 w-24">Availability:</span>
                  <span className="text-green-600 font-medium">In Stock</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
              <Link 
                to="/cart"
                className="block w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-200 transition text-lg text-center"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}