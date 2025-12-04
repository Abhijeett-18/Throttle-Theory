import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useCart } from "../context/CartContext";
import { ordersAPI, paymentAPI } from "../services/api";
import { indianStatesAndDistricts } from "../data/indianStatesDistricts";

export default function Checkout() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { clearCart } = useCart();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [districts, setDistricts] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.addressLine || "",
    city: user?.address?.district || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const hasShownAuthError = useRef(false);

  useEffect(() => {
    if (!user) {
      if (!hasShownAuthError.current) {
        hasShownAuthError.current = true;
        addToast("Please login to checkout", "error");
        navigate("/");
      }
      return;
    }

    // Fetch complete user data from backend
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success && data.data) {
          const userData = data.data;
          const userState = userData.address?.state || "";
          if (userState) {
            setDistricts(indianStatesAndDistricts[userState] || []);
          }
          setShippingAddress({
            fullName: userData.name || "",
            phone: userData.phone || "",
            street: userData.address?.addressLine || "",
            city: userData.address?.district || "",
            state: userState,
            pincode: userData.address?.pincode || ""
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setAddressLoading(false);
      }
    };

    fetchUserData();

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      if (parsedCart.length === 0) {
        addToast("Your cart is empty", "error");
        navigate("/cart");
        return;
      }
      setCart(parsedCart);
    } else {
      navigate("/cart");
    }
  }, [user, token, navigate, addToast]);

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0), 0);
  };

  const calculateShipping = () => {
    return 0; // Free shipping
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "state") {
      setDistricts(indianStatesAndDistricts[value] || []);
      setShippingAddress({
        ...shippingAddress,
        state: value,
        city: "" // Reset city when state changes
      });
    } else {
      setShippingAddress({
        ...shippingAddress,
        [name]: value
      });
    }
  };

  const processUPIPayment = async (orderData) => {
    try {
      // Get Razorpay key
      const keyResponse = await paymentAPI.getRazorpayKey();
      const razorpayKey = keyResponse.key;

      // Create Razorpay order
      const orderResponse = await paymentAPI.createOrder(orderData.total, token);
      const razorpayOrder = orderResponse.data;

      // Razorpay payment options
      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Throttle Theory",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },
        theme: {
          color: "#2563eb"
        },
        handler: async function (response) {
          try {
            // Create the order first
            const createOrderResponse = await ordersAPI.createOrder(orderData, token);
            
            if (createOrderResponse.success) {
              const orderId = createOrderResponse.data._id;
              
              // Verify payment
              const verifyData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId
              };

              const verifyResponse = await paymentAPI.verifyPayment(verifyData, token);

              if (verifyResponse.success) {
                addToast("Payment successful! Order placed.", "success");
                navigate(`/order/${orderId}`);
                setTimeout(() => clearCart(), 100);
              } else {
                addToast("Payment verification failed", "error");
              }
            }
          } catch (error) {
            console.error("Payment handler error:", error);
            addToast(error.message || "Payment processing failed", "error");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            addToast("Payment cancelled", "error");
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("UPI Payment error:", error);
      addToast(error.message || "Failed to initialize payment", "error");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item.id,
          name: item.name,
          image: item.image,
          size: item.size,
          quantity: item.qty,
          price: item.price
        })),
        shippingAddress,
        paymentMethod,
        subtotal: calculateSubtotal(),
        shippingFee: calculateShipping(),
        total: calculateTotal()
      };

      if (paymentMethod === "upi") {
        // Process UPI payment through Razorpay
        await processUPIPayment(orderData);
      } else {
        // Process COD order
        const response = await ordersAPI.createOrder(orderData, token);
        
        if (response.success) {
          addToast("Order placed successfully!", "success");
          navigate(`/order/${response.data._id}`);
          setTimeout(() => clearCart(), 100);
        }
        setLoading(false);
      }
    } catch (error) {
      addToast(error.message || "Failed to place order", "error");
      setLoading(false);
    }
  };

  if (cart.length === 0 && !loading) {
    return null;
  }

  return (
    <>
      <Navbar2 hideCart={true} />
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg font-medium">Placing your order...</p>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Shipping & Payment Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-4">Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{10}"
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Street Address</label>
                      <input
                        type="text"
                        name="street"
                        value={shippingAddress.street}
                        onChange={handleInputChange}
                        required
                        placeholder="House no., Building name, Street"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">District</label>
                      <select
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        required
                        disabled={!shippingAddress.state}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Select District</option>
                        {districts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State</label>
                      <select
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="">Select State</option>
                        {Object.keys(indianStatesAndDistricts).map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingAddress.pincode}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{6}"
                        placeholder="6-digit pincode"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 font-medium">Cash on Delivery</span>
                    </label>
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 font-medium">UPI Payment</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:bg-gray-400"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600">Size: {item.size}</p>
                        <p className="text-xs text-gray-600">Qty: {item.qty}</p>
                      </div>
                      <p className="font-semibold">₹{(Number(item.price) || 0) * (Number(item.qty) || 0)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{calculateSubtotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
