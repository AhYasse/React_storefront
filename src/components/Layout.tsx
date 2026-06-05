import { Outlet, useNavigation } from 'react-router-dom';
import NavBar from '@/components/NavBar';

export default function Layout() {
  const navigation = useNavigation();
  const isNavigating = navigation.state === 'loading';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      
      {/* Optional: Global loading indicator for route transitions */}
      {isNavigating && (
        <div className="fixed top-16 left-0 w-full h-1 bg-blue-100 z-50">
          <div className="h-full bg-blue-600 animate-progress" />
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Outlet renders the matched child route (Home, Cart, Login, etc.) */}
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white text-center py-6 mt-auto">
        <p>&copy; 2026 ShopHub. All rights reserved.</p>
      </footer>
    </div>
  );
}