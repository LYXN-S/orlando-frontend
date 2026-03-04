import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminUserService from '../../services/adminUserService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';

const ALL_PERMISSIONS = [
  { key: 'VIEW_DASHBOARD', label: 'View Dashboard', description: 'Access the admin dashboard overview' },
  { key: 'MANAGE_PRODUCTS', label: 'Manage Products', description: 'Create, edit, and delete products' },
  { key: 'MANAGE_ORDERS', label: 'Manage Orders', description: 'View and evaluate customer orders' },
  { key: 'MANAGE_INVENTORY', label: 'Manage Inventory', description: 'Adjust product stock quantities' },
  { key: 'MANAGE_USERS', label: 'Manage Users', description: 'View customer and staff information' },
  { key: 'MANAGE_PERMISSIONS', label: 'Manage Permissions', description: 'Modify staff permissions' },
  { key: 'CREATE_ADMIN', label: 'Create Admin', description: 'Create new staff accounts' },
];

const AdminStaffForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    permissions: new Set(),
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const togglePermission = (perm) => {
    setForm((prev) => {
      const next = new Set(prev.permissions);
      if (next.has(perm)) next.delete(perm);
      else next.add(perm);
      return { ...prev, permissions: next };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminUserService.createStaff({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        permissions: Array.from(form.permissions),
      });
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create staff account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate('/admin/users')}
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-espresso"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </button>

      <div className="rounded-xl border border-sand bg-white p-6 shadow-sm">
        <h1 className="mb-1 flex items-center gap-2 font-serif text-2xl font-bold text-espresso">
          <UserPlus className="h-6 w-6 text-primary" />
          Create Staff Account
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">Create a new staff member with specific permissions.</p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={form.firstName} onChange={handleChange('firstName')} required className="border-sand" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={form.lastName} onChange={handleChange('lastName')} required className="border-sand" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={handleChange('email')} required className="border-sand" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Temporary Password</Label>
            <Input id="password" type="password" value={form.password} onChange={handleChange('password')} required minLength={8} className="border-sand" />
            <p className="text-xs text-muted-foreground">Min 8 chars, must include uppercase, lowercase, number & special character.</p>
          </div>

          {/* Permissions */}
          <div className="space-y-3">
            <Label>Permissions</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {ALL_PERMISSIONS.map((perm) => (
                <label
                  key={perm.key}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    form.permissions.has(perm.key)
                      ? 'border-primary bg-primary/5'
                      : 'border-sand hover:border-primary/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.permissions.has(perm.key)}
                    onChange={() => togglePermission(perm.key)}
                    className="mt-0.5 h-4 w-4 rounded border-sand text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="text-sm font-medium text-espresso">{perm.label}</p>
                    <p className="text-xs text-muted-foreground">{perm.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="rounded-full bg-primary text-white hover:bg-primary-hover">
              {loading ? 'Creating...' : 'Create Staff Account'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/users')} className="rounded-full">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminStaffForm;
