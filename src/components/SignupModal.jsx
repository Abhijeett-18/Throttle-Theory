import React, { useState } from "react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { indianStatesAndDistricts } from "../data/indianStatesDistricts";
import { authAPI } from "../services/api";

export default function SignupModal({ open, onClose }) {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    state: "",
    district: "",
    addressLine: "",
    pincode: ""
  });
  const [errors, setErrors] = useState({ 
    name: "", 
    email: "", 
    password: "",
    state: "",
    district: "",
    addressLine: "",
    pincode: ""
  });
  const { addToast } = useToast();
  const { login } = useAuth();
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If state changes, update districts and reset district
    if (name === "state") {
      setDistricts(indianStatesAndDistricts[value] || []);
      setFormData((prev) => ({ ...prev, state: value, district: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    // Address validation
    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (!formData.district) {
      newErrors.district = "District is required";
    }

    if (!formData.addressLine.trim()) {
      newErrors.addressLine = "Address is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call backend API
    setLoading(true);
    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: {
          state: formData.state,
          district: formData.district,
          addressLine: formData.addressLine,
          pincode: formData.pincode,
        }
      });

      if (response.success) {
        // Use AuthContext to manage auth state
        login(
          {
            id: response.data._id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
          },
          response.data.token
        );

        addToast(`Welcome, ${response.data.name.split(' ')[0]}!`, "success");
        setFormData({ 
          name: "", 
          email: "", 
          password: "",
          state: "",
          district: "",
          addressLine: "",
          pincode: ""
        });
        setErrors({ 
          name: "", 
          email: "", 
          password: "",
          state: "",
          district: "",
          addressLine: "",
          pincode: ""
        });
        setDistricts([]);
        onClose();
      }
    } catch (error) {
      addToast(error.message || "Registration failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto"
      onMouseDown={onClose}
    >
      <div
        className="bg-gray-100 rounded-2xl w-[92%] max-w-md p-8 shadow-2xl my-8"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="text-center font-clash text-xl text-black font-bold mb-6">Sign Up to Continue</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className={`w-full px-3 py-2 rounded-md border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } text-black bg-white text-sm outline-none`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>
            )}
          </div>

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
                } text-black bg-white text-sm outline-none`}
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

          {/* Address Section */}
          <div className="pt-2 border-t border-gray-300">
            <p className="text-sm font-semibold text-gray-700 mb-3">Delivery Address</p>
            
            <div className="space-y-3">
              <div>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md border ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  } text-black bg-white text-sm outline-none`}
                >
                  <option value="">Select State</option>
                  {Object.keys(indianStatesAndDistricts).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.state}</p>
                )}
              </div>

              <div>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!formData.state}
                  className={`w-full px-3 py-2 rounded-md border ${
                    errors.district ? "border-red-500" : "border-gray-300"
                  } text-black bg-white text-sm outline-none ${
                    !formData.state ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.district}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  placeholder="Street Address, House No, Landmark"
                  className={`w-full px-3 py-2 rounded-md border ${
                    errors.addressLine ? "border-red-500" : "border-gray-300"
                  } text-black bg-white text-sm outline-none`}
                />
                {errors.addressLine && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.addressLine}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode (6 digits)"
                  maxLength="6"
                  className={`w-full px-3 py-2 rounded-md border ${
                    errors.pincode ? "border-red-500" : "border-gray-300"
                  } text-black bg-white text-sm outline-none`}
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.pincode}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
