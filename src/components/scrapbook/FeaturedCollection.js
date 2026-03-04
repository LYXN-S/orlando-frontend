import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import productService from '../../services/productService';

const rotations = [
  '-rotate-2',
  'rotate-1',
  '-rotate-1',
  'rotate-2',
  'rotate-1',
  '-rotate-2',
];

const ProductPolaroid = ({ product, rotation }) => {
  const imageUrl = product.images?.[0]
    ? productService.getImageUrl(product.id, product.images[0].id)
    : null;

  return (
    <Link
      to={`/products/${product.id}`}
      className={`group inline-block bg-white p-3 pb-10 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${rotation}`}
      style={{
        boxShadow:
          '3px 4px 14px rgba(45,31,20,0.12), 0 1px 3px rgba(45,31,20,0.08)',
      }}
    >
      {/* Product image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-linen to-aged-paper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-serif text-3xl font-bold text-primary/15">
              {product.name}
            </span>
          </div>
        )}
      </div>

      {/* Handwritten label */}
      <div className="mt-2 text-center">
        <p className="font-handwritten text-base text-espresso/70 group-hover:text-espresso">
          {product.name}
        </p>
        <p className="font-handwritten text-sm text-terracotta">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>

      {/* Decorative pin */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
        <div className="h-4 w-4 rounded-full bg-terracotta/70 shadow-md">
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60" />
        </div>
      </div>
    </Link>
  );
};

const FeaturedCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data.slice(0, 6));
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Cork board background */}
      <div
        className="absolute inset-0 bg-kraft/20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(196,167,125,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(196,167,125,0.1) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")
          `,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section heading */}
        <div className="mb-16 text-center">
          <p className="font-handwritten text-xl text-terracotta">
            hand-picked for you
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-espresso md:text-5xl">
            Featured Collection
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-kraft" />
            <div className="h-1.5 w-1.5 rotate-45 bg-terracotta/40" />
            <div className="h-px w-16 bg-kraft" />
          </div>
        </div>

        {/* Product polaroids grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-handwritten text-xl text-espresso/40">
              Our collection is being curated...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-3 lg:gap-12">
            {products.map((product, i) => (
              <div key={product.id} className="relative flex justify-center">
                <ProductPolaroid
                  product={product}
                  rotation={rotations[i % rotations.length]}
                />
              </div>
            ))}
          </div>
        )}

        {/* View all link */}
        <div className="mt-16 text-center">
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 rounded-sm bg-white/80 px-6 py-3 font-handwritten text-lg text-primary shadow-md transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
          >
            View All Products
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
