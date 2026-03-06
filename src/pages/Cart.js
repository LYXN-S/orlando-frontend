import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Lock } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center gap-4 py-4">
      {/* Thumbnail */}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-sand bg-gradient-to-br from-sand to-cream">
        <div className="flex h-full items-center justify-center">
          <span className="text-xs font-serif font-bold text-primary/20">
            {item.name}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${item.id}`}
          className="font-serif text-base font-semibold text-espresso transition-colors hover:text-primary"
        >
          {item.name}
        </Link>
        <p className="mt-0.5 text-sm text-muted-foreground">{item.categoryName}</p>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-sand bg-white text-espresso transition-colors hover:bg-cream"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-8 text-center text-sm font-semibold text-espresso">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-sand bg-white text-espresso transition-colors hover:bg-cream"
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Price */}
      <div className="w-24 text-right">
        <p className="font-semibold text-espresso">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        {item.quantity > 1 && (
          <p className="text-xs text-muted-foreground">
            ${item.price.toFixed(2)} each
          </p>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive"
        aria-label="Remove item"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } =
    useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/cart');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cream">
            <ShoppingBag className="h-12 w-12 text-primary/40" />
          </div>
          <h2 className="mt-6 font-serif text-2xl font-bold text-espresso">
            Your Cart is Empty
          </h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Looks like you haven't added any products yet. Explore our collection and find something you love.
          </p>
          <Link to="/products">
            <Button className="mt-6 rounded-full bg-primary px-8 text-white hover:bg-primary-hover">
              Browse Products
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <h1 className="font-serif text-3xl font-bold text-espresso md:text-4xl">
          Your Cart
        </h1>
        <p className="mt-1 text-muted-foreground">
          {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-sand bg-white p-6 shadow-sm">
              {cartItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <CartItem
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                  {index < cartItems.length - 1 && <Separator className="bg-sand" />}
                </React.Fragment>
              ))}
            </div>

            <Link
              to="/products"
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary-hover"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-sand bg-white p-6 shadow-sm">
              <h3 className="font-serif text-lg font-semibold text-espresso">
                Order Summary
              </h3>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-espresso">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-xs text-muted-foreground">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <Separator className="my-4 bg-sand" />

              <div className="flex justify-between">
                <span className="font-serif text-lg font-semibold text-espresso">
                  Total
                </span>
                <span className="text-lg font-bold text-espresso">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <Button
                onClick={handleCheckout}
                size="lg"
                className="mt-6 w-full rounded-full bg-primary font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-xl"
              >
                Proceed to Checkout
              </Button>

              {!user && (
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  <span>You'll need to log in to complete your order</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
