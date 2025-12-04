import React, { useState, useEffect } from "react";
import Navbar2 from "../components/Navbar2";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { productsAPI } from "../services/api";

export default function Categories() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      const response = await productsAPI.getProducts({ bestSeller: true });
      if (response.success) {
        setBestSellers(response.data); // Show all best sellers
      }
    } catch (error) {
      console.error("Failed to fetch best sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar2 />
      <div className="flex gap-6 md:gap-8 px-4 sm:px-6 md:px-8 py-8 md:py-10 overflow-x-auto scrollbar-hide">
        <div className="flex flex-col items-start min-w-[200px] sm:min-w-[250px]">
          <div className="rounded-2xl overflow-hidden mb-4 w-[200px] sm:w-[250px] h-[280px] sm:h-[360px] bg-white">
            <Link
              to="/categories/tshirts" 
            >
            <img
              src="/15cce72178b45c247738b4eea1a02d71.jpg"
              alt="Tees"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            </Link>
          </div>
          <div>
            <h2 className="font-clash text-black text-2xl font-semibold mb-1">
              Tees
            </h2>
            <span className="mr-2">&#8594;</span>
            <Link
              to="/categories/tshirts"
              className="inline-flex items-center text-black font-clash text-lg font-medium hover:underline"
            >
              <span>Shop all T-Shirts.</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-start min-w-[250px]">
          <div className="rounded-2xl overflow-hidden mb-4 w-[250px] h-[360px] bg-white">
            <Link
              to="/categories/caps"
            >
            <img
              src="/cap.jpg"
              alt="Tops"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 "
            />
            </Link>
          </div>
          <div>
            <h2 className="font-clash text-black text-2xl font-semibold mb-1">
              Caps
            </h2>
            <span className="mr-2">&#8594;</span>
            <Link
              to="/categories/caps"
              className="inline-flex items-center text-black font-clash text-lg font-medium hover:underline"
            >
              <span>Shop all Caps.</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-start min-w-[250px]">
          <div className="rounded-2xl overflow-hidden mb-4 w-[250px] h-[360px] bg-white">
            <Link
              to="/categories/jackets"
            >
            <img
              src="/435b5c6d92848d39668b1f03ec27dd8d.jpg"
              alt="Shirts"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            </Link>
          </div>
          <div>
            <h2 className="font-clash text-black text-2xl font-semibold mb-1">
              Jackets
            </h2>
            <span className="mr-2">&#8594;</span>
            <Link
              to="/categories/jackets"
              className="inline-flex items-center text-black font-clash text-lg font-medium hover:underline"
            >
              <span>Shop all Jackets.</span>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col items-start min-w-[250px]">
          <div className="rounded-2xl overflow-hidden mb-4 w-[250px] h-[360px] bg-white">
            <Link
              to="/categories/bottoms"
            >
            <img
              src="/btms.jpg"
              alt="Hoodies"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 "
            />
            </Link>
          </div>
          <div>
            <h2 className="font-clash text-black text-2xl font-semibold mb-1">
              Bottoms
            </h2>
            <span className="mr-2">&#8594;</span>
            <Link
              to="/categories/bottoms"
              className="inline-flex items-center text-black font-clash text-lg font-medium hover:underline"
            >
              <span>Shop all Bottoms.</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-start min-w-[250px]">
          <div className="rounded-2xl overflow-hidden mb-4 w-[250px] h-[360px] bg-white">
            <Link
              to="/categories/accessories"
            >
            <img
              src="/accsrs.jpg"
              alt="Shirts"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            </Link>
          </div>
          <div>
            <h2 className="font-clash text-black text-2xl font-semibold mb-1">
              Accessories
            </h2>
            <span className="mr-2">&#8594;</span>
            <Link
              to="/categories/accessories"
              className="inline-flex items-center text-black font-clash text-lg font-medium hover:underline"
            >
              <span>Shop all Accessories.</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="bg-[#eaeaea] rounded-t-3xl mt-8 pb-12">
        <div className="px-4 sm:px-6 md:px-8 pt-10">
          <h2 className="font-clash text-2xl sm:text-3xl font-bold text-black mb-2">
            Best Sellers
          </h2>
          <div className="inline-block bg-black text-white rounded-full px-6 py-2 font-clash text-lg font-medium mb-8">
            Most-loved pieces, all in one place.
          </div>
        </div>

        <div className="flex flex-col px-4 sm:px-6 md:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-xl text-gray-600">Loading best sellers...</div>
            </div>
          ) : bestSellers.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-xl text-gray-600">No best sellers yet. Mark products as best sellers from admin dashboard.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  img={product.image1}
                  hoverImg={product.image2}
                  name={product.name}
                  price={`₹${product.price}`}
                  to={`/product?id=${product._id}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
