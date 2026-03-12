import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import inventoryService from '../../services/inventoryService';
import { Loader2, AlertTriangle, Package, ArrowUpDown, Search, ArrowRightLeft } from 'lucide-react';

const AdminInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState(null);
  const [adjustments, setAdjustments] = useState({});
  const [adjustNotes, setAdjustNotes] = useState({});
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('productName');
  const [sortDir, setSortDir] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await inventoryService.getAll();
      setItems(data);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjust = async (itemId, amount) => {
    if (amount === 0) return;
    setAdjusting(itemId);
    try {
      const updated = await inventoryService.adjustStock(itemId, amount, adjustNotes[itemId] || '');
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, currentStock: updated.currentStock, status: updated.status, lastUpdated: updated.lastUpdated } : item))
      );
      setAdjustments((prev) => ({ ...prev, [itemId]: '' }));
      setAdjustNotes((prev) => ({ ...prev, [itemId]: '' }));
    } catch (err) {
      console.error('Failed to adjust stock:', err);
      alert(err.response?.data?.message || 'Failed to adjust stock.');
    } finally {
      setAdjusting(null);
    }
  };

  const getAdjustmentValue = (id) => {
    const val = adjustments[id];
    return val !== undefined && val !== '' ? parseInt(val, 10) : 0;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // Filter
  let filtered = items.filter((item) => {
    if (filter === 'LOW') return item.status === 'LOW_STOCK';
    if (filter === 'OUT') return item.status === 'OUT_OF_STOCK';
    return true;
  });

  // Search
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.productName.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q)
    );
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

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
            <p className="mt-1 text-muted-foreground">Track and adjust stock levels for all products</p>
          </div>
          <Button
            onClick={() => navigate('/admin/inventory/movements')}
            className="rounded-full bg-cream text-espresso hover:bg-sand"
          >
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            View Movements
          </Button>
        </div>

        {/* Summary Cards */}
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

        {/* Filter Tabs + Search */}
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
                  filter === key
                    ? 'bg-primary text-white'
                    : 'bg-cream text-muted-foreground hover:bg-sand'
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
              className="w-64 rounded-lg border border-sand bg-white py-2 pl-9 pr-3 text-sm text-espresso placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Inventory Table */}
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No inventory items found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-cream/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/inventory/movements?productId=${item.productId}`)}
                  >
                    <td className="px-4 py-3 font-medium text-espresso">{item.productName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.sku}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-lg font-bold ${
                          item.currentStock === 0
                            ? 'text-red-500'
                            : item.status === 'LOW_STOCK'
                              ? 'text-amber-500'
                              : 'text-espresso'
                        }`}
                      >
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
                        ? new Date(item.lastUpdated).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={adjustments[item.id] || ''}
                          onChange={(e) =>
                            setAdjustments((prev) => ({ ...prev, [item.id]: e.target.value }))
                          }
                          placeholder="±"
                          className="w-20 rounded-lg border border-sand bg-white px-2 py-1.5 text-center text-sm text-espresso placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAdjust(item.id, getAdjustmentValue(item.id))}
                          disabled={adjusting === item.id || getAdjustmentValue(item.id) === 0}
                          className="rounded-full bg-primary text-white hover:bg-primary-hover disabled:opacity-50"
                        >
                          {adjusting === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Apply'
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
