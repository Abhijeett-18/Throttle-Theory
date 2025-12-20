import React, { useState, useEffect } from "react";
import Navbar2 from "../components/Navbar2";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { productsAPI } from "../services/api";

export default function Accessories() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getProducts({ category: "accessories" });
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar2 />

      {/* Banner */}
      <div className="grid grid-cols-1 h-[300px]">
        <div className="relative w-full h-full flex items-end justify-center">
          <img
            src="/hero.jpg"
            alt="Banner Right"
            className="absolute inset-0 w-full h-[300px] object-cover opacity-80"
          />
          <h1 className="relative mb-6 text-white text-4xl font-bold font-clash bg-black rounded-2xl px-6 py-2">
            Accessories
          </h1>
        </div>
      </div>

      {/* Filter + Search */}
      <div className="flex items-center justify-end px-8 py-6">
        <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm">
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
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none bg-transparent text-sm"
          />
        </div>
      </div>

      {/* Cards Section */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-xl text-gray-600">Loading products...</div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-xl text-gray-600">No accessories found. Add products from admin dashboard.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={`Rs. ${product.price}`}
              img={product.image1}
              hoverImg={product.image2}
              to={`/product?id=${product._id}`}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-end px-8 py-6 gap-4">
        <button className="text-gray-500">Prev</button>
        <button className="text-black font-semibold">Next</button>
      </div>
      <Footer />
    </div>
  );
}
