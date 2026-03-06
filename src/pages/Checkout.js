import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import orderService from '../services/orderService';
import billingService from '../services/billingService';
import {
  ArrowLeft,
  Building2,
  User,
  Loader2,
  ShoppingBag,
  FileText,
  ChevronDown,
} from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, cartCount, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [billingType, setBillingType] = useState('PERSONAL');
  const [billingForm, setBillingForm] = useState({
    billingName: '',
    billingTin: '',
    billingAddress: '',
    billingTerms: '',
  });
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState('new');
  const [submitting, setSubmitting] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [error, setError] = useState('');

  // Load saved billing profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profiles = await billingService.getMyProfiles();
        setSavedProfiles(profiles);
        // Pre-fill with default profile if exists
        const defaultProfile = profiles.find((p) => p.isDefault) || profiles[0];
        if (defaultProfile) {
          setSelectedProfileId(String(defaultProfile.id));
          setBillingType(defaultProfile.billingType);
          setBillingForm({
            billingName: defaultProfile.name,
            billingTin: defaultProfile.tin || '',
            billingAddress: defaultProfile.address,
            billingTerms: defaultProfile.paymentTerms,
          });
        }
      } catch (err) {
        console.error('Failed to load billing profiles:', err);
      } finally {
        setLoadingProfiles(false);
      }
    };
    fetchProfiles();
  }, []);

  const handleProfileSelect = (profileId) => {
    setSelectedProfileId(profileId);
    if (profileId === 'new') {
      setBillingForm({ billingName: '', billingTin: '', billingAddress: '', billingTerms: '' });
      return;
    }
    const profile = savedProfiles.find((p) => String(p.id) === profileId);
    if (profile) {
      setBillingType(profile.billingType);
      setBillingForm({
        billingName: profile.name,
        billingTin: profile.tin || '',
        billingAddress: profile.address,
        billingTerms: profile.paymentTerms,
      });
    }
  };

  const handleBillingTypeToggle = (type) => {
    setBillingType(type);
    // Reset TIN when switching to personal
    if (type === 'PERSONAL') {
      setBillingForm((prev) => ({ ...prev, billingTin: '' }));
    }
  };

  const handleChange = (e) => {
    setBillingForm({ ...billingForm, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!billingForm.billingName.trim()) return 'Name is required';
    if (billingType === 'COMPANY' && !billingForm.billingTin.trim()) return 'TIN is required for company billing';
    if (!billingForm.billingAddress.trim()) return 'Address is required';
    if (!billingForm.billingTerms.trim()) return 'Payment terms are required';
    return null;
  };

  const handlePlaceOrder = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      await orderService.submitOrder(cartItems, {
        billingType,
        billingName: billingForm.billingName,
        billingTin: billingForm.billingTin || null,
        billingAddress: billingForm.billingAddress,
        billingTerms: billingForm.billingTerms,
        billingProfileId: selectedProfileId !== 'new' ? Number(selectedProfileId) : null,
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Redirect if cart is empty
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
            Add some items to your cart before checking out.
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
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary-hover"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
        </div>
        <h1 className="mt-4 font-serif text-3xl font-bold text-espresso md:text-4xl">
          Checkout
        </h1>
        <p className="mt-1 text-muted-foreground">
          Complete your billing details to place your order
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Billing Details Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Saved Profiles Selector */}
            {!loadingProfiles && savedProfiles.length > 0 && (
              <div className="rounded-xl border border-sand bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-espresso">
                  <FileText className="h-5 w-5 text-primary" />
                  Saved Billing Profiles
                </h3>
                <div className="mt-4 relative">
                  <select
                    value={selectedProfileId}
                    onChange={(e) => handleProfileSelect(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-sand bg-white px-4 py-2.5 pr-10 text-sm text-espresso focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {savedProfiles.map((profile) => (
                      <option key={profile.id} value={String(profile.id)}>
                        {profile.billingType === 'COMPANY' ? '🏢' : '👤'}{' '}
                        {profile.name}
                        {profile.isDefault ? ' (Default)' : ''}
                      </option>
                    ))}
                    <option value="new">+ Enter new details</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            )}

            {/* Billing Type Toggle */}
            <div className="rounded-xl border border-sand bg-white p-6 shadow-sm">
              <h3 className="font-serif text-lg font-semibold text-espresso">
                Billing Details
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Select your billing type and fill in the required details
              </p>

              {/* Toggle */}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleBillingTypeToggle('PERSONAL')}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    billingType === 'PERSONAL'
                      ? 'bg-primary text-white shadow-md shadow-primary/30'
                      : 'bg-cream text-muted-foreground hover:bg-sand'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Personal
                </button>
                <button
                  type="button"
                  onClick={() => handleBillingTypeToggle('COMPANY')}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    billingType === 'COMPANY'
                      ? 'bg-primary text-white shadow-md shadow-primary/30'
                      : 'bg-cream text-muted-foreground hover:bg-sand'
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  Company
                </button>
              </div>

              {/* Form Fields */}
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="billingName" className="text-espresso">
                    {billingType === 'COMPANY' ? 'Registered Name' : 'Name'}
                  </Label>
                  <Input
                    id="billingName"
                    name="billingName"
                    placeholder={
                      billingType === 'COMPANY'
                        ? 'Company registered name'
                        : 'Your full name'
                    }
                    value={billingForm.billingName}
                    onChange={handleChange}
                    className="border-sand focus-visible:ring-primary"
                    required
                  />
                </div>

                {billingType === 'COMPANY' && (
                  <div className="space-y-2">
                    <Label htmlFor="billingTin" className="text-espresso">
                      TIN
                    </Label>
                    <Input
                      id="billingTin"
                      name="billingTin"
                      placeholder="Tax Identification Number"
                      value={billingForm.billingTin}
                      onChange={handleChange}
                      className="border-sand focus-visible:ring-primary"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="billingAddress" className="text-espresso">
                    {billingType === 'COMPANY' ? 'Business Address' : 'Billing Address'}
                  </Label>
                  <Input
                    id="billingAddress"
                    name="billingAddress"
                    placeholder={
                      billingType === 'COMPANY'
                        ? 'Company business address'
                        : 'Your billing address'
                    }
                    value={billingForm.billingAddress}
                    onChange={handleChange}
                    className="border-sand focus-visible:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingTerms" className="text-espresso">
                    Terms (of payment)
                  </Label>
                  <Input
                    id="billingTerms"
                    name="billingTerms"
                    placeholder="e.g., Net 30, COD, etc."
                    value={billingForm.billingTerms}
                    onChange={handleChange}
                    className="border-sand focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-sand bg-white p-6 shadow-sm">
              <h3 className="font-serif text-lg font-semibold text-espresso">
                Order Summary
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {cartCount} item{cartCount !== 1 ? 's' : ''}
              </p>

              {/* Items */}
              <div className="mt-4 space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-espresso">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="ml-4 shrink-0 font-semibold text-espresso">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
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

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                onClick={handlePlaceOrder}
                disabled={submitting}
                size="lg"
                className="mt-6 w-full rounded-full bg-primary font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Placing Order…
                  </span>
                ) : (
                  'Place Order'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
