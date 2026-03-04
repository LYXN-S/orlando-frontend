import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { AuthContext } from '../context/AuthContext';
import { Bell, CheckCheck, Loader2, Package, AlertTriangle, ShoppingCart } from 'lucide-react';

const typeIcon = {
  ORDER_SUBMITTED: <ShoppingCart className="h-4 w-4 text-blue-500" />,
  ORDER_APPROVED: <Package className="h-4 w-4 text-green-500" />,
  ORDER_REJECTED: <Package className="h-4 w-4 text-red-500" />,
  LOW_STOCK: <AlertTriangle className="h-4 w-4 text-amber-500" />,
};

const timeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationBell = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const panelRef = useRef();
  const admin = isAdmin();

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleNotificationClick = (n) => {
    if (!n.read) markAsRead(n.id);
    setOpen(false);
    // Navigate to relevant page based on role and notification type
    if (admin) {
      if (n.type === 'ORDER_SUBMITTED' || n.type === 'ORDER_APPROVED' || n.type === 'ORDER_REJECTED') {
        navigate('/admin/orders');
      } else if (n.type === 'LOW_STOCK') {
        navigate('/admin/inventory');
      } else {
        navigate('/admin');
      }
    } else {
      if (n.type === 'ORDER_APPROVED' || n.type === 'ORDER_REJECTED') {
        navigate('/orders');
      }
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-cream hover:text-primary"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-sand bg-white shadow-xl sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sand px-4 py-3">
            <h3 className="font-serif text-base font-semibold text-espresso">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-hover"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-cream/50 ${
                    !n.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {typeIcon[n.type] || <Bell className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? 'font-semibold text-espresso' : 'text-espresso'}`}>
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/60">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
