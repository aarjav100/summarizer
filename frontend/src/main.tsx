import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { HelmetProvider } from 'react-helmet-async';
import { App } from './App';
import './index.css';

const getPublishableKey = () => {
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const devKey = import.meta.env.VITE_CLERK_DEV_PUBLISHABLE_KEY;
  const prodKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (isLocalhost) {
    if (devKey) return devKey;
    if (prodKey && !prodKey.startsWith('pk_live_')) return prodKey;
    // On localhost, do not send production pk_live_ keys to Clerk to avoid HTTP 400 origin errors
    return "";
  }
  return prodKey || devKey || "";
};

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_DEV_PUBLISHABLE_KEY || import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_bW9kZXJuLXN3aWZ0LTk0LmNsZXJrLmFjY291bnRzLmRldiQ";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </HelmetProvider>
  </React.StrictMode>
);
