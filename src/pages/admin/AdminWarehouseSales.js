import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import orderService from '../../services/orderService';
import inventoryService from '../../services/inventoryService';
import { Loader2, BarChart3 } from 'lucide-react';

const AdminWarehouseSales = () => {
  const [summary, setSummary] = useState([]);
  const [details, setDetails] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseCode, setWarehouseCode] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLookups();
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadLookups = async () => {
    try {
      const data = await inventoryService.getWarehouses();
      setWarehouses(data || []);
    } catch (err) {
      console.error('Failed to load warehouses:', err);
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      const params = {};
      if (warehouseCode) params.warehouseCode = warehouseCode;
      if (from) params.from = from;
      if (to) params.to = to;

      const [summaryData, detailData] = await Promise.all([
        orderService.getWarehouseSalesSummary(params),
        orderService.getWarehouseSalesDetails(params),
      ]);
      setSummary(summaryData);
      setDetails(detailData);
    } catch (err) {
      console.error('Failed to load warehouse sales reports:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totals = summary.reduce((acc, row) => {
    acc.qty += Number(row.totalQuantity || 0);
    acc.gross += Number(row.grossSales || 0);
    acc.orders += Number(row.orderCount || 0);
    return acc;
  }, { qty: 0, gross: 0, orders: 0 });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <h1 className="font-serif text-3xl font-bold text-espresso">Warehouse Sales</h1>
        <p className="mt-1 text-muted-foreground">Track quantity and revenue by fulfillment warehouse</p>

        <div className="mt-6 flex flex-wrap gap-3 rounded-xl border border-sand bg-white p-4">
          <select
            value={warehouseCode}
            onChange={(e) => setWarehouseCode(e.target.value)}
            className="rounded-lg border border-sand px-3 py-2 text-sm"
          >
            <option value="">All Warehouses</option>
            {warehouses.map((w) => <option key={w.code} value={w.code}>{w.displayName}</option>)}
          </select>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg border border-sand px-3 py-2 text-sm" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-lg border border-sand px-3 py-2 text-sm" />
          <Button onClick={loadReports} className="bg-primary text-white hover:bg-primary-hover">Apply Filters</Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-sand bg-white p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Total Qty Sold</p>
            <p className="text-2xl font-bold text-espresso">{totals.qty}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Gross Sales</p>
            <p className="text-2xl font-bold text-espresso">${totals.gross.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Orders</p>
            <p className="text-2xl font-bold text-espresso">{totals.orders}</p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-sand bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-sand bg-cream/40">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">Warehouse</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">Qty Sold</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">Gross Sales</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {summary.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No sales data found.</td></tr>
              ) : summary.map((row) => (
                <tr key={row.warehouseCode}>
                  <td className="px-4 py-3 font-medium text-espresso">{row.warehouseCode}</td>
                  <td className="px-4 py-3">{row.totalQuantity}</td>
                  <td className="px-4 py-3">${Number(row.grossSales).toFixed(2)}</td>
                  <td className="px-4 py-3">{row.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-xl border border-sand bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-espresso">Detailed Sales Lines</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sand text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Warehouse</th>
                  <th className="px-3 py-2 text-left">Order</th>
                  <th className="px-3 py-2 text-left">Product</th>
                  <th className="px-3 py-2 text-left">Qty</th>
                  <th className="px-3 py-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {details.length === 0 ? (
                  <tr><td colSpan={6} className="px-3 py-6 text-center text-sm text-muted-foreground">No detailed rows for selected filters.</td></tr>
                ) : details.map((row, idx) => (
                  <tr key={`${row.poId}-${row.orderId}-${idx}`} className="border-b border-sand/40 text-sm">
                    <td className="px-3 py-2">{row.reviewedAt ? new Date(row.reviewedAt).toLocaleString() : '—'}</td>
                    <td className="px-3 py-2">{row.warehouseCode}</td>
                    <td className="px-3 py-2">#{row.orderId}</td>
                    <td className="px-3 py-2">{row.productName}</td>
                    <td className="px-3 py-2">{row.quantity}</td>
                    <td className="px-3 py-2">${Number(row.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWarehouseSales;
