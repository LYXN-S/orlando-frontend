import React, { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import orderService from '../../services/orderService';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

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
  const [filter, setFilter] = useState('PENDING_EVALUATION');

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

                {/* Items */}
                <div className="mt-4 space-y-1.5">
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.productName} × {item.quantity}</span>
                      <span className="font-medium text-espresso">${Number(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

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
