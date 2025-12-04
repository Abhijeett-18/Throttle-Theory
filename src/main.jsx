import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <WishlistProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </WishlistProvider>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
