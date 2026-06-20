import { motion } from 'framer-motion';
import { CreditCard, MapPin, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector } from '@/store/store';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  
  // Get user data from Redux
  const userState = useAppSelector((state) => state.user);
  const userInfo = userState.userInfo;
  
  // Get cart data from Redux
  const cartItems = useAppSelector((state) => state.cart.items);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userInfo) {
      toast.error('Please login to proceed to checkout');
      navigate('/login', { replace: true });
    }
  }, [userInfo, navigate]);

  // If not logged in, don't render checkout page
  if (!userInfo) {
    return null;
  }
  
  // Calculate totals from actual cart items
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 9.99 : 0;
  const total = subtotal + shipping;

  // Redirect to cart if empty
  if (cartItems.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-700 font-medium">Your cart is empty. Add items before checkout.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  const handlePlaceOrder = () => {
    toast.success('Order placed successfully!');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Email address" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <div className="relative mb-4">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" rows={3} placeholder="Full address" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Card number" />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Cart Items List */}
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600 pb-2 border-b border-gray-100">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={handlePlaceOrder}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition mb-3"
            >
              Place Order
            </button>
            <Link to="/cart" className="block text-center text-gray-600 hover:text-gray-900 text-sm">
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}