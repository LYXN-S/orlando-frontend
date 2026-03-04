import React, { useState } from 'react';
import adminUserService from '../services/adminUserService';
import { Button } from './ui/button';
import { X } from 'lucide-react';

const ALL_PERMISSIONS = [
  { key: 'VIEW_DASHBOARD', label: 'View Dashboard' },
  { key: 'MANAGE_PRODUCTS', label: 'Manage Products' },
  { key: 'MANAGE_ORDERS', label: 'Manage Orders' },
  { key: 'MANAGE_INVENTORY', label: 'Manage Inventory' },
  { key: 'MANAGE_USERS', label: 'Manage Users' },
  { key: 'MANAGE_PERMISSIONS', label: 'Manage Permissions' },
  { key: 'CREATE_ADMIN', label: 'Create Admin' },
];

const PermissionEditorModal = ({ staff, onClose, onSaved }) => {
  const [selected, setSelected] = useState(new Set(staff.permissions || []));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggle = (perm) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(perm)) next.delete(perm);
      else next.add(perm);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const updated = await adminUserService.updatePermissions(staff.id, Array.from(selected));
      onSaved(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update permissions');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-sand bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-espresso">
            Edit Permissions — {staff.firstName} {staff.lastName}
          </h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-cream">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

        <div className="space-y-2">
          {ALL_PERMISSIONS.map((perm) => (
            <label
              key={perm.key}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                selected.has(perm.key) ? 'border-primary bg-primary/5' : 'border-sand hover:border-primary/40'
              }`}
            >
              <input
                type="checkbox"
                checked={selected.has(perm.key)}
                onChange={() => toggle(perm.key)}
                className="h-4 w-4 rounded border-sand text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-espresso">{perm.label}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={handleSave} disabled={saving} className="rounded-full bg-primary text-white hover:bg-primary-hover">
            {saving ? 'Saving...' : 'Save Permissions'}
          </Button>
          <Button variant="outline" onClick={onClose} className="rounded-full">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PermissionEditorModal;
