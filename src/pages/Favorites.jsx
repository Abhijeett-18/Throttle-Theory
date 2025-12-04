import React from 'react';
import { Link } from 'react-router-dom';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function Favorites() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar2 />

      <div className="max-w-7xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-clash font-bold mb-8">My Favorites</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-clash font-semibold text-gray-700 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start adding products you love to your favorites
            </p>
            <Link
              to="/categories"
              className="inline-block bg-black text-white px-6 py-3 rounded-2xl font-clash font-semibold hover:bg-gray-900 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="flex flex-col">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  img={product.img}
                  to="/product"
                />
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="mt-3 w-full bg-white text-red-500 border border-red-500 px-4 py-2 rounded-lg font-clash font-medium hover:bg-red-50 transition flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
