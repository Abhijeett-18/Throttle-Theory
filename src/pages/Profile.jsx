import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { authAPI, ordersAPI } from "../services/api";
import { indianStatesAndDistricts } from "../data/indianStatesDistricts";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";

export default function Profile() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("order-history");
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState({
    addressLine: "",
    state: "",
    district: "",
    pincode: ""
  });

  useEffect(() => {
    // Redirect admins to dashboard
    if (user?.isAdmin) {
      navigate("/admin");
      return;
    }

    const fetchUserProfile = async () => {
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await authAPI.getProfile(token);
        if (response.success) {
          setUserProfile(response.data);
          setEditedAddress(response.data.address);
        }
      } catch (error) {
        // User doesn't exist or token is invalid, logout and redirect
        logout();
        addToast("Session expired. Please login again.", "error");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getMyOrders(token);
        if (response.success) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchUserProfile();
    fetchOrders();
  }, [token, navigate, addToast, logout, user]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditedAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setEditedAddress(prev => ({
      ...prev,
      state: selectedState,
      district: ""
    }));
  };

  const handleSaveAddress = async () => {
    if (!editedAddress.addressLine || !editedAddress.state || !editedAddress.district || !editedAddress.pincode) {
      addToast("Please fill all address fields", "error");
      return;
    }

    if (!/^\d{6}$/.test(editedAddress.pincode)) {
      addToast("Pincode must be 6 digits", "error");
      return;
    }

    try {
      const response = await authAPI.updateProfile(token, { address: editedAddress });
      if (response.success) {
        setUserProfile(prev => ({ ...prev, address: editedAddress }));
        setIsEditingAddress(false);
        addToast("Address updated successfully", "success");
      }
    } catch (error) {
      addToast(error.message || "Failed to update address", "error");
    }
  };

  const handleCancelEdit = () => {
    setEditedAddress(userProfile.address);
    setIsEditingAddress(false);
  };

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully", "success");
    navigate("/");
  };

  if (!user) {
    navigate("/");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar2 />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar2 />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="bg-gray-100 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 space-y-2">
              <button
                onClick={() => setActiveTab("order-history")}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                  activeTab === "order-history"
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zM1 4v2h6V4zm8 0v2h6V4zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5z" />
                </svg>
                Order history
              </button>

              <button
                onClick={() => setActiveTab("shipping-address")}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                  activeTab === "shipping-address"
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                </svg>
                Shipping Address
              </button>

              <button
                onClick={() => setActiveTab("account-details")}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                  activeTab === "account-details"
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                </svg>
                Account details
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-gray-700 hover:bg-gray-200 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                  <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                </svg>
                Log out
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {activeTab === "order-history" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold font-clash">Order History</h2>
                    {orders.length > 1 && (
                      <button
                        onClick={() => setShowAllOrders(!showAllOrders)}
                        className="text-sm text-gray-700 hover:text-black underline font-medium"
                      >
                        {showAllOrders ? 'Show Less' : 'View All Orders'}
                      </button>
                    )}
                  </div>
                  {loadingOrders ? (
                    <div className="bg-white rounded-xl p-6 text-center">
                      <p>Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        className="mx-auto mb-4 opacity-30"
                      >
                        <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zM1 4v2h6V4zm8 0v2h6V4zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5z" />
                      </svg>
                      <p className="text-lg font-medium">No orders yet</p>
                      <p className="text-sm mt-2">Start shopping to see your order history here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(showAllOrders ? orders : orders.slice(0, 1)).map((order) => (
                        <div key={order._id} className="bg-white rounded-xl p-6 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Order ID</p>
                              <p className="font-mono font-semibold">{order._id.slice(-8)}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Total</p>
                              <p className="text-xl font-bold">₹{order.total}</p>
                              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.orderStatus}
                              </span>
                            </div>
                          </div>
                          
                          <div className="border-t pt-4 space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex gap-3">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600">
                                    Size: {item.size} | Qty: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-semibold">₹{item.price * item.quantity}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t flex gap-3">
                            <Link
                              to={`/order/${order._id}`}
                              className="flex-1 bg-black text-white text-center py-2 rounded-lg hover:bg-gray-800 transition"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "shipping-address" && (
                <div>
                  <h2 className="text-2xl font-bold font-clash mb-6">Shipping Address</h2>
                  <div className="bg-white rounded-xl p-6">
                    {!isEditingAddress ? (
                      <>
                        <p className="text-sm text-gray-500 mb-3">Default address</p>
                        <div className="space-y-1 mb-6">
                          <p className="font-semibold text-lg">{userProfile?.name}</p>
                          {userProfile?.address && (
                            <>
                              <p className="text-gray-700">{userProfile.address.addressLine}</p>
                              <p className="text-gray-700">
                                {userProfile.address.district}, {userProfile.address.state}
                              </p>
                              <p className="text-gray-700">India</p>
                              <p className="text-gray-700">{userProfile.address.pincode}</p>
                              <p className="text-gray-700 mt-2">{userProfile.email}</p>
                            </>
                          )}
                        </div>
                        <button 
                          onClick={() => setIsEditingAddress(true)}
                          className="text-black underline text-sm hover:no-underline"
                        >
                          Edit address
                        </button>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-500 mb-3">Edit address</p>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="state"
                            value={editedAddress.state}
                            onChange={handleStateChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-black"
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            District <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="district"
                            value={editedAddress.district}
                            onChange={handleAddressChange}
                            disabled={!editedAddress.state}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-black disabled:bg-gray-100"
                          >
                            <option value="">Select District</option>
                            {editedAddress.state &&
                              indianStatesAndDistricts[editedAddress.state]?.map((district) => (
                                <option key={district} value={district}>
                                  {district}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address Line <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="addressLine"
                            value={editedAddress.addressLine}
                            onChange={handleAddressChange}
                            placeholder="House no, Building, Street, Area"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-black"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pincode <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={editedAddress.pincode}
                            onChange={handleAddressChange}
                            placeholder="6 digit pincode"
                            maxLength="6"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-black"
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={handleSaveAddress}
                            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                          >
                            Save Address
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "account-details" && (
                <div>
                  <h2 className="text-2xl font-bold font-clash mb-6">Account Details</h2>
                  <div className="bg-white rounded-xl p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <p className="text-lg text-gray-900">{userProfile?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <p className="text-lg text-gray-900">{userProfile?.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
