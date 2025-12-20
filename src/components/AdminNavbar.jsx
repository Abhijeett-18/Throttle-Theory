import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully", "success");
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
            <button 
              onClick={() => navigate("/admin")}
              className="text-lg sm:text-xl md:text-2xl font-bold hover:text-gray-300 transition"
            >
              Admin Dashboard
            </button>
            <div className="hidden lg:flex space-x-4 xl:space-x-6">
              <button 
                onClick={() => navigate("/admin/products")}
                className="hover:text-gray-300 transition text-sm md:text-base"
              >
                Products
              </button>
              <button 
                onClick={() => navigate("/admin/orders")}
                className="hover:text-gray-300 transition text-sm md:text-base"
              >
                Orders
              </button>
              <button 
                onClick={() => navigate("/admin/users")}
                className="hover:text-gray-300 transition text-sm md:text-base"
              >
                Users
              </button>
              <button 
                onClick={() => navigate("/admin")}
                className="hover:text-gray-300 transition text-sm md:text-base"
              >
                Analytics
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs sm:text-sm font-medium">{user?.username || user?.name}</p>
              <p className="text-xs text-gray-400 hidden md:block">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
