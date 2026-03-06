import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import productService from '../services/productService';
import { ShoppingCart, Check, Search, Loader2 } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      categoryName: product.category,
      image: product.images?.[0] ? productService.getImageUrl(product.id, product.images[0].id) : null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const imageUrl = product.images?.[0]
    ? productService.getImageUrl(product.id, product.images[0].id)
    : null;

  return (
    <div className="group overflow-hidden rounded-xl border border-sand bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sand to-cream">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl font-serif font-bold text-primary/20">{product.name}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-primary/0 transition-colors duration-200 group-hover:bg-primary/5" />
        </div>
      </Link>
      <div className="p-5">
        <Badge variant="secondary" className="mb-2 text-[10px]">{product.category}</Badge>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-serif text-lg font-semibold text-espresso transition-colors hover:text-primary">{product.name}</h3>
        </Link>
        <p className="mt-1 text-lg font-semibold text-espresso">${Number(product.price).toFixed(2)}</p>
        {product.stockQuantity <= 0 ? (
          <Badge variant="destructive" className="mt-3">Out of Stock</Badge>
        ) : (
          <Button onClick={handleAdd} variant="outline" className={`mt-3 w-full border-primary text-primary transition-all hover:bg-primary hover:text-white ${added ? 'bg-success border-success text-white hover:bg-success' : ''}`} size="sm">
            {added ? (
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4" /> Added</span>
            ) : (
              <span className="flex items-center gap-1.5"><ShoppingCart className="h-4 w-4" /> Add to Cart</span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['all', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Products — Orlando Prestige Italian Imports</title>
        <meta name="description" content="Browse our curated selection of premium Italian products — olive oils, artisan pastas, wines, truffles, and more. Sourced directly from Italian farms." />
        <meta property="og:title" content="Products — Orlando Prestige" />
        <meta property="og:description" content="Premium Italian products sourced directly from Italian farms and producers." />
        <link rel="canonical" href="/products" />
      </Helmet>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-espresso md:text-4xl">Our Products</h1>
          <p className="mt-1 text-muted-foreground">Browse our selection of premium Italian goods</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                className="rounded-full capitalize"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg text-muted-foreground">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;
