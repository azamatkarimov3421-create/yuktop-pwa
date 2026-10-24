import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';

// Register Service Worker for PWA support
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('YUKTOP PWA ServiceWorker registration successful: ', registration.scope);
      },
      (err) => {
        console.log('YUKTOP PWA ServiceWorker registration failed: ', err);
      }
    );
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
