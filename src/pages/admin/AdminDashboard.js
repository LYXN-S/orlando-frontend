import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import { Package, ShoppingCart, AlertTriangle, ClipboardList, Loader2, ArrowRight } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, to }) => (
  <Link to={to} className="group rounded-xl border border-sand bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
    <div className="flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-espresso">{value}</p>
      </div>
      <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  </Link>
);

const AdminDashboard = () => {
  const { unreadCount } = useNotifications();
  const [stats, setStats] = useState({ products: 0, pendingOrders: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, orders] = await Promise.all([
          productService.getAll(),
          orderService.getPendingOrders(),
        ]);
        const lowStock = products.filter((p) => p.stockQuantity <= 5).length;
        setStats({
          products: products.length,
          pendingOrders: orders.length,
          lowStock,
        });
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-espresso">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Overview of your store</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Package}
            label="Total Products"
            value={stats.products}
            color="bg-primary"
            to="/admin/products"
          />
          <StatCard
            icon={ClipboardList}
            label="Pending Orders"
            value={stats.pendingOrders}
            color="bg-amber-500"
            to="/admin/orders"
          />
          <StatCard
            icon={AlertTriangle}
            label="Low Stock Items"
            value={stats.lowStock}
            color="bg-red-500"
            to="/admin/inventory"
          />
          <StatCard
            icon={ShoppingCart}
            label="Unread Notifications"
            value={unreadCount}
            color="bg-blue-500"
            to="/admin"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <div className="rounded-xl border border-sand bg-white p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-espresso">Quick Actions</h2>
            <div className="mt-4 space-y-2">
              <Link
                to="/admin/products/new"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-espresso transition-colors hover:bg-cream"
              >
                <Package className="h-4 w-4 text-primary" />
                Add New Product
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-espresso transition-colors hover:bg-cream"
              >
                <ClipboardList className="h-4 w-4 text-primary" />
                Review Pending Orders
              </Link>
              <Link
                to="/admin/inventory"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-espresso transition-colors hover:bg-cream"
              >
                <AlertTriangle className="h-4 w-4 text-primary" />
                Manage Inventory
              </Link>
            </div>
          </div>

          {/* Admin Navigation */}
          <div className="rounded-xl border border-sand bg-white p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-espresso">Management</h2>
            <p className="mt-1 text-sm text-muted-foreground">Navigate to manage different areas of your store.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                to="/admin/products"
                className="flex flex-col items-center gap-2 rounded-lg border border-sand p-4 text-center transition-colors hover:bg-cream"
              >
                <Package className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-espresso">Products</span>
              </Link>
              <Link
                to="/admin/orders"
                className="flex flex-col items-center gap-2 rounded-lg border border-sand p-4 text-center transition-colors hover:bg-cream"
              >
                <ClipboardList className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-espresso">Orders</span>
              </Link>
              <Link
                to="/admin/inventory"
                className="flex flex-col items-center gap-2 rounded-lg border border-sand p-4 text-center transition-colors hover:bg-cream"
              >
                <AlertTriangle className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-espresso">Inventory</span>
              </Link>
              <Link
                to="/"
                className="flex flex-col items-center gap-2 rounded-lg border border-sand p-4 text-center transition-colors hover:bg-cream"
              >
                <ShoppingCart className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-espresso">View Store</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
