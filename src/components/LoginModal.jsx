import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { authAPI, adminAPI } from "../services/api";

export default function LoginModal({ open, onClose, onSwitchToSignup }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("user"); // 'user' or 'admin'
  const { addToast } = useToast();
  const { login } = useAuth();

  if (!open) return null;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call backend API
    setLoading(true);
    try {
      const response = loginType === "admin" 
        ? await adminAPI.login({
            email: formData.email,
            password: formData.password,
          })
        : await authAPI.login({
            email: formData.email,
            password: formData.password,
          });

      if (response.success) {
        // Use AuthContext to manage auth state
        const userData = loginType === "admin"
          ? {
              id: response.data._id,
              username: response.data.username,
              email: response.data.email,
              isAdmin: true,
            }
          : {
              id: response.data._id,
              name: response.data.name,
              email: response.data.email,
              role: response.data.role,
            };

        login(userData, response.data.token);

        const displayName = loginType === "admin" 
          ? response.data.username 
          : response.data.name.split(' ')[0];
        
        addToast(`Welcome back, ${displayName}!`, "success");
        setFormData({ email: "", password: "" });
        setErrors({ email: "", password: "" });
        setLoginType("user");
        onClose();

        // Navigate to admin dashboard if admin login
        if (loginType === "admin") {
          navigate("/admin");
        }
      }
    } catch (error) {
      addToast(error.message || "Login failed. Please check your credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onMouseDown={onClose}
    >
      <div
        className="bg-gray-100 rounded-2xl w-[92%] max-w-md p-8 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="text-center font-clash text-xl text-black font-bold mb-4">Sign In to Continue</h2>

        {/* Login Type Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setLoginType("user")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              loginType === "user"
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            User Login
          </button>
          <button
            type="button"
            onClick={() => setLoginType("admin")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              loginType === "admin"
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`w-full px-3 py-2 rounded-md border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } text-black bg-white text-sm outline-none`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-3 py-2 pr-10 rounded-md border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } bg-white text-black text-sm outline-none`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-center">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>

          {loginType === "user" && (
            <div className="text-center text-sm text-gray-600 mt-2">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: "", password: "" });
                  setErrors({ email: "", password: "" });
                  onClose();
                  onSwitchToSignup && onSwitchToSignup();
                }}
                className="text-black font-semibold underline ml-1"
              >
                create one
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
