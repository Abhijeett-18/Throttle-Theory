const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Auth API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  // Get current user profile
  getProfile: async (token) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Update user profile
  updateProfile: async (token, userData) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
};

// Admin API
export const adminAPI = {
  // Admin login
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  // Create admin (for initial setup)
  create: async (adminData) => {
    const response = await fetch(`${API_URL}/admin/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });
    return handleResponse(response);
  },

  // Get admin profile
  getProfile: async (token) => {
    const response = await fetch(`${API_URL}/admin/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Products API
export const productsAPI = {
  // Get all products with optional filters
  getProducts: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.featured) queryParams.append('featured', 'true');
    if (filters.bestSeller) queryParams.append('bestSeller', 'true');

    const response = await fetch(
      `${API_URL}/products${queryParams.toString() ? `?${queryParams}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return handleResponse(response);
  },

  // Get single product by ID
  getProduct: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // Create product (Admin only)
  createProduct: async (productData, token) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  // Update product (Admin only)
  updateProduct: async (id, productData, token) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  // Delete product (Admin only)
  deleteProduct: async (id, token) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Users API (Admin only)
export const usersAPI = {
  // Get all users
  getUsers: async (token) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Get single user
  getUser: async (id, token) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Delete user
  deleteUser: async (id, token) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Update user role
  updateUserRole: async (id, role, token) => {
    const response = await fetch(`${API_URL}/users/${id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });
    return handleResponse(response);
  },
};

// Orders API
export const ordersAPI = {
  // Create new order
  createOrder: async (orderData, token) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  // Get user's orders
  getMyOrders: async (token) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Get order by ID
  getOrderById: async (id, token) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Get all orders (admin only)
  getAllOrders: async (token) => {
    const response = await fetch(`${API_URL}/orders/admin/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Update order status (admin only)
  updateOrderStatus: async (id, status, token) => {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ orderStatus: status }),
    });
    return handleResponse(response);
  },
};

// Payment API
export const paymentAPI = {
  // Get Razorpay key
  getRazorpayKey: async () => {
    const response = await fetch(`${API_URL}/payment/key`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // Create Razorpay order
  createOrder: async (amount, token) => {
    const response = await fetch(`${API_URL}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });
    return handleResponse(response);
  },

  // Verify payment
  verifyPayment: async (paymentData, token) => {
    const response = await fetch(`${API_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });
    return handleResponse(response);
  },
};
