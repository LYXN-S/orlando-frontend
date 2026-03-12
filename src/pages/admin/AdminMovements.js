import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import inventoryService from '../../services/inventoryService';
import { Loader2, ArrowDownCircle, ArrowUpCircle, RefreshCw, Calendar, Filter, BarChart3 } from 'lucide-react';

const typeConfig = {
  STOCK_IN: { label: 'Stock In', color: 'success', icon: ArrowDownCircle },
  STOCK_OUT: { label: 'Stock Out', color: 'destructive', icon: ArrowUpCircle },
  ADJUSTMENT: { label: 'Adjustment', color: 'muted', icon: RefreshCw },
  ORDER_DEDUCTION: { label: 'Order Deduction', color: 'destructive', icon: ArrowUpCircle },
  ORDER_REVERSAL: { label: 'Order Reversal', color: 'success', icon: ArrowDownCircle },
};

const AdminMovements = () => {
  const [searchParams] = useSearchParams();
  const [movements, setMovements] = useState([]);
  const [dailySummary, setDailySummary] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('movements'); // 'movements' or 'daily'

  // Filters
  const [productId, setProductId] = useState(searchParams.get('productId') || '');
  const [type, setType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [summaryDate, setSummaryDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchMovements = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (productId) params.productId = productId;
      if (type) params.type = type;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const data = await inventoryService.getMovements(params);
      setMovements(data);
    } catch (err) {
      console.error('Failed to load movements:', err);
    } finally {
      setLoading(false);
    }
  }, [productId, type, fromDate, toDate]);

  const fetchDailySummary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getDailySummary({ date: summaryDate });
      setDailySummary(data);
    } catch (err) {
      console.error('Failed to load daily summary:', err);
    } finally {
      setLoading(false);
    }
  }, [summaryDate]);

  const fetchInventoryItems = async () => {
    try {
      const data = await inventoryService.getAll();
      setInventoryItems(data);
    } catch (err) {
      console.error('Failed to load inventory items:', err);
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  useEffect(() => {
    if (view === 'movements') {
      fetchMovements();
    } else {
      fetchDailySummary();
    }
  }, [view, fetchMovements, fetchDailySummary]);

  const clearFilters = () => {
    setProductId('');
    setType('');
    setFromDate('');
    setToDate('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <h1 className="font-serif text-3xl font-bold text-espresso">Inventory Movements</h1>
        <p className="mt-1 text-muted-foreground">Track all stock changes — ins, outs, adjustments, and order deductions</p>

        {/* View Toggle */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setView('movements')}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              view === 'movements'
                ? 'bg-primary text-white'
                : 'bg-cream text-muted-foreground hover:bg-sand'
            }`}
          >
            <Filter className="h-4 w-4" />
            Movement Log
          </button>
          <button
            onClick={() => setView('daily')}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              view === 'daily'
                ? 'bg-primary text-white'
                : 'bg-cream text-muted-foreground hover:bg-sand'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Daily Summary
          </button>
        </div>

        {view === 'movements' ? (
          <>
            {/* Filters */}
            <div className="mt-6 flex flex-wrap items-end gap-4 rounded-xl border border-sand bg-white p-4 shadow-sm">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Product</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">All Products</option>
                  {inventoryItems.map((item) => (
                    <option key={item.productId} value={item.productId}>
                      {item.productName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">All Types</option>
                  {Object.entries(typeConfig).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="rounded-full border-sand text-muted-foreground hover:bg-cream"
              >
                Clear
              </Button>
            </div>

            {/* Movements Table */}
            <div className="mt-6 overflow-x-auto rounded-xl border border-sand bg-white shadow-sm">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <table className="w-full">
                  <thead className="border-b border-sand bg-cream/40">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date / Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reference</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand/50">
                    {movements.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-muted-foreground">
                          No movements found for the selected filters.
                        </td>
                      </tr>
                    ) : (
                      movements.map((m) => {
                        const cfg = typeConfig[m.movementType] || { label: m.movementType, color: 'muted' };
                        const Icon = cfg.icon || RefreshCw;
                        return (
                          <tr key={m.id} className="hover:bg-cream/30 transition-colors">
                            <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                              {new Date(m.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}{' '}
                              {new Date(m.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="px-4 py-3 font-medium text-espresso">{m.productName}</td>
                            <td className="px-4 py-3">
                              <Badge variant={cfg.color} className="inline-flex items-center gap-1">
                                <Icon className="h-3 w-3" />
                                {cfg.label}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`font-bold ${
                                  m.quantity > 0 ? 'text-green-600' : m.quantity < 0 ? 'text-red-500' : 'text-espresso'
                                }`}
                              >
                                {m.quantity > 0 ? '+' : ''}{m.quantity}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {m.referenceType && m.referenceId
                                ? `${m.referenceType} #${m.referenceId}`
                                : m.referenceType || '—'}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                              {m.note || '—'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Daily Summary */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={summaryDate}
                  onChange={(e) => setSummaryDate(e.target.value)}
                  className="rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-xl border border-sand bg-white shadow-sm">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <table className="w-full">
                  <thead className="border-b border-sand bg-cream/40">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <span className="text-green-600">Total In</span>
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <span className="text-red-500">Total Out</span>
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Net Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand/50">
                    {dailySummary.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-muted-foreground">
                          No movements recorded for this date.
                        </td>
                      </tr>
                    ) : (
                      dailySummary.map((summary) => (
                        <tr key={summary.productId} className="hover:bg-cream/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-espresso">{summary.productName}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{summary.sku}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-bold text-green-600">+{summary.totalIn}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="font-bold text-red-500">-{summary.totalOut}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`font-bold ${
                                summary.netChange > 0
                                  ? 'text-green-600'
                                  : summary.netChange < 0
                                    ? 'text-red-500'
                                    : 'text-espresso'
                              }`}
                            >
                              {summary.netChange > 0 ? '+' : ''}{summary.netChange}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminMovements;
