import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { logout } from '@/store/userSlice';
import toast from 'react-hot-toast';
import SearchField from '@/components/SearchField';

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Read auth state from Redux
  const userState = useAppSelector((state) => state.user);
  const userInfo = userState.userInfo;
  const cartItems = useAppSelector((state) => state.cart.items);
  
  // DEBUG: Log auth state for troubleshooting
  console.log('[NavBar] Auth State:', { hasUser: !!userInfo, userName: userInfo?.name, userEmail: userInfo?.email });
  
  // Calculate total cart quantity
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;
  const linkClass = (path: string) => 
    `transition font-medium ${isActive(path) ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`;

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
            ShopHub
          </Link>
           {/* Search Field */}
          <div className="flex-1 max-w-md mx-8">
            <SearchField/>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={linkClass('/')}>Home</Link>
            
            {/* Cart Icon with Badge */}
            <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {userInfo ? (
              <>
                {/* Welcome Message & Profile Link */}
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">
                    Welcome, <span className="text-blue-600">{userInfo.name}</span>
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition px-3 py-2 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass('/login')}>Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
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
              
              {/* Mobile Cart Link */}
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

              {/* Mobile Auth Section */}
              {userInfo ? (
                <>
                  {/* Profile Link */}
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Welcome, <span className="text-blue-600 font-semibold">{userInfo.name}</span></span>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition font-medium py-2 text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 transition font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-center" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}