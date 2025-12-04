import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ViewCartButton() {
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || itemCount === 0 || location.pathname === '/cart' || location.pathname === '/checkout') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none">
      <Link
        to="/cart"
        className="block max-w-md mx-auto bg-black text-white px-6 py-3 rounded-2xl font-clash font-semibold text-center shadow-2xl transition-all duration-300 hover:bg-gray-900 hover:scale-105 pointer-events-auto"
      >
        View Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
      </Link>
    </div>
  );
}
