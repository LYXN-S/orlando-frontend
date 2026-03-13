import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInventory from './pages/admin/AdminInventory';
import AdminMovements from './pages/admin/AdminMovements';
import AdminWarehouseSales from './pages/admin/AdminWarehouseSales';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStaffForm from './pages/admin/AdminStaffForm';
import AdminProfile from './pages/admin/AdminProfile';

/** Redirect logged-in customers away from Home to Products */
const CustomerHomeRedirect = () => {
  const { user, isAdmin, isCustomer } = useAuth();
  if (user && isCustomer() && !isAdmin()) {
    return <Navigate to="/products" replace />;
  }
  return <><Navbar /><Home /></>;
};

function App() {
  return (
    <HelmetProvider>
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public / Customer routes with Navbar */}
              <Route path="/" element={<CustomerHomeRedirect />} />
              <Route path="/products" element={<><Navbar /><ProductList /></>} />
              <Route path="/products/:id" element={<><Navbar /><ProductDetail /></>} />
              <Route path="/login" element={<><Navbar /><Login /></>} />
              <Route path="/register" element={<><Navbar /><Register /></>} />
              <Route path="/cart" element={<><Navbar /><ProtectedRoute customerOnly><Cart /></ProtectedRoute></>} />
              <Route path="/checkout" element={<><Navbar /><ProtectedRoute customerOnly><Checkout /></ProtectedRoute></>} />
              <Route path="/orders" element={<><Navbar /><ProtectedRoute customerOnly><Orders /></ProtectedRoute></>} />
              <Route path="/profile" element={<><Navbar /><ProtectedRoute customerOnly><Profile /></ProtectedRoute></>} />

              {/* Admin routes with AdminLayout */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/:id/edit" element={<AdminProductForm />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="inventory/movements" element={<AdminMovements />} />
                <Route path="sales/warehouses" element={<AdminWarehouseSales />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/staff/new" element={<AdminStaffForm />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>
            </Routes>
          </Router>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
