import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { UserCircle, Shield, Mail, Lock } from 'lucide-react';
import api from '../../services/api';

const PERMISSION_LABELS = {
  VIEW_DASHBOARD: 'Dashboard',
  MANAGE_PRODUCTS: 'Products',
  MANAGE_ORDERS: 'Orders',
  MANAGE_INVENTORY: 'Inventory',
  MANAGE_USERS: 'Users',
  MANAGE_PERMISSIONS: 'Permissions',
  CREATE_ADMIN: 'Create Admin',
};

const AdminProfile = () => {
  const { user, isSuperAdmin } = useContext(AuthContext);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordErr('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordErr('Passwords do not match');
      return;
    }
    try {
      await api.patch('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMsg('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordErr(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="flex items-center gap-2 font-serif text-2xl font-bold text-espresso">
        <UserCircle className="h-7 w-7 text-primary" />
        My Profile
      </h1>

      {/* Profile Info */}
      <div className="rounded-xl border border-sand bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-espresso">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Admin User'}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {user?.email}
            </div>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
              <Shield className="h-3 w-3" />
              {isSuperAdmin() ? 'Super Admin' : 'Staff'}
            </span>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="rounded-xl border border-sand bg-white p-6 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-espresso">Permissions</h3>
        {isSuperAdmin() ? (
          <p className="text-sm text-muted-foreground">Super Admin — full access to all features</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(user?.permissions || []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No permissions assigned</p>
            ) : (
              (user?.permissions || []).map((p) => (
                <span key={p} className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  {PERMISSION_LABELS[p] || p}
                </span>
              ))
            )}
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="rounded-xl border border-sand bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-espresso">
          <Lock className="h-4 w-4" />
          Change Password
        </h3>
        {passwordMsg && <p className="mb-3 text-sm text-success">{passwordMsg}</p>}
        {passwordErr && <p className="mb-3 text-sm text-destructive">{passwordErr}</p>}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required className="border-sand" />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required minLength={8} className="border-sand" />
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required minLength={8} className="border-sand" />
          </div>
          <Button type="submit" className="rounded-full bg-primary text-white hover:bg-primary-hover">
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
