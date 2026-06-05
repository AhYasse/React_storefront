import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
       <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1F2937', // gray-800
              color: '#fff',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#10B981', // green-500
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444', // red-500
                secondary: '#fff',
              },
            },
            loading: {
              iconTheme: {
                primary: '#3B82F6', // blue-500
                secondary: '#fff',
              },
            },
          }} 
        />
  </React.StrictMode>
);