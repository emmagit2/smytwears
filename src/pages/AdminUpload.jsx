import React, { useState } from 'react';
import { Upload, X, Plus, ImagePlus, Tag, Layers, Ruler, FileText, CheckCircle } from 'lucide-react';
import { IMAGES } from '@/data/images';
import { productsApi } from '@/api/apiclient';

const CATEGORIES   = ['men', 'women', 'accessories', 'caps'];
const SIZES        = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const COLOR_OPTIONS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red',   hex: '#CC0000' },
  { name: 'Ash',   hex: '#6B7280' },
  { name: 'Navy',  hex: '#1E3A5F' },
  { name: 'Cream', hex: '#F5F5DC' },
];

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-background border border-border p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <h2 className="text-sm uppercase tracking-[0.2em] font-bold">{title}</h2>
    </div>
    {children}
  </div>
);

// Upload a single file directly to Cloudinary (browser → Cloudinary, no backend)
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'smyt/products');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || 'Cloudinary upload failed');
  }

  const data = await res.json();
  return { url: data.secure_url, key: data.public_id };
};

export default function AdminUpload() {
  const [imageFiles,     setImageFiles]     = useState([]);
  const [uploading,      setUploading]      = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [success,        setSuccess]        = useState(false);
  const [error,          setError]          = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes,  setSelectedSizes]  = useState([]);

  const [form, setForm] = useState({
    name: '', category: 'men', price: '', original_price: '',
    description: '', details: '', care: '', shipping: '',
    is_new: false, is_best_seller: false, in_stock: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [
      ...prev,
      ...files.map(file => ({ file, preview: URL.createObjectURL(file) })),
    ]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const toggleColor = (name) =>
    setSelectedColors(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]);

  const toggleSize = (size) =>
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);

  const resetForm = () => {
    setForm({
      name: '', category: 'men', price: '', original_price: '',
      description: '', details: '', care: '', shipping: '',
      is_new: false, is_best_seller: false, in_stock: true,
    });
    setImageFiles([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setUploadProgress('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      // Step 1: upload images directly to Cloudinary
      let uploadedImages = [];
      if (imageFiles.length > 0) {
        setUploadProgress(`Uploading ${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} to Cloudinary...`);
        uploadedImages = await Promise.all(
          imageFiles.map(({ file }) => uploadToCloudinary(file))
        );
      }

      // Step 2: create the product
      setUploadProgress('Saving product...');
      const response = await productsApi.create({
        name:           form.name,
        category:       form.category,
        price:          Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        description:    form.description,
        details:        form.details,
        care:           form.care,
        shipping:       form.shipping,
        colors:         selectedColors,
        sizes:          selectedSizes,
        is_new:         form.is_new,
        is_best_seller: form.is_best_seller,
        in_stock:       form.in_stock,
      });
      const product = response.data;

      // Step 3: send Cloudinary URLs to backend to save in DB
      if (uploadedImages.length > 0) {
        setUploadProgress('Saving image records...');
        await productsApi.saveImages(product.id, uploadedImages);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        resetForm();
      }, 3000);

    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Something went wrong.');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-green-50 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Product Uploaded!</h2>
        <p className="text-muted-foreground text-sm mt-2">Your product has been added to the store.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">

      {/* Brand header */}
      <div className="bg-foreground text-background px-6 py-4 flex items-center gap-4">
        <img src={IMAGES.logo} alt="SMYT" className="h-8 brightness-0 invert" />
        <div className="w-px h-8 bg-background/20" />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-background/50">Upload New</p>
          <p className="text-sm font-bold">Product</p>
        </div>
        <div className="ml-auto flex gap-1.5">
          <div className="w-3 h-3 bg-background" />
          <div className="w-3 h-3 bg-accent" />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Images */}
      <Section icon={ImagePlus} title="Product Images">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {imageFiles.map(({ preview }, i) => (
            <div key={i} className="relative aspect-square border border-border overflow-hidden">
              <img src={preview} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-foreground text-background flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-foreground text-background text-[10px] uppercase tracking-wider text-center py-1">
                  Main
                </span>
              )}
            </div>
          ))}
          <label className="aspect-square border-2 border-dashed border-border hover:border-foreground transition-colors flex flex-col items-center justify-center cursor-pointer">
            <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
            <Upload className="w-5 h-5 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground">Upload</span>
          </label>
        </div>
        {imageFiles.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">{imageFiles.length} image{imageFiles.length > 1 ? 's' : ''} selected — first image will be the main photo</p>
        )}
      </Section>

      {/* Basic Info */}
      <Section icon={Tag} title="Product Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wider font-medium mb-2">Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Self Starter Jogger — Black" className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium mb-2">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground bg-background">
              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium mb-2">Price (₦) *</label>
            <input name="price" value={form.price} onChange={handleChange} required type="number" placeholder="33000" className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium mb-2">Original Price (₦) <span className="normal-case text-muted-foreground">(optional)</span></label>
            <input name="original_price" value={form.original_price} onChange={handleChange} type="number" placeholder="38000" className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground" />
          </div>
          <div className="flex gap-6">
            {[
              { name: 'is_new',         label: 'New Arrival' },
              { name: 'is_best_seller', label: 'Best Seller' },
              { name: 'in_stock',       label: 'In Stock'    },
            ].map(opt => (
              <label key={opt.name} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name={opt.name} checked={form[opt.name]} onChange={handleChange} className="accent-foreground w-4 h-4" />
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </Section>

      {/* Colors */}
      <Section icon={Layers} title="Available Colors">
        <div className="flex flex-wrap gap-3">
          {COLOR_OPTIONS.map(color => (
            <button key={color.name} type="button" onClick={() => toggleColor(color.name)}
              className={`flex items-center gap-2 px-4 py-2 border-2 text-sm font-medium transition-colors ${
                selectedColors.includes(color.name) ? 'border-foreground bg-secondary' : 'border-border hover:border-foreground/40'
              }`}>
              <span className="w-4 h-4 border border-border flex-shrink-0" style={{ backgroundColor: color.hex }} />
              {color.name}
            </button>
          ))}
        </div>
      </Section>

      {/* Sizes */}
      <Section icon={Ruler} title="Available Sizes">
        <div className="flex flex-wrap gap-2">
          {SIZES.map(size => (
            <button key={size} type="button" onClick={() => toggleSize(size)}
              className={`px-4 py-2 text-sm font-medium border-2 transition-colors ${
                selectedSizes.includes(size) ? 'bg-foreground text-background border-foreground' : 'border-border hover:border-foreground/40'
              }`}>
              {size}
            </button>
          ))}
        </div>
      </Section>

      {/* Description */}
      <Section icon={FileText} title="Description & Details">
        <div className="space-y-4">
          {[
            { name: 'description', label: 'Product Description *', rows: 4, required: true, placeholder: 'Write a compelling product description...' },
            { name: 'details',     label: 'Product Details',        rows: 3, placeholder: 'Material, fit, features...' },
            { name: 'care',        label: 'Care Instructions',      rows: 2, placeholder: 'Machine wash cold...' },
            { name: 'shipping',    label: 'Shipping Info',          rows: 2, placeholder: 'Standard delivery: 3–5 business days...' },
          ].map(({ name, label, rows, required, placeholder }) => (
            <div key={name}>
              <label className="block text-xs uppercase tracking-wider font-medium mb-2">{label}</label>
              <textarea name={name} value={form[name]} onChange={handleChange} required={required} rows={rows}
                placeholder={placeholder}
                className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground resize-none" />
            </div>
          ))}
        </div>
      </Section>

      {/* Submit */}
      <div className="flex gap-3 pb-6 flex-col sm:flex-row">
        <button type="submit" disabled={uploading}
          className="flex items-center justify-center gap-2 bg-foreground text-background px-10 py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {uploading
            ? <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            : <Plus className="w-4 h-4" />}
          {uploading ? uploadProgress || 'Uploading...' : 'Upload Product'}
        </button>
        <button type="button" onClick={() => window.history.back()}
          className="border border-border px-8 py-4 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-muted transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}