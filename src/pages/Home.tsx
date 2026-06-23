import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchProducts } from '@/store/productsSlice';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const dispatch = useAppDispatch();
  const { items: products, status, error } = useAppSelector((state) => state.products);

  // Fetch products on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleRetry = () => {
    dispatch(fetchProducts());
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
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 text-sm mt-1">
              {status === 'succeeded' ? `${products.length} products available` : 'Browse our collection'}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {status === 'failed' && (
          <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-2xl border border-red-100">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-red-700 font-medium mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="flex items-center bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {status === 'succeeded' && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No products available at the moment.</p>
          </div>
        )}

        {/* Products Grid - Using ProductCard Component */}
        {status === 'succeeded' && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}