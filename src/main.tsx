
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { DropDataProvider } from './contexts/DropDataContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DropDataProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </DropDataProvider>
  </React.StrictMode>
);
