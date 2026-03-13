import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Warehouse,
  ArrowRightLeft,
  Users,
  UserCircle,
  BarChart3,
  FileUp,
  LogOut,
  X,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, permission: 'VIEW_DASHBOARD', exact: true },
  { label: 'Products', path: '/admin/products', icon: Package, permission: 'MANAGE_PRODUCTS' },
  { label: 'PO Reviews', path: '/admin/orders', icon: ClipboardList, permission: 'MANAGE_ORDERS' },
  { label: 'Inventory', path: '/admin/inventory', icon: Warehouse, permission: 'MANAGE_INVENTORY', exact: true },
  { label: 'Movements', path: '/admin/inventory/movements', icon: ArrowRightLeft, permission: 'MANAGE_INVENTORY' },
  { label: 'Warehouse Sales', path: '/admin/sales/warehouses', icon: BarChart3, permission: 'VIEW_DASHBOARD' },
  { label: 'Create PO', path: '/admin/po/create', icon: FileUp, permission: 'MANAGE_ORDERS' },
  { label: 'Users', path: '/admin/users', icon: Users, superAdminOnly: true },
  { label: 'Profile', path: '/admin/profile', icon: UserCircle },
];

const AdminSidebar = ({ open, onClose }) => {
  const { user, hasPermission, isSuperAdmin, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (item) =>
    item.exact
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path);

  const visibleItems = menuItems.filter((item) => {
    if (item.superAdminOnly) return isSuperAdmin();
    if (item.permission) return hasPermission(item.permission);
    return true;
  });

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white border-r border-sand">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sand px-4">
        <Link to="/admin" className="flex items-center gap-2">
          <img src="/orlando_logo.jpg" alt="Orlando" className="h-9 w-auto" />
          <span className="font-serif text-xl font-bold tracking-wide text-primary">ORLANDO</span>
        </Link>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-cream lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3 border-b border-sand">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {isSuperAdmin() ? 'Super Admin' : 'Staff'}
        </span>
        {user?.email && (
          <p className="mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-cream hover:text-espresso'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-sand p-3">
        <button
          onClick={() => { logout(); onClose(); }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-64 shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
