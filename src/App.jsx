import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Tshirts from "./pages/Tshirts";
import Caps from "./pages/Caps";
import Jackets from "./pages/Jackets";
import Bottoms from "./pages/Bottoms";
import Accessories from "./pages/Accessories";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ProductManagement from "./pages/ProductManagement";
import UserManagement from "./pages/UserManagement";
import OrderManagement from "./pages/OrderManagement";
import NotFound from "./pages/NotFound";
import ViewCartButton from "./components/ViewCartButton";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/tshirts" element={<Tshirts />} />
        <Route path="/categories/caps" element={<Caps />} />
        <Route path="/categories/jackets" element={<Jackets />} />
        <Route path="/categories/bottoms" element={<Bottoms />} />
        <Route path="/categories/accessories" element={<Accessories />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderSuccess />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/orders" element={<OrderManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ViewCartButton />
    </Router>
  );
}

export default App;
