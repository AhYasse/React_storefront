import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';

import { store, persistor } from '@/store/store';
import App from '@/App';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 1. Provider makes the Redux store available to the entire app */}
    <Provider store={store}>
      
      {/* 2. PersistGate delays rendering until the persisted state is retrieved from localStorage */}
      <PersistGate loading={null} persistor={persistor}>
        
        <App />
        
        {/* 3. Global Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1F2937', // Dark gray background
              color: '#fff',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#fff' },
            },
          }} 
        />
        
      </PersistGate>
    </Provider>
  </React.StrictMode>
);