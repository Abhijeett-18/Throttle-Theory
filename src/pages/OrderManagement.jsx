import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ordersAPI } from "../services/api";

export default function OrderManagement() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }
    fetchOrders();
  }, [user, navigate, authLoading]);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAllOrders(token);
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      addToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await ordersAPI.updateOrderStatus(orderId, newStatus, token);
      if (response.success) {
        addToast("Order status updated successfully", "success");
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      addToast(error.message || "Failed to update order status", "error");
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      processing: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Order Management</h2>
            <div className="text-center py-8">
              <div className="text-xl">Loading orders...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Order Management</h2>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="outline-none bg-transparent text-sm flex-1"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono">{order._id.slice(-8)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{order.user?.name || "N/A"}</div>
                            <div className="text-gray-500">{order.user?.email || "N/A"}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ₹{order.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Details Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Order Details</h3>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Order Info */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono font-semibold">{selectedOrder._id}</p>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex gap-3 border-b pb-3">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <div className="text-sm text-gray-700">
                      <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}</p>
                      <p className="mt-1">Phone: {selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>

                  {/* Update Status */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Update Status</h4>
                    <div className="flex gap-2 flex-wrap">
                      {["processing", "confirmed", "shipped", "delivered", "cancelled"].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                          disabled={selectedOrder.orderStatus === status}
                          className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                            selectedOrder.orderStatus === status
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Shipping</span>
                      <span>{selectedOrder.shippingFee === 0 ? "FREE" : `₹${selectedOrder.shippingFee}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
