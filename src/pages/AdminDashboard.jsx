import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { productsAPI, usersAPI, ordersAPI } from "../services/api";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboard() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0
  });

  useEffect(() => {
    if (loading) return;
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }
    fetchStats();
  }, [user, navigate, loading]);

  const fetchStats = async () => {
    try {
      const [productsResponse, usersResponse, ordersResponse] = await Promise.all([
        productsAPI.getProducts(),
        usersAPI.getUsers(token),
        ordersAPI.getAllOrders(token)
      ]);

      if (productsResponse.success) {
        setStats(prev => ({
          ...prev,
          products: productsResponse.data.length
        }));
      }

      if (usersResponse.success) {
        setStats(prev => ({
          ...prev,
          users: usersResponse.data.length
        }));
      }
      
      if (ordersResponse.success) {
        setStats(prev => ({
          ...prev,
          orders: ordersResponse.data.length
        }));
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 md:mb-8">Admin Dashboard</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Product Management Card */}
            <div 
              onClick={() => navigate('/admin/products')}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-blue-600">{stats.products}</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Product Management</h3>
              <p className="text-gray-600 text-sm">Manage all products, add new items, edit details</p>
            </div>

            {/* User Management Card */}
            <div 
              onClick={() => navigate('/admin/users')}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-green-600">{stats.users}</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">User Management</h3>
              <p className="text-gray-600 text-sm">View and manage registered users</p>
            </div>

            {/* Order Management Card */}
            <div 
              onClick={() => navigate('/admin/orders')}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-purple-600">{stats.orders}</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Management</h3>
              <p className="text-gray-600 text-sm">Track and manage customer orders</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
