import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import productService from '../services/productService';
import { ShoppingCart, Check, Minus, Plus, ChevronRight, Loader2 } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getById(id);
        setProduct(data);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-background">
        <div className="text-5xl">😕</div>
        <h2 className="mt-4 font-serif text-2xl font-bold text-espresso">Product Not Found</h2>
        <p className="mt-2 text-muted-foreground">The product you're looking for doesn't exist.</p>
        <Link to="/products">
          <Button className="mt-6 rounded-full bg-primary text-white hover:bg-primary-hover">Back to Products</Button>
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      categoryName: product.category,
      image: product.images?.[0] ? productService.getImageUrl(product.id, product.images[0].id) : null,
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleQuantity = (delta) => {
    setQuantity((q) => Math.max(1, q + delta));
  };

  const images = product.images || [];
  const currentImageUrl = images[selectedImage]
    ? productService.getImageUrl(product.id, images[selectedImage].id)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{product.name} — Orlando Prestige</title>
        <meta name="description" content={product.description || `Buy ${product.name} from Orlando Prestige. Premium Italian imports.`} />
        <meta property="og:title" content={`${product.name} — Orlando Prestige`} />
        <meta property="og:description" content={product.description || `Premium Italian product: ${product.name}`} />
        <link rel="canonical" href={`/products/${product.id}`} />
      </Helmet>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-primary">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/products" className="transition-colors hover:text-primary">Products</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-espresso">{product.name}</span>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image */}
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl border border-sand bg-gradient-to-br from-sand to-cream">
              {currentImageUrl ? (
                <img src={currentImageUrl} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-6xl font-serif font-bold text-primary/15">{product.name}</span>
                </div>
              )}
            </div>
            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(idx)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${idx === selectedImage ? 'border-primary' : 'border-sand'}`}
                  >
                    <img src={productService.getImageUrl(product.id, img.id)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <Badge variant="secondary" className="mb-3 w-fit">{product.category}</Badge>
            <h1 className="font-serif text-3xl font-bold text-espresso md:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">SKU: {product.sku}</p>
            <p className="mt-4 text-3xl font-semibold text-espresso">${Number(product.price).toFixed(2)}</p>

            {product.stockQuantity <= 0 ? (
              <Badge variant="destructive" className="mt-4 w-fit text-sm">Out of Stock</Badge>
            ) : (
              <>
                <p className="mt-2 text-sm text-accent">{product.stockQuantity} in stock</p>

                {/* Quantity Selector */}
                <div className="mt-8">
                  <label className="mb-2 block text-sm font-medium text-muted-foreground">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleQuantity(-1)} disabled={quantity <= 1}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-sand bg-white text-espresso transition-colors hover:bg-cream disabled:opacity-40">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-lg font-semibold text-espresso">{quantity}</span>
                    <button onClick={() => handleQuantity(1)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-sand bg-white text-espresso transition-colors hover:bg-cream">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                <Button onClick={handleAdd} size="lg"
                  className={`mt-8 w-full rounded-full font-semibold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:w-auto sm:px-12 ${
                    added ? 'bg-success text-white shadow-success/30 hover:bg-success' : 'bg-primary text-white shadow-primary/30 hover:bg-primary-hover'
                  }`}>
                  {added ? (
                    <span className="flex items-center gap-2"><Check className="h-5 w-5" /> Added to Cart</span>
                  ) : (
                    <span className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Add to Cart</span>
                  )}
                </Button>
              </>
            )}

            {/* Description */}
            <div className="mt-10 border-t border-sand pt-8">
              <h3 className="mb-3 font-serif text-lg font-semibold text-espresso">Description</h3>
              <p className="leading-relaxed text-muted-foreground">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
