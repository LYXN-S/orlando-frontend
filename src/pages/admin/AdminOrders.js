import React, { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import orderService from '../../services/orderService';
import { Loader2, CheckCircle, XCircle, Clock, Building2, User, AlertTriangle, PackageCheck } from 'lucide-react';

const statusIcon = {
  PENDING_EVALUATION: <Clock className="h-4 w-4 text-amber-500" />,
  APPROVED: <CheckCircle className="h-4 w-4 text-green-600" />,
  REJECTED: <XCircle className="h-4 w-4 text-red-500" />,
};

const statusColors = {
  PENDING_EVALUATION: 'muted',
  APPROVED: 'success',
  REJECTED: 'destructive',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(null);
  const [noteInputs, setNoteInputs] = useState({});
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getPendingOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (orderId, approved) => {
    setEvaluating(orderId);
    try {
      await orderService.evaluateOrder(orderId, approved, noteInputs[orderId] || '');
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: approved ? 'APPROVED' : 'REJECTED', evaluationNote: noteInputs[orderId] || '' }
            : o
        )
      );
    } catch (err) {
      console.error('Failed to evaluate order:', err);
      alert('Failed to evaluate order.');
    } finally {
      setEvaluating(null);
    }
  };

  const filteredOrders = filter === 'ALL'
    ? orders
    : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <h1 className="font-serif text-3xl font-bold text-espresso">Order Management</h1>
        <p className="mt-1 text-muted-foreground">Review, approve, or reject customer orders</p>

        {/* Filter Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {['ALL', 'PENDING_EVALUATION', 'APPROVED', 'REJECTED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === s
                  ? 'bg-primary text-white'
                  : 'bg-cream text-muted-foreground hover:bg-sand'
              }`}
            >
              {s === 'ALL' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Order List */}
        <div className="mt-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No orders in this category.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="rounded-xl border border-sand bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {statusIcon[order.status]}
                      <h3 className="font-serif text-lg font-semibold text-espresso">Order #{order.id}</h3>
                      <Badge variant={statusColors[order.status] || 'muted'}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Customer ID: {order.customerId} · {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-espresso">${Number(order.totalAmount).toFixed(2)}</p>
                </div>

                {/* Items with inventory comparison */}
                <div className="mt-4">
                  <div className="mb-2 grid grid-cols-12 gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="col-span-4">Product</span>
                    <span className="col-span-2 text-center">Ordered</span>
                    <span className="col-span-2 text-center">In Stock</span>
                    <span className="col-span-2 text-center">Status</span>
                    <span className="col-span-2 text-right">Subtotal</span>
                  </div>
                  {order.items && order.items.map((item, idx) => {
                    const hasStock = item.availableStock != null;
                    const sufficient = hasStock && item.availableStock >= item.quantity;
                    const low = hasStock && !sufficient;
                    return (
                      <div key={idx} className={`grid grid-cols-12 items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${low ? 'bg-red-50' : ''}`}>
                        <span className="col-span-4 text-muted-foreground">{item.productName}</span>
                        <span className="col-span-2 text-center font-medium text-espresso">{item.quantity}</span>
                        <span className={`col-span-2 text-center font-medium ${low ? 'text-red-600' : 'text-espresso'}`}>
                          {hasStock ? item.availableStock : '—'}
                        </span>
                        <span className="col-span-2 flex justify-center">
                          {hasStock ? (
                            sufficient ? (
                              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                                <PackageCheck className="h-3.5 w-3.5" /> Sufficient
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                                <AlertTriangle className="h-3.5 w-3.5" /> Insufficient
                              </span>
                            )
                          ) : (
                            <span className="text-xs text-muted-foreground">N/A</span>
                          )}
                        </span>
                        <span className="col-span-2 text-right font-medium text-espresso">${Number(item.subtotal).toFixed(2)}</span>
                      </div>
                    );
                  })}
                  {/* Overall stock warning */}
                  {order.status === 'PENDING_EVALUATION' && order.items?.some(item => item.availableStock != null && item.availableStock < item.quantity) && (
                    <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Warning: Some items have insufficient stock to fulfill this order.</span>
                    </div>
                  )}
                </div>

                {/* Billing Details (PO Info) */}
                {order.billingType && (
                  <div className="mt-4 rounded-lg bg-cream/60 p-4 border border-sand/50">
                    <div className="flex items-center gap-2 mb-2">
                      {order.billingType === 'COMPANY' ? (
                        <Building2 className="h-4 w-4 text-primary" />
                      ) : (
                        <User className="h-4 w-4 text-primary" />
                      )}
                      <span className="text-sm font-semibold text-espresso">
                        {order.billingType === 'COMPANY' ? 'Company' : 'Personal'} Billing
                      </span>
                    </div>
                    <div className="grid gap-1.5 text-sm">
                      <div className="flex gap-2">
                        <span className="text-muted-foreground min-w-[100px]">
                          {order.billingType === 'COMPANY' ? 'Registered Name:' : 'Name:'}
                        </span>
                        <span className="font-medium text-espresso">{order.billingName}</span>
                      </div>
                      {order.billingType === 'COMPANY' && order.billingTin && (
                        <div className="flex gap-2">
                          <span className="text-muted-foreground min-w-[100px]">TIN:</span>
                          <span className="font-medium text-espresso">{order.billingTin}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <span className="text-muted-foreground min-w-[100px]">
                          {order.billingType === 'COMPANY' ? 'Business Addr:' : 'Billing Addr:'}
                        </span>
                        <span className="font-medium text-espresso">{order.billingAddress}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-muted-foreground min-w-[100px]">Terms:</span>
                        <span className="font-medium text-espresso">{order.billingTerms}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Evaluate Controls (only for pending) */}
                {order.status === 'PENDING_EVALUATION' && (
                  <div className="mt-4 border-t border-sand pt-4">
                    <label className="mb-1.5 block text-sm font-medium text-espresso">Evaluation Note (optional)</label>
                    <input
                      type="text"
                      value={noteInputs[order.id] || ''}
                      onChange={(e) => setNoteInputs((prev) => ({ ...prev, [order.id]: e.target.value }))}
                      placeholder="Add a note for the customer…"
                      className="w-full rounded-lg border border-sand bg-white px-4 py-2 text-sm text-espresso placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div className="mt-3 flex gap-2">
                      <Button
                        onClick={() => handleEvaluate(order.id, true)}
                        disabled={evaluating === order.id}
                        className="gap-1.5 rounded-full bg-green-600 text-white hover:bg-green-700"
                      >
                        {evaluating === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleEvaluate(order.id, false)}
                        disabled={evaluating === order.id}
                        variant="destructive"
                        className="gap-1.5 rounded-full"
                      >
                        {evaluating === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        Reject
                      </Button>
                    </div>
                  </div>
                )}

                {order.evaluationNote && order.status !== 'PENDING_EVALUATION' && (
                  <p className="mt-3 text-sm italic text-muted-foreground">Note: {order.evaluationNote}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
