import React, { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import productService from '../../services/productService';
import { Loader2, AlertTriangle, Package, Image as ImageIcon } from 'lucide-react';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState(null);
  const [adjustments, setAdjustments] = useState({});
  const [filter, setFilter] = useState('ALL'); // ALL, LOW, OUT

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjust = async (productId, amount) => {
    if (amount === 0) return;
    setAdjusting(productId);
    try {
      const updated = await productService.adjustStock(productId, amount);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stockQuantity: updated.stockQuantity } : p))
      );
      setAdjustments((prev) => ({ ...prev, [productId]: '' }));
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

  const filteredProducts = products.filter((p) => {
    if (filter === 'LOW') return p.stockQuantity > 0 && p.stockQuantity <= 5;
    if (filter === 'OUT') return p.stockQuantity === 0;
    return true;
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const lowCount = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 5).length;
  const outCount = products.filter((p) => p.stockQuantity === 0).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <h1 className="font-serif text-3xl font-bold text-espresso">Inventory Management</h1>
        <p className="mt-1 text-muted-foreground">Adjust stock levels for your products</p>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-sand bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold text-espresso">{products.length}</p>
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

        {/* Filter Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { key: 'ALL', label: `All (${products.length})` },
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

        {/* Product Stock Table */}
        <div className="mt-6 space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No products in this category.
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-sand bg-white p-4 shadow-sm"
              >
                {/* Thumbnail */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-sand bg-gradient-to-br from-sand to-cream">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={productService.getImageUrl(product.id, product.images[0].id)}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-primary/30" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="truncate font-semibold text-espresso">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                </div>

                {/* Current Stock */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Stock:</span>
                  <span className={`text-lg font-bold ${
                    product.stockQuantity === 0
                      ? 'text-red-500'
                      : product.stockQuantity <= 5
                        ? 'text-amber-500'
                        : 'text-espresso'
                  }`}>
                    {product.stockQuantity}
                  </span>
                  {product.stockQuantity === 0 && <Badge variant="destructive">Out</Badge>}
                  {product.stockQuantity > 0 && product.stockQuantity <= 5 && <Badge variant="muted">Low</Badge>}
                </div>

                {/* Adjustment Controls */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={adjustments[product.id] || ''}
                    onChange={(e) => setAdjustments((prev) => ({ ...prev, [product.id]: e.target.value }))}
                    placeholder="±"
                    className="w-20 rounded-lg border border-sand bg-white px-3 py-2 text-center text-sm text-espresso placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAdjust(product.id, getAdjustmentValue(product.id))}
                    disabled={adjusting === product.id || getAdjustmentValue(product.id) === 0}
                    className="rounded-full bg-primary text-white hover:bg-primary-hover disabled:opacity-50"
                  >
                    {adjusting === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
