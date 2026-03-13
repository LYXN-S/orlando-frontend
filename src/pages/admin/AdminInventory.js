import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import inventoryService from '../../services/inventoryService';
import { Loader2, AlertTriangle, Package, ArrowUpDown, Search, ArrowRightLeft, Plus } from 'lucide-react';

const StockInModal = ({ open, onClose, warehouses, item, onSubmit, saving }) => {
  const [warehouseCode, setWarehouseCode] = useState('OFFICE');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!open) return;
    setWarehouseCode('OFFICE');
    setQuantity('');
    setNote('');
  }, [open, item?.id]);

  if (!open || !item) return null;

  const submit = async (e) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10);
    if (!warehouseCode || !qty || qty <= 0) {
      alert('Warehouse and a positive quantity are required.');
      return;
    }
    await onSubmit({ warehouseCode, quantity: qty, note });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-sand bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-2xl font-semibold text-espresso">Add Stock</h3>
        <p className="mt-1 text-sm text-muted-foreground">{item.productName} ({item.sku})</p>

        <form className="mt-5 space-y-4" onSubmit={submit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-espresso">Warehouse</label>
            <select
              value={warehouseCode}
              onChange={(e) => setWarehouseCode(e.target.value)}
              className="w-full rounded-lg border border-sand px-3 py-2 text-sm"
            >
              {warehouses.map((warehouse) => (
                <option key={warehouse.code} value={warehouse.code}>{warehouse.displayName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-espresso">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-lg border border-sand px-3 py-2 text-sm"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-espresso">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg border border-sand px-3 py-2 text-sm"
              rows={3}
              placeholder="Optional note"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-primary text-white hover:bg-primary-hover">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warehouses, setWarehouses] = useState([]);
  const [savingStockIn, setSavingStockIn] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('productName');
  const [sortDir, setSortDir] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inventory, warehouseOptions] = await Promise.all([
        inventoryService.getAll(),
        inventoryService.getWarehouses(),
      ]);
      setItems(inventory);
      setWarehouses(warehouseOptions || []);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStockIn = async ({ warehouseCode, quantity, note }) => {
    if (!modalItem) return;
    setSavingStockIn(true);
    try {
      const updated = await inventoryService.stockInByWarehouse(
        modalItem.productId,
        warehouseCode,
        quantity,
        note || ''
      );
      setItems((prev) => prev.map((item) => (item.id === modalItem.id ? { ...item, ...updated } : item)));
      setModalItem(null);
    } catch (err) {
      console.error('Failed to add stock:', err);
      alert(err.response?.data?.message || 'Failed to add stock.');
    } finally {
      setSavingStockIn(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let data = items.filter((item) => {
      if (filter === 'LOW') return item.status === 'LOW_STOCK';
      if (filter === 'OUT') return item.status === 'OUT_OF_STOCK';
      return true;
    });

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((item) =>
        item.productName.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q)
      );
    }

    data = [...data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [items, filter, search, sortField, sortDir]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const lowCount = items.filter((item) => item.status === 'LOW_STOCK').length;
  const outCount = items.filter((item) => item.status === 'OUT_OF_STOCK').length;

  const SortHeader = ({ field, label }) => (
    <th
      className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-espresso"
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortField === field ? 'text-primary' : 'text-muted-foreground/40'}`} />
      </span>
    </th>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-espresso">Inventory Management</h1>
            <p className="mt-1 text-muted-foreground">Stock in by warehouse and monitor critical levels</p>
          </div>
          <Button
            onClick={() => navigate('/admin/inventory/movements')}
            className="rounded-full bg-cream text-espresso hover:bg-sand"
          >
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            View Movements
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-sand bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold text-espresso">{items.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-espresso">{lowCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-espresso">{outCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'ALL', label: `All (${items.length})` },
              { key: 'LOW', label: `Low Stock (${lowCount})` },
              { key: 'OUT', label: `Out of Stock (${outCount})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === key ? 'bg-primary text-white' : 'bg-cream text-muted-foreground hover:bg-sand'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-lg border border-sand bg-white py-2 pl-9 pr-3 text-sm text-espresso"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-sand bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-sand bg-cream/40">
              <tr>
                <SortHeader field="productName" label="Product Name" />
                <SortHeader field="sku" label="SKU" />
                <SortHeader field="currentStock" label="Current Stock" />
                <SortHeader field="reorderLevel" label="Reorder Level" />
                <SortHeader field="status" label="Status" />
                <SortHeader field="lastUpdated" label="Last Updated" />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">No inventory items found.</td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="cursor-pointer transition-colors hover:bg-cream/30"
                    onClick={() => navigate(`/admin/inventory/movements?productId=${item.productId}`)}
                  >
                    <td className="px-4 py-3 font-medium text-espresso">{item.productName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.sku}</td>
                    <td className="px-4 py-3">
                      <span className={`text-lg font-bold ${item.currentStock === 0 ? 'text-red-500' : item.status === 'LOW_STOCK' ? 'text-amber-500' : 'text-espresso'}`}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.reorderLevel}</td>
                    <td className="px-4 py-3">
                      {item.status === 'OUT_OF_STOCK' && <Badge variant="destructive">Out of Stock</Badge>}
                      {item.status === 'LOW_STOCK' && <Badge variant="muted">Low Stock</Badge>}
                      {item.status === 'IN_STOCK' && <Badge variant="success">In Stock</Badge>}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {item.lastUpdated
                        ? new Date(item.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        className="rounded-full bg-primary text-white hover:bg-primary-hover"
                        onClick={() => setModalItem(item)}
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Add Stock
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StockInModal
        open={!!modalItem}
        item={modalItem}
        warehouses={warehouses}
        onClose={() => setModalItem(null)}
        onSubmit={handleStockIn}
        saving={savingStockIn}
      />
    </div>
  );
};

export default AdminInventory;
