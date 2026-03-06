import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Footer from '../components/Footer';
import orderService from '../services/orderService';
import { Package, Loader2, Building2, User } from 'lucide-react';

const statusColors = {
  PENDING_EVALUATION: 'muted',
  APPROVED: 'success',
  REJECTED: 'destructive',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
        <h1 className="font-serif text-3xl font-bold text-espresso md:text-4xl">Your Orders</h1>
        <p className="mt-1 text-muted-foreground">View and track your order history</p>

        {orders.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cream">
              <Package className="h-12 w-12 text-primary/40" />
            </div>
            <h2 className="mt-6 font-serif text-xl font-semibold text-espresso">No Orders Yet</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              You haven't placed any orders yet. Start shopping and your orders will appear here.
            </p>
            <Link to="/products">
              <Button className="mt-6 rounded-full bg-primary px-8 text-white hover:bg-primary-hover">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border border-sand bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-espresso">Order #{order.id}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusColors[order.status] || 'muted'}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                    <span className="font-semibold text-espresso">${Number(order.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.productName} x{item.quantity}</span>
                      <span className="font-medium">${Number(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                {order.billingType && (
                  <div className="mt-3 rounded-lg bg-cream/60 p-3 border border-sand/50">
                    <div className="flex items-center gap-2 text-xs font-semibold text-espresso">
                      {order.billingType === 'COMPANY' ? <Building2 className="h-3.5 w-3.5 text-primary" /> : <User className="h-3.5 w-3.5 text-primary" />}
                      {order.billingType === 'COMPANY' ? 'Company' : 'Personal'} · {order.billingName}
                      {order.billingTin ? ` · TIN: ${order.billingTin}` : ''}
                    </div>
                  </div>
                )}
                {order.evaluationNote && (
                  <p className="mt-3 text-sm italic text-muted-foreground">Note: {order.evaluationNote}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
