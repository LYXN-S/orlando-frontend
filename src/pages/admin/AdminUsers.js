import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import adminUserService from '../../services/adminUserService';
import PermissionEditorModal from '../../components/PermissionEditorModal';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Users, UserPlus, Search, Trash2, Settings, Shield } from 'lucide-react';

const PERMISSION_LABELS = {
  VIEW_DASHBOARD: 'Dashboard',
  MANAGE_PRODUCTS: 'Products',
  MANAGE_ORDERS: 'Orders',
  MANAGE_INVENTORY: 'Inventory',
  MANAGE_USERS: 'Users',
  MANAGE_PERMISSIONS: 'Permissions',
  CREATE_ADMIN: 'Create Admin',
};

const AdminUsers = () => {
  const { isSuperAdmin } = useContext(AuthContext);
  const [tab, setTab] = useState('staff');
  const [staff, setStaff] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'staff') {
        const data = await adminUserService.getStaff();
        setStaff(data);
      } else {
        const data = await adminUserService.getCustomers();
        setCustomers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteStaff = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate staff member "${name}"?`)) return;
    try {
      await adminUserService.deactivateStaff(id);
      setStaff((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate staff member');
    }
  };

  const handleDeleteCustomer = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate customer "${name}"?`)) return;
    try {
      await adminUserService.deactivateCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.customerId !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate customer');
    }
  };

  const handlePermissionsUpdated = (updatedStaff) => {
    setStaff((prev) => prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
    setEditingStaff(null);
  };

  const filteredStaff = staff.filter(
    (s) =>
      s.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (!isSuperAdmin()) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">Only Super Admins can manage users.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-serif text-2xl font-bold text-espresso">
            <Users className="h-7 w-7 text-primary" />
            User Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage staff accounts and customer profiles</p>
        </div>
        {tab === 'staff' && (
          <Link to="/admin/users/staff/new">
            <Button className="gap-2 rounded-full bg-primary text-white hover:bg-primary-hover">
              <UserPlus className="h-4 w-4" />
              Create Staff
            </Button>
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-sand/50 p-1">
        <button
          onClick={() => { setTab('staff'); setSearch(''); }}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'staff' ? 'bg-white text-espresso shadow-sm' : 'text-muted-foreground hover:text-espresso'
          }`}
        >
          Staff ({staff.length})
        </button>
        <button
          onClick={() => { setTab('customers'); setSearch(''); }}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'customers' ? 'bg-white text-espresso shadow-sm' : 'text-muted-foreground hover:text-espresso'
          }`}
        >
          Customers ({customers.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={`Search ${tab}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 border-sand"
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Loading...</div>
      ) : tab === 'staff' ? (
        /* Staff Table */
        <div className="overflow-hidden rounded-xl border border-sand bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand bg-cream/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Permissions</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No staff members found</td>
                </tr>
              ) : (
                filteredStaff.map((s) => (
                  <tr key={s.id} className="border-b border-sand/50 last:border-0 hover:bg-cream/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {s.firstName} {s.lastName}
                        {s.superAdmin && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-wine/10 px-2 py-0.5 text-xs font-semibold text-wine">
                            <Shield className="h-3 w-3" /> Super Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.superAdmin ? (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">All</span>
                        ) : (
                          (s.permissions || []).map((p) => (
                            <span key={p} className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                              {PERMISSION_LABELS[p] || p}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!s.superAdmin && (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingStaff(s)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                            title="Edit permissions"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStaff(s.id, `${s.firstName} ${s.lastName}`)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            title="Deactivate"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Customer Table */
        <div className="overflow-hidden rounded-xl border border-sand bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand bg-cream/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No customers found</td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.customerId} className="border-b border-sand/50 last:border-0 hover:bg-cream/30">
                    <td className="px-4 py-3">{c.fullName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCustomer(c.customerId, c.fullName)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        title="Deactivate"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Permission Editor Modal */}
      {editingStaff && (
        <PermissionEditorModal
          staff={editingStaff}
          onClose={() => setEditingStaff(null)}
          onSaved={handlePermissionsUpdated}
        />
      )}
    </div>
  );
};

export default AdminUsers;
