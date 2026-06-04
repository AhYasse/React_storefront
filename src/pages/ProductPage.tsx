import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Product Image */}
          <div className="h-96 bg-gray-200 rounded-xl flex items-center justify-center">
            <span className="text-gray-400 text-lg">Product Image</span>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Product {id}
              </h1>
              <p className="text-3xl font-bold text-blue-600 mb-6">$99.99</p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <span className="font-semibold mr-2">Category:</span> Electronics
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-semibold mr-2">Availability:</span>
                  <span className="text-green-600">In Stock</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition text-lg">
                Add to Cart
              </button>
              <Link 
                to="/cart"
                className="block w-full bg-gray-200 text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-300 transition text-lg text-center"
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