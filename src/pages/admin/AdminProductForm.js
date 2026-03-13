import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import productService from '../../services/productService';
import { Loader2, Upload, X, ArrowLeft } from 'lucide-react';

const EMPTY_FORM = { name: '', description: '', sku: '', price: '', stockQuantity: '', category: '', availabilityStatus: 'AVAILABLE' };

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);       // existing images from API
  const [newFiles, setNewFiles] = useState([]);    // files selected for upload
  const [previews, setPreviews] = useState([]);    // preview URLs for newFiles
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Load existing product for edit mode
  useEffect(() => {
    if (!isEdit) return;
    const fetchProduct = async () => {
      try {
        const product = await productService.getById(id);
        setForm({
          name: product.name || '',
          description: product.description || '',
          sku: product.sku || '',
          price: product.price?.toString() || '',
          stockQuantity: product.stockQuantity?.toString() || '',
          category: product.category || '',
          availabilityStatus: product.availabilityStatus || 'AVAILABLE',
        });
        setImages(product.images || []);
      } catch (err) {
        console.error('Failed to load product:', err);
        alert('Product not found.');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEdit, navigate]);

  // Revoke preview URLs on unmount
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setNewFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeNewFile = (index) => {
    URL.revokeObjectURL(previews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId) => {
    try {
      await productService.deleteImage(id, imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error('Failed to delete image:', err);
      alert('Failed to delete image.');
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.sku.trim()) errs.sku = 'SKU is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Valid price is required';
    if (!form.stockQuantity || isNaN(Number(form.stockQuantity)) || Number(form.stockQuantity) < 0) errs.stockQuantity = 'Valid stock quantity is required';
    if (!form.category.trim()) errs.category = 'Category is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        sku: form.sku.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        availabilityStatus: form.availabilityStatus,
      };

      let productId = id;
      if (isEdit) {
        await productService.update(id, payload);
      } else {
        payload.stockQuantity = Number(form.stockQuantity);
        const created = await productService.create(payload);
        productId = created.id;
      }

      // Upload new images sequentially
      for (const file of newFiles) {
        await productService.uploadImage(productId, file);
      }

      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to save product:', err);
      const msg = err.response?.data?.message || 'Failed to save product. Please try again.';
      alert(msg);
    } finally {
      setSaving(false);
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
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
        <button
          onClick={() => navigate('/admin/products')}
          className="mb-4 flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary-hover"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </button>

        <h1 className="font-serif text-3xl font-bold text-espresso">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {isEdit ? 'Update product details and images' : 'Fill in the details to create a new product'}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Basic Info */}
          <div className="rounded-xl border border-sand bg-white p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-espresso">Product Details</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-espresso">Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${errors.name ? 'border-destructive' : 'border-sand'} bg-white px-4 py-2.5 text-sm text-espresso placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
                  placeholder="Product name"
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-espresso">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-sand bg-white px-4 py-2.5 text-sm text-espresso placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Product description"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-espresso">SKU *</label>
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${errors.sku ? 'border-destructive' : 'border-sand'} bg-white px-4 py-2.5 text-sm text-espresso placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
                  placeholder="e.g. PROD-001"
                />
                {errors.sku && <p className="mt-1 text-xs text-destructive">{errors.sku}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-espresso">Category *</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${errors.category ? 'border-destructive' : 'border-sand'} bg-white px-4 py-2.5 text-sm text-espresso placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
                  placeholder="e.g. Accessories"
                />
                {errors.category && <p className="mt-1 text-xs text-destructive">{errors.category}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-espresso">Price *</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${errors.price ? 'border-destructive' : 'border-sand'} bg-white px-4 py-2.5 text-sm text-espresso placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
                  placeholder="0.00"
                />
                {errors.price && <p className="mt-1 text-xs text-destructive">{errors.price}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-espresso">Stock Quantity *</label>
                <input
                  name="stockQuantity"
                  type="number"
                  min="0"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${errors.stockQuantity ? 'border-destructive' : 'border-sand'} bg-white px-4 py-2.5 text-sm text-espresso placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
                  placeholder="0"
                  disabled={isEdit}
                />
                {isEdit && <p className="mt-1 text-xs text-muted-foreground">Stock is managed by Inventory after creation.</p>}
                {errors.stockQuantity && <p className="mt-1 text-xs text-destructive">{errors.stockQuantity}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-espresso">Availability</label>
                <select
                  name="availabilityStatus"
                  value={form.availabilityStatus}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-sand bg-white px-4 py-2.5 text-sm text-espresso"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="UNAVAILABLE">UNAVAILABLE</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="rounded-xl border border-sand bg-white p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-espresso">Product Images</h2>
            <p className="mt-1 text-sm text-muted-foreground">Upload up to 5 images (JPEG, PNG, WebP, max 5MB each)</p>

            {/* Existing Images */}
            {images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((img) => (
                  <div key={img.id} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-sand">
                    <img
                      src={productService.getImageUrl(id, img.id)}
                      alt="Product"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.id)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New File Previews */}
            {previews.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {previews.map((url, idx) => (
                  <div key={idx} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-dashed border-primary/40">
                    <img src={url} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewFile(idx)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFilesSelected}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 flex items-center gap-2 rounded-lg border-2 border-dashed border-sand px-6 py-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Upload className="h-5 w-5" />
              Click to upload images
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/admin/products')}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-full bg-primary px-8 text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {saving ? (
                <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Saving…</span>
              ) : isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
