import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { updateQuantityOptimistic, removeItemOptimistic } from '@/store/cartSlice';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch = useAppDispatch();
  
  // Read live cart data from Redux (automatically persisted to localStorage)
  const cartItems = useAppSelector((state) => state.cart.items);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 9.99 : 0; // Flat rate shipping
  const total = subtotal + shipping;
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // --- Event Handlers ---

  const handleIncrement = (id: string, currentQty: number) => {
    dispatch(updateQuantityOptimistic({ id, quantity: currentQty + 1 }));
  };

  const handleDecrement = (id: string, currentQty: number) => {
    if (currentQty <= 1) {
      // If quantity is 1, decrementing removes the item entirely
      dispatch(removeItemOptimistic(id));
      toast.success('Item removed');
    } else {
      dispatch(updateQuantityOptimistic({ id, quantity: currentQty - 1 }));
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeItemOptimistic(id));
    toast.success('Item removed from cart');
  };

  // --- Empty State UI ---
  if (cartItems.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center py-20 max-w-md mx-auto"
      >
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/"
          className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Continue Shopping
        </Link>
      </motion.div>
    );
  }

  // --- Main Cart UI ---
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition mr-4">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {cartItems.map((item) => (
              <motion.div 
                key={item.id}
                layout // Smoothly animates layout shifts when items are removed
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                {/* Image Placeholder */}
                <div className="h-24 w-24 sm:h-28 sm:w-28 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                  <span className="text-gray-400 text-xs text-center px-2">Image</span>
                </div>
                
                {/* Item Details */}
                <div className="flex-grow min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-blue-600 font-bold text-lg mt-1">${item.price.toFixed(2)}</p>
                </div>

                {/* Controls & Subtotal */}
                <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                    <button 
                      onClick={() => handleDecrement(item.id, item.quantity)}
                      className="p-2 hover:bg-gray-200 rounded-l-lg transition text-gray-600"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-semibold text-gray-900">{item.quantity}</span>
                    <button 
                      onClick={() => handleIncrement(item.id, item.quantity)}
                      className="p-2 hover:bg-gray-200 rounded-r-lg transition text-gray-600"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Item Subtotal (Hidden on mobile to save space) */}
                  <div className="text-right min-w-[80px] hidden sm:block">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Subtotal</p>
                    <p className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItemCount} items)</span>
                <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Estimate</span>
                <span className="font-medium text-gray-900">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-medium text-sm">Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-6 border border-green-100">
              <Tag className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Promo codes are applied at checkout.</span>
            </div>

            <Link 
              to="/checkout"
              className="block w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition text-center text-lg shadow-lg shadow-blue-600/20"
            >
              Proceed to Checkout
            </Link>
            
            <Link 
              to="/"
              className="block w-full text-center text-gray-600 hover:text-blue-600 font-medium mt-4 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}