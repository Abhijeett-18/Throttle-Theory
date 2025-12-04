import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { ordersAPI } from "../services/api";

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchOrder();
  }, [id, user]);

  const fetchOrder = async () => {
    try {
      const response = await ordersAPI.getOrderById(id, token);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar2 />
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <div className="text-xl font-medium">Loading order details...</div>
          </div>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar2 />
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Order not found</h2>
            <Link to="/" className="text-blue-600 hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar2 />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Success Message */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-4">Thank you for your order</p>
            <p className="text-sm text-gray-500">
              Order ID: <span className="font-mono font-semibold">{order._id}</span>
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            
            {/* Items */}
            <div className="space-y-4 mb-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="text-gray-700">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
              </p>
              <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment & Status */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h3>
                <p className="text-lg font-semibold capitalize">{order.paymentMethod}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order Status</h3>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 capitalize">
                  {order.orderStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              to="/profile"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-medium transition"
            >
              View All Orders
            </Link>
            <Link
              to="/categories"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-center py-3 rounded-lg font-medium transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
