import { ReactNode } from 'react';
import NavBar from '@/components/NavBar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-900 text-white text-center py-6 mt-auto">
        <p>&copy; 2026 ShopHub. All rights reserved.</p>
      </footer>
    </div>
  );
}