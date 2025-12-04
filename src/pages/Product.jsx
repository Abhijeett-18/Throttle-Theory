import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { productsAPI } from "../services/api";

export default function ProductPage() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getProduct(productId);
      if (response.success) {
        setProduct(response.data);
      } else {
        addToast("Product not found", "error");
        navigate("/categories");
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      addToast("Failed to load product", "error");
      navigate("/categories");
    } finally {
      setLoading(false);
    }
  };

  const images = product ? [product.image1, product.image2] : [];
  const sizes = product?.sizes?.map(s => s.size) || [];

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef(null);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    if (product) {
      setMainImage(product.image1);
      setSelectedSize(product.sizes?.[0]?.size || "");
    }
  }, [product]);

  // Handle touch position updates
  const updateTouchPosition = (e) => {
    if (!imageRef.current) return;
    const touch = e.touches[0];
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
  };

  function handleAddToCart() {
    if (!isAuthenticated) {
      addToast('Please login to add products to cart', 'error');
      return;
    }
    if (!selectedSize) {
      addToast("Please select a size", "error");
      return;
    }
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image1,
      size: selectedSize,
      qty,
    });
    addToast(`Added ${qty} item${qty > 1 ? 's' : ''} to cart`, 'success');
  }

  function handleBuyNow() {
    if (!isAuthenticated) {
      addToast('Please login to add products to cart', 'error');
      return;
    }
    if (!selectedSize) {
      addToast("Please select a size", "error");
      return;
    }
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image1,
      size: selectedSize,
      qty,
    });
    navigate("/cart");
  }

  function handleWishlistToggle() {
    if (!isAuthenticated) {
      addToast('Please login to add products to wishlist', 'error');
      return;
    }
    const wasInWishlist = isInWishlist(product._id);
    toggleWishlist({
      id: product._id,
      name: product.name,
      price: product.price,
      img: product.image1
    });
    addToast(
      wasInWishlist ? 'Removed from favorites' : 'Added to favorites',
      wasInWishlist ? 'info' : 'success'
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Navbar2 />
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl text-gray-600">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar2 />

      <main className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Main grid: 2 columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          
          {/* Left Column: Image Gallery */}
          {/* Adjusted gap and added pl-0 for better alignment to the left */}
          <div className="grid grid-cols-[auto_1fr] gap-8 lg:gap-10"> {/* Increased gap between thumbnails and main image */}
            {/* Thumbnails */}
            <div className="hidden lg:flex flex-col gap-4 pt-1"> {/* pt-1 to visually align with main image top */}
              {images.map((src, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setMainImage(src)}
                  onFocus={() => setMainImage(src)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    mainImage === src ? "border-black" : "border-transparent"
                  } transition-all duration-200`}
                >
                  <img src={src} alt={`${product.name} thumbnail ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="w-full">
              <div
                className="bg-white rounded-2xl overflow-hidden shadow-sm relative cursor-zoom-in touch-none"
                style={{ aspectRatio: "4/5" }}
                onMouseEnter={() => !isTouchDevice.current && setIsZoomed(true)}
                onMouseLeave={() => !isTouchDevice.current && setIsZoomed(false)}
                onMouseMove={(e) => {
                  if (!imageRef.current || isTouchDevice.current) return;
                  const rect = imageRef.current.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setMousePosition({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
                }}
                onTouchStart={(e) => {
                  isTouchDevice.current = true;
                  if (e.touches.length === 1) {
                    setIsZoomed(z => !z);
                    updateTouchPosition(e);
                  }
                }}
                onTouchMove={(e) => {
                  if (isZoomed && e.touches.length === 1) {
                    e.preventDefault();
                    updateTouchPosition(e);
                  }
                }}
                onTouchEnd={() => {
                  // Optional: uncomment to auto-close zoom on touch end
                  // setIsZoomed(false);
                }}
                ref={imageRef}
              >
                <img
                  src={mainImage}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-75 ${
                    isZoomed ? "scale-150" : "scale-100"
                  }`}
                  style={{
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }}
                />
                {isZoomed && isTouchDevice.current && (
                  <button 
                    onClick={() => setIsZoomed(false)}
                    className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
               {/* Mobile Thumbnails */}
              <div className="flex gap-3 mt-4 lg:hidden">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(src)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                      mainImage === src ? "border-black" : "border-transparent"
                    } transition-all duration-200`}
                  >
                    <img src={src} alt={`mobile-thumb-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Product Details */}
          <aside className="lg:pt-1"> {/* Added pt-1 to visually align details with main image top */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-clash text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                  {product.name}
                </h1>
              </div>
              <button
                onClick={handleWishlistToggle}
                className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition flex-shrink-0"
                aria-label="Toggle wishlist"
              >
                <svg
                  className={`w-6 h-6 transition ${
                    isInWishlist(product._id) ? "text-red-500 fill-current" : "text-gray-400"
                  }`}
                  fill={isInWishlist(product._id) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={isInWishlist(product._id) ? 0 : 2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            <p className="mt-4 text-2xl font-semibold">Rs. {product.price}</p>
            <p className="text-sm text-gray-500 mt-1">Shipping calculated at checkout</p>

            {/* Sizes */}
            <div className="mt-6">
              <div className="text-sm text-gray-700 mb-2">Size</div>
              <div className="flex gap-2 items-center flex-wrap">
                {sizes.map((s) => {
                  const sizeObj = product.sizes.find(size => size.size === s);
                  const inStock = sizeObj?.stock > 0;
                  return (
                    <button
                      key={s}
                      onClick={() => inStock && setSelectedSize(s)}
                      disabled={!inStock}
                      className={`w-12 h-10 rounded-md border text-sm font-medium transition-colors ${
                        selectedSize === s
                          ? "bg-black text-white border-black"
                          : inStock
                          ? "bg-white text-gray-800 hover:bg-gray-50 border-gray-300"
                          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
                {/* Moved size guide to better match the screenshot's position */}
                <button 
                  onClick={() => setShowSizeChart(true)}
                  className="ml-auto px-3 py-2 rounded-md border bg-gray-100 text-sm text-gray-600 border-gray-300 hover:bg-gray-200 transition"
                >
                  Size guide
                </button>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border rounded-md overflow-hidden bg-white border-gray-300"> {/* Added border-gray-300 */}
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-lg transition-colors hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="px-5 py-2 font-medium">{qty}</div>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-2 text-lg transition-colors hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 px-6 py-3 bg-white border border-gray-300 rounded-md font-medium transition-colors hover:bg-gray-50"
              >
                Add to Cart
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="mt-4 w-full bg-black text-white px-6 py-3 rounded-md font-semibold transition-opacity hover:opacity-80"
            >
              Buy Now
            </button>

            {/* Description */}
            <section className="mt-8">
              <h3 className="font-clash text-lg font-bold mb-3">Description</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p>{product.description}</p>
                {product.details && product.details.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {product.details.map((item, index) => (
                      <p key={index}>
                        <strong>{item.label}:</strong> {item.value}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSizeChart(false)}
        >
          <div 
            className="relative bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition z-10"
              aria-label="Close size chart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <img 
              src="/sample-size-chart.avif" 
              alt="Size Chart" 
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}