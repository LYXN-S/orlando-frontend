import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { Menu } from 'lucide-react';

const AdminNavbar = ({ onMenuToggle }) => {
  const { user, isSuperAdmin } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-sand bg-white/90 px-4 backdrop-blur-md md:px-6">
      {/* Left: hamburger for mobile */}
      <button
        onClick={onMenuToggle}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-cream lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Spacer */}
      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="hidden items-center gap-2 sm:flex">
          <div className="text-right">
            <p className="text-sm font-medium text-espresso">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email}
            </p>
            <p className="text-xs text-muted-foreground">
              {isSuperAdmin() ? 'Super Admin' : 'Staff'}
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
