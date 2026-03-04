import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import NotificationBell from './NotificationBell';
import { Button } from './ui/button';
import { ShoppingCart, Package, User, LogOut, Menu, X, Home, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const admin = isAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const navLinkClass = (path) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-cream hover:text-primary ${
      isActive(path) ? 'text-primary bg-cream/50' : 'text-muted-foreground'
    }`;

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-sand bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <Link
            to="/"
            className="font-serif text-xl font-bold tracking-wide text-primary"
          >
            ORLANDO
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 md:flex">
            <Link to="/" className={navLinkClass('/')}>
              Home
            </Link>
            <Link to="/products" className={navLinkClass('/products')}>
              Products
            </Link>
            {user && !admin && (
              <>
                <Link to="/orders" className={navLinkClass('/orders')}>
                  <span className="flex items-center gap-1.5">
                    <Package className="h-4 w-4" />
                    Orders
                  </span>
                </Link>
                <Link to="/profile" className={navLinkClass('/profile')}>
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    Profile
                  </span>
                </Link>
              </>
            )}
            {user && admin && (
              <Link to="/admin" className={navLinkClass('/admin')}>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4" />
                  Admin Dashboard
                </span>
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Notifications - visible when logged in */}
            {user && <NotificationBell />}

            {/* Cart - hidden for admin users */}
            {!admin && (
              <Link
                to="/cart"
                className="relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-cream hover:text-primary"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Buttons - Desktop */}
            <div className="hidden items-center gap-2 md:flex">
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-1.5 text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="rounded-full bg-primary text-white hover:bg-primary-hover">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-cream md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={closeMobile} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-sand px-4">
              <span className="font-serif text-lg font-bold text-primary">Menu</span>
              <button
                onClick={closeMobile}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-cream"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col p-4">
              <Link
                to="/"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-espresso transition-colors hover:bg-cream"
              >
                <Home className="h-4 w-4 text-primary" />
                Home
              </Link>
              <Link
                to="/products"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-espresso transition-colors hover:bg-cream"
              >
                <ShoppingCart className="h-4 w-4 text-primary" />
                Products
              </Link>
              {user && (
                <>
                  {!admin && (
                    <>
                      <Link
                        to="/orders"
                        onClick={closeMobile}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-espresso transition-colors hover:bg-cream"
                      >
                        <Package className="h-4 w-4 text-primary" />
                        Orders
                      </Link>
                      <Link
                        to="/profile"
                        onClick={closeMobile}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-espresso transition-colors hover:bg-cream"
                      >
                        <User className="h-4 w-4 text-primary" />
                        Profile
                      </Link>
                    </>
                  )}
                  {admin && (
                    <Link
                      to="/admin"
                      onClick={closeMobile}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-espresso transition-colors hover:bg-cream"
                    >
                      <Shield className="h-4 w-4 text-primary" />
                      Admin Dashboard
                    </Link>
                  )}
                </>
              )}

              <div className="my-3 border-t border-sand" />

              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-destructive transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-espresso transition-colors hover:bg-cream"
                  >
                    Login
                  </Link>
                  <Link to="/register" onClick={closeMobile}>
                    <Button className="mt-2 w-full rounded-full bg-primary text-white hover:bg-primary-hover">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
