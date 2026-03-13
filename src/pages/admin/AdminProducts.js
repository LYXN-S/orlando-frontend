import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import productService from '../../services/productService';
import { Plus, Pencil, Trash2, Loader2, Search, Image as ImageIcon } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [toggling, setToggling] = useState(null);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeleting(id);
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter((p) => {
    const availabilityMatch = availabilityFilter === 'ALL' || p.availabilityStatus === availabilityFilter;
    const searchMatch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return availabilityMatch && searchMatch;
  });

  const handleToggleAvailability = async (product) => {
    const next = product.availabilityStatus === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
    setToggling(product.id);
    try {
      const updated = await productService.updateAvailability(product.id, next);
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, ...updated } : p)));
    } catch (err) {
      console.error('Failed to update availability:', err);
      alert(err.response?.data?.message || 'Failed to update availability');
    } finally {
      setToggling(null);
    }
  };

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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-espresso">Products</h1>
            <p className="mt-1 text-muted-foreground">{products.length} product{products.length !== 1 ? 's' : ''} total</p>
          </div>
          <Link to="/admin/products/new">
            <Button className="gap-2 rounded-full bg-primary text-white hover:bg-primary-hover">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mt-6 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, SKU, or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-sand bg-white py-2.5 pl-10 pr-4 text-sm text-espresso placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="mt-3 flex gap-2">
          {['ALL', 'AVAILABLE', 'UNAVAILABLE'].map((state) => (
            <button
              key={state}
              onClick={() => setAvailabilityFilter(state)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${availabilityFilter === state ? 'bg-primary text-white' : 'bg-cream text-muted-foreground hover:bg-sand'}`}
            >
              {state}
            </button>
          ))}
        </div>

        {/* Product List */}
        <div className="mt-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              {search ? 'No products match your search.' : 'No products yet. Add your first product!'}
            </div>
          ) : (
            filtered.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 rounded-xl border border-sand bg-white p-4 shadow-sm transition-colors hover:bg-cream/30"
              >
                {/* Thumbnail */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-sand bg-gradient-to-br from-sand to-cream">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={productService.getImageUrl(product.id, product.images[0].id)}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-primary/30" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-serif font-semibold text-espresso">{product.name}</h3>
                    <Badge variant="muted" className="text-xs">{product.category}</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    SKU: {product.sku} · ${Number(product.price).toFixed(2)} · Stock: {product.stockQuantity}
                  </p>
                </div>

                <Badge variant={product.availabilityStatus === 'AVAILABLE' ? 'success' : 'muted'} className="shrink-0">
                  {product.availabilityStatus || 'AVAILABLE'}
                </Badge>

                {/* Stock Indicator */}
                {product.stockQuantity <= 5 && (
                  <Badge variant="destructive" className="shrink-0">
                    {product.stockQuantity === 0 ? 'Out of Stock' : 'Low Stock'}
                  </Badge>
                )}

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  <Link to={`/admin/products/${product.id}/edit`}>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-muted-foreground hover:text-primary">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-2 text-xs text-muted-foreground hover:text-primary"
                    onClick={() => handleToggleAvailability(product)}
                    disabled={toggling === product.id}
                  >
                    {toggling === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : (product.availabilityStatus === 'AVAILABLE' ? 'Disable' : 'Enable')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(product.id)}
                    disabled={deleting === product.id}
                  >
                    {deleting === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
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

export default AdminProducts;
