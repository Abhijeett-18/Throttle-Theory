import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold font-clash mb-4">THROTTLE THEORY</h3>
            <p className="text-gray-400 text-sm">
              High-quality clothing at affordable prices
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-gray-300 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-gray-300 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-gray-300 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-gray-300 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h4 className="font-bold text-lg mb-4">SHOP</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/categories/tshirts" className="hover:text-white transition">T-Shirts</Link></li>
              <li><Link to="/categories/caps" className="hover:text-white transition">Caps</Link></li>
              <li><Link to="/categories/jackets" className="hover:text-white transition">Jackets</Link></li>
              <li><Link to="/categories/bottoms" className="hover:text-white transition">Bottoms</Link></li>
              <li><Link to="/categories/accessories" className="hover:text-white transition">Accessories</Link></li>
              <li><Link to="/categories" className="hover:text-white transition">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Trending Section */}
          <div>
            <h4 className="font-bold text-lg mb-4">TRENDING</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/categories/tshirts" className="hover:text-white transition">Oversized T-shirt</Link></li>
              <li><Link to="/categories/tshirts" className="hover:text-white transition">Graphic Tees</Link></li>
              <li><Link to="/categories/jackets" className="hover:text-white transition">Hoodies</Link></li>
              <li><Link to="/categories/bottoms" className="hover:text-white transition">Joggers</Link></li>
              <li><Link to="/categories/caps" className="hover:text-white transition">Snapback Caps</Link></li>
            </ul>
          </div>

          {/* Info Section */}
          <div>
            <h4 className="font-bold text-lg mb-4">INFO</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition">Stores Near Me</a></li>
              <li><a href="#" className="hover:text-white transition">Blogs</a></li>
              <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Returns and Exchange Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Offers and Deals</a></li>
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12 pt-8 border-t border-gray-800">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h5 className="font-semibold mb-1">SHIPPING WITHIN 48 HOURS</h5>
            <p className="text-xs text-gray-400">Your order will be shipped within 48 hours from the time since order is placed!</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 5.5C21 4.12 19.88 3 18.5 3S16 4.12 16 5.5c0 .66.26 1.26.67 1.71L13.5 9.5V8c0-.55-.45-1-1-1h-1V5.5C11.5 4.12 10.38 3 9 3S6.5 4.12 6.5 5.5c0 .66.26 1.26.67 1.71L4 10.38V8c0-.55-.45-1-1-1s-1 .45-1 1v13c0 .55.45 1 1 1s1-.45 1-1v-2.38l3.17-3.17c.45.41 1.05.67 1.71.67C10.26 16.12 11.38 15 11.38 13.62c0-.66-.26-1.26-.67-1.71L13.88 9.5H12.5c-.55 0-1 .45-1 1v1.5l-3.17 3.17c-.45-.41-1.05-.67-1.71-.67C5.24 14.5 4.12 15.62 4.12 17c0 .66.26 1.26.67 1.71L2 21.5V20c0-.55-.45-1-1-1s-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1H2.5l2.79-2.79c.45.41 1.05.67 1.71.67C8.38 19.88 9.5 18.76 9.5 17.38c0-.66-.26-1.26-.67-1.71l3.17-3.17V14c0 .55.45 1 1 1h1v1.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5c0-.66-.26-1.26-.67-1.71L21 12.5V14c0 .55.45 1 1 1s1-.45 1-1V8c0-.55-.45-1-1-1s-1 .45-1 1v2.38l-3.17 3.17c-.45-.41-1.05-.67-1.71-.67-1.38 0-2.5 1.12-2.5 2.5 0 .66.26 1.26.67 1.71L11.12 19.5H12.5c.55 0 1-.45 1-1v-1.5l3.17-3.17c.45.41 1.05.67 1.71.67 1.38 0 2.5-1.12 2.5-2.5 0-.66-.26-1.26-.67-1.71L23 7.5V6c0-.55-.45-1-1-1s-1 .45-1 1v1.5l-2.79 2.79c-.45-.41-1.05-.67-1.71-.67-1.38 0-2.5 1.12-2.5 2.5 0 .66.26 1.26.67 1.71L11.5 16.5V15c0-.55-.45-1-1-1h-1v-1.5c0-1.38-1.12-2.5-2.5-2.5s-2.5 1.12-2.5 2.5c0 .66.26 1.26.67 1.71L2 17.5V16c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55.45 1 1 1s1-.45 1-1v-2.38l3.17-3.17c.45.41 1.05.67 1.71.67C8.26 16.12 9.38 15 9.38 13.62c0-.66-.26-1.26-.67-1.71L11.88 9.5H12.5c.55 0 1-.45 1-1v-1.5l3.17-3.17c.45.41 1.05.67 1.71.67C19.76 4.5 20.88 3.38 20.88 2c0-.66-.26-1.26-.67-1.71L23 .5V2c0 .55.45 1 1 1s1-.45 1-1V0h-3c-.55 0-1 .45-1 1s.45 1 1 1h1.5l-2.79 2.79c-.45-.41-1.05-.67-1.71-.67z"/>
              </svg>
            </div>
            <h5 className="font-semibold mb-1">5% OFF || FREE DELIVERY</h5>
            <p className="text-xs text-gray-400">5% OFF on Pre-paid orders.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="currentColor" viewBox="0 0 640 512">
                <path d="M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h16c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z"/>
              </svg>
            </div>
            <h5 className="font-semibold mb-1">MADE IN INDIA</h5>
            <p className="text-xs text-gray-400">Our products are 100% made in India. From raw fabric to the final product!</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h5 className="font-semibold mb-1">LUXURY FASHION MADE ACCESSIBLE</h5>
            <p className="text-xs text-gray-400">High-quality clothing at affordable prices</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; 2025 Throttle Theory. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
