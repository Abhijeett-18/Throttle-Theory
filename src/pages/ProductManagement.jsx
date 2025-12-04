import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { productsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function ProductManagement() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image1: "",
    image2: "",
    sizes: [
      { size: "XS", stock: 50 },
      { size: "S", stock: 50 },
      { size: "M", stock: 50 },
      { size: "L", stock: 50 },
      { size: "XL", stock: 50 }
    ],
    bestSeller: false,
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }
    fetchProducts();
  }, [user, navigate, authLoading]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getProducts();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      addToast("Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index].stock = parseInt(value) || 0;
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      sizes: formData.sizes.filter((size) => size.size && size.stock >= 0),
    };

    try {
      let response;
      if (editingProduct) {
        response = await productsAPI.updateProduct(editingProduct._id, productData, token);
      } else {
        response = await productsAPI.createProduct(productData, token);
      }
      
      if (response.success) {
        addToast(editingProduct ? "Product updated successfully!" : "Product added successfully!", "success");
        setShowAddForm(false);
        setEditingProduct(null);
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          image1: "",
          image2: "",
          sizes: [
            { size: "XS", stock: 50 },
            { size: "S", stock: 50 },
            { size: "M", stock: 50 },
            { size: "L", stock: 50 },
            { size: "XL", stock: 50 }
          ],
          bestSeller: false,
        });
        await fetchProducts();
        // Scroll to products list after update
        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      addToast(error.message || "Failed to add product", "error");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image1: product.image1,
      image2: product.image2,
      sizes: product.sizes.length > 0 ? product.sizes : [
        { size: "XS", stock: 50 },
        { size: "S", stock: 50 },
        { size: "M", stock: 50 },
        { size: "L", stock: 50 },
        { size: "XL", stock: 50 }
      ],
      bestSeller: product.bestSeller || false,
    });
    setShowAddForm(true);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setShowAddForm(false);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image1: "",
      image2: "",
      sizes: [
        { size: "XS", stock: 50 },
        { size: "S", stock: 50 },
        { size: "M", stock: 50 },
        { size: "L", stock: 50 },
        { size: "XL", stock: 50 }
      ],
      bestSeller: false,
    });
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await productsAPI.deleteProduct(productId, token);
      if (response.success) {
        addToast("Product deleted successfully!", "success");
        fetchProducts();
      }
    } catch (error) {
      addToast(error.message || "Failed to delete product", "error");
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
            </div>
            <div className="text-center py-8">
              <div className="text-xl">Loading products...</div>
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
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
            <button
              onClick={() => {
                if (showAddForm) {
                  handleCancelEdit();
                } else {
                  setShowAddForm(true);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              {showAddForm ? "Cancel" : "Add New Product"}
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-2xl font-bold mb-6">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="tshirts">T-Shirts</option>
                    <option value="caps">Caps</option>
                    <option value="jackets">Jackets</option>
                    <option value="bottoms">Bottoms</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Image 1 URL</label>
                    <input
                      type="url"
                      name="image1"
                      value={formData.image1}
                      onChange={handleInputChange}
                      required
                      placeholder="First image URL"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image 2 URL</label>
                    <input
                      type="url"
                      name="image2"
                      value={formData.image2}
                      onChange={handleInputChange}
                      required
                      placeholder="Second image URL"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Stock per Size (Default: 50)</label>
                  <div className="grid grid-cols-5 gap-4">
                    {formData.sizes.map((sizeObj, index) => (
                      <div key={index} className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1 font-medium">{sizeObj.size}</label>
                        <input
                          type="number"
                          value={sizeObj.stock}
                          onChange={(e) => handleSizeChange(index, e.target.value)}
                          min="0"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="bestSeller"
                      checked={formData.bestSeller}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Mark as Best Seller</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
                >
                  Add Product
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">All Products ({products.length})</h3>
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
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="outline-none bg-transparent text-sm w-64"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                  <div className="aspect-square bg-gray-100">
                    {product.image1 && (
                      <img
                        src={product.image1}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-lg mb-2 truncate">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-xl font-bold text-blue-600 mb-2">₹{product.price}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.sizes?.map((sizeObj, idx) => (
                        <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {sizeObj.size}: {sizeObj.stock}
                        </span>
                      ))}
                    </div>
                    {product.bestSeller && (
                      <div className="mb-3">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Best Seller</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredProducts.length === 0 && products.length > 0 && (
              <p className="text-center text-gray-500 py-8">No products found matching "{searchQuery}"</p>
            )}
            {products.length === 0 && (
              <p className="text-center text-gray-500 py-8">No products found. Add your first product!</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
