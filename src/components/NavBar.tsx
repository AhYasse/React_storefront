import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAppSelector } from '@/store/store';

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Read cart state from Redux
  const cartItems = useAppSelector((state) => state.cart.items);
  
  // Calculate total quantity of all items
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;
  const linkClass = (path: string) => 
    `transition font-medium ${isActive(path) ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
            ShopHub
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={linkClass('/')}>Home</Link>
            
            {/* Desktop Cart Icon with Dynamic Badge */}
            <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            <Link to="/login" className={linkClass('/login')}>Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
              Register
            </Link>
          </div>

          <button 
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              
              {/* Mobile Cart Link with Dynamic Badge */}
              <Link to="/cart" className="flex items-center justify-between text-gray-700 hover:text-blue-600 transition font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                </div>
                {totalItems > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link to="/login" className="text-gray-700 hover:text-blue-600 transition font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-center" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}