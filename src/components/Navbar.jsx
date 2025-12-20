import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ hideCart = false }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { wishlist } = useWishlist();
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  useEffect(() => {
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function handleKey(e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);
  return (
    <nav className="px-3 sm:px-4 md:px-6 py-4 md:py-6 text-white flex justify-between items-center sticky top-0 z-50 bg-transparent">
      <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
        {/* FIX: Added py-4 and -my-4 here. 
          This extends the hoverable area of the group, bridging the 
          'mt-4' gap so the menu stays open when you move your mouse to it. 
        */}
        <div
          className="relative py-4 -my-4"
          ref={menuRef}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="nav-menu"
            className="hover:opacity-80 px-2 sm:px-4 md:px-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-list" // Changed class to className
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd" // Changed fill-rule to fillRule
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </button>
          <div
            id="nav-menu"
            role="menu"
            className={`absolute ${open ? "block" : "hidden"} bg-black/90 backdrop-blur-sm mt-4 py-2 px-4 rounded-lg min-w-[160px] z-50`}
          >
            <Link to="/categories/tshirts" onClick={() => setOpen(false)} className="block py-2 hover:text-gray-300 font-clash w-full text-left">
              T-Shirts
            </Link>
            <Link to="/categories/caps" onClick={() => setOpen(false)} className="block py-2 hover:text-gray-300 font-clash w-full text-left">
              Caps
            </Link>
            <Link to="/categories/jackets" onClick={() => setOpen(false)} className="block py-2 hover:text-gray-300 font-clash w-full text-left">
              Jackets
            </Link>
            <Link to="/categories/bottoms" onClick={() => setOpen(false)} className="block py-2 hover:text-gray-300 font-clash w-full text-left">
              Bottoms
            </Link>
            <Link to="/categories/accessories" onClick={() => setOpen(false)} className="block py-2 hover:text-gray-300 font-clash w-full text-left">
              Accessories
            </Link>
          </div>
        </div>
        
      </div>
      <Link to="/categories" className="text-2xl sm:text-3xl md:text-4xl font-bold font-clash hover:opacity-80">Throttle Theory</Link>
        <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
        {isAuthenticated ? (
          <Link to="/profile" className="hover:opacity-80" aria-label="Profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-person"
              viewBox="0 0 16 16"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
            </svg>
          </Link>
        ) : (
          <button
            className="hover:opacity-80"
            onClick={() => setLoginOpen(true)}
            aria-label="Open account"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-person"
              viewBox="0 0 16 16"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
            </svg>
          </button>
        )}
        <Link to="/favorites" className="hover:opacity-80 relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-heart"
            viewBox="0 0 16 16"
          >
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
          </svg>
          {wishlist.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </Link>
        {!hideCart && (
          <Link to="/cart" className="hover:opacity-80 pr-2 sm:pr-4 md:pr-6 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className="bi bi-bag"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        )}
      </div>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToSignup={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
      />

      <SignupModal open={signupOpen} onClose={() => setSignupOpen(false)} />
    </nav>
  );
}