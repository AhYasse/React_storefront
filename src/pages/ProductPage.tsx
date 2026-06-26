import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Loader2, 
  AlertCircle, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Package
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchProducts } from '@/store/productsSlice';
import { addItemOptimistic } from '@/store/cartSlice';
import { CartItem } from '@/types';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Read products and loading status from Redux
  const { items: products, status, error } = useAppSelector((state) => state.products);
  
  // Local state for quantity selector
  const [quantity, setQuantity] = useState(1);

  // Find the product in the cached Redux store
  const product = products.find((p) => p.id === id);

  // If the store is empty (e.g., direct URL visit or page refresh), fetch products
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      imageUrl: product.imageUrl,
    };

    dispatch(addItemOptimistic(cartItem));
    toast.success(`Added ${quantity}x ${product.name} to cart!`);
    
    // Optional: Reset quantity after adding
    setQuantity(1); 
  };

  // ==========================================
  // RENDER STATES
  // ==========================================

  // 1. Loading State
  if (status === 'loading' || (status === 'idle' && !product)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium text-lg">Loading product details...</p>
      </div>
    );
  }

  // 2. Error State
  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-red-50 rounded-2xl border border-red-100 p-8 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-800 mb-2">Failed to load product</h2>
        <p className="text-red-600 text-center mb-6">{error || 'An unknown error occurred.'}</p>
        <button
          onClick={() => dispatch(fetchProducts())}
          className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // 3. 404 Not Found State
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Package className="w-24 h-24 text-gray-300 mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          We couldn't find the product you're looking for. It might have been removed or the link is incorrect.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // 4. Success State: Render Product Details
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto"
    >
      {/* Breadcrumb / Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-8 transition font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* Left Column: Product Image */}
          <div className="h-80 md:h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : null}
            
            {/* Fallback Placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <span className="text-gray-400 font-medium text-lg">Product Image</span>
            </div>

            {/* Badge */}
            <div className="absolute top-6 left-6">
              <span className="bg-blue-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                In Stock
              </span>
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="p-8 md:p-12 flex flex-col justify-between">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
                Premium Electronics
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* Rating (Decorative) */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-500 text-sm font-medium">4.0 (128 reviews)</span>
              </div>

              <p className="text-3xl font-bold text-gray-900 mb-6">
                ${product.price.toFixed(2)}
              </p>
              
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {product.description}
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">2-Year Warranty</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <RotateCcw className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">30-Day Returns</span>
                </div>
              </div>
            </div>

            {/* Action Area: Quantity & Add to Cart */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                  <button 
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-200 transition text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900 text-lg">{quantity}</span>
                  <button 
                    onClick={handleIncrement}
                    className="p-3 hover:bg-gray-200 transition text-gray-600"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center text-lg shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <Link 
                  to="/cart"
                  className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-200 transition text-lg text-center flex items-center justify-center"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}