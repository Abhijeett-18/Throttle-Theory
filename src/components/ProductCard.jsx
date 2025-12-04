import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({
  id,
  name,
  price,
  img,
  hoverImg,
  to,
  className = "",
  imgClassName = "w-full aspect-[4/5] object-cover rounded-lg transition-transform duration-300 group-hover:scale-105",
}) {
  const [src, setSrc] = useState(img);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();
  const isFavorite = isInWishlist(id);

  useEffect(() => {
    setSrc(img);
  }, [img]);

  function handleEnter() {
    if (hoverImg) setSrc(hoverImg);
  }

  function handleLeave() {
    setSrc(img);
  }

  function handleWishlistClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      addToast('Please login to add products to wishlist', 'error');
      return;
    }
    const wasInWishlist = isFavorite;
    toggleWishlist({ id, name, price, img });
    addToast(
      wasInWishlist ? 'Removed from favorites' : 'Added to favorites',
      wasInWishlist ? 'info' : 'success'
    );
  }

  const Wrapper = to ? Link : "div";

  const baseWrapperClass =
    "group bg-white rounded-2xl shadow-sm p-4 flex flex-col items-start transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl overflow-hidden relative";

  return (
    <Wrapper
      to={to}
      key={id}
      className={`${baseWrapperClass} ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        onClick={handleWishlistClick}
        className="absolute top-6 right-6 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
      >
        <svg
          className={`w-5 h-5 transition ${
            isFavorite ? "text-red-500 fill-current" : "text-gray-400"
          }`}
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={isFavorite ? 0 : 2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
      <img src={src} alt={name} className={imgClassName} />
      <p className="text-xs text-gray-600 mt-3">{name}</p>
      <p className="text-black font-bold mt-1">{price}</p>
    </Wrapper>
  );
}
