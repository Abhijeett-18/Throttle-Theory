import { useNavigate } from "react-router-dom";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

// SVG component for the trash icon for better styling control
const TrashIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09a2.09 2.09 0 0 0-2.09 2.134v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, total } = useCart();
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();

  const items = cart;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      addToast('Please login to proceed to checkout', 'error');
      return;
    }
    navigate('/checkout');
  };

  const handleRemove = (id, size) => {
    removeFromCart(id, size);
    addToast('Item removed from cart', 'info');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar2 />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-clash font-semibold mb-8">Your Cart</h1>

        {items.length === 0 ? (
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
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <h2 className="text-2xl font-clash font-semibold text-gray-700 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Add some products to get started
            </p>
            <button
              onClick={() => navigate('/categories')}
              className="inline-block bg-black text-white px-6 py-3 rounded-2xl font-clash font-semibold hover:bg-gray-900 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div>
            {/* Headers for the cart table */}
            <div className="hidden md:grid grid-cols-6 gap-4 text-sm text-gray-500 border-b border-gray-300 pb-3 font-medium">
              <div className="col-span-3">Product</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>

            {/* Cart Items List */}
            <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center py-6">
                {/* Product Info */}
                <div className="md:col-span-3 flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm sm:text-base">{item.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">Size: {item.size}</div>
                    <div className="md:hidden text-sm font-semibold text-red-500 mt-1">
                      Rs. {item.price * item.qty}
                    </div>
                  </div>
                </div>
                
                {/* Quantity Selector (subtle white box) */}
                <div className="md:col-span-2 flex justify-between md:justify-center items-center gap-4">
                  <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-white/30">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.qty - 1)}
                      className="px-3 py-1.5 text-gray-700 hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <div className="px-4 py-1.5 font-medium text-gray-800">{item.qty}</div>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.qty + 1)}
                      className="px-3 py-1.5 text-gray-700 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                  <button onClick={() => handleRemove(item.id, item.size)} className="text-gray-400 hover:text-red-500 transition">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Total Price - Desktop only */}
                <div className="hidden md:block text-right font-semibold text-red-500">
                  Rs. {item.price * item.qty}
                </div>
              </div>
            ))}
            </div>

            {/* Continue Shopping Link */}
            <div className="mt-6 border-t border-gray-300 pt-6">
              <button onClick={() => navigate(-1)} className="text-sm font-medium text-gray-700 hover:text-black transition">
                Continue Shopping
              </button>
            </div>

            {/* Subtotal and Checkout Section */}
            <div className="mt-8 flex justify-end">
              <div className="w-full max-w-sm space-y-4">
                <div className="flex justify-between items-center text-lg border-t border-gray-300 pt-4">
                  <span className="font-medium text-gray-800">Subtotal</span>
                  <span className="text-xl font-semibold">Rs. {total}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 rounded-md font-semibold hover:opacity-80 transition"
                >
                  Proceed to Checkout
                </button>
                <p className="text-xs text-center text-gray-500">
                  Shipping calculated at checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}