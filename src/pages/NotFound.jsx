import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-clash font-bold text-black mb-4">404</h1>
        <h2 className="text-3xl font-clash font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Link
          to="/"
          className="inline-block bg-black text-white px-8 py-3 rounded-2xl font-clash font-semibold hover:bg-gray-900 transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>
      <Footer />
    </div>
  );
}
