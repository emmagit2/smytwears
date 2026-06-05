import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, formatPrice, getProductImage } from '@/data/products';
import { productsApi } from '@/api/apiClient';
import {
  PlusCircle, Search, Pencil, Trash2, Eye, Package, X, Check,
  Loader2, AlertTriangle, Layers, Ruler, Tag, FileText,
  ImagePlus, Upload, ImageOff, GripVertical,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/* ── Constants ───────────────────────────────────────────────── */
const CATEGORIES_FILTER = ['all', 'men', 'women', 'accessories', 'caps'];
const CATEGORIES        = ['men', 'women', 'accessories', 'caps'];
const SIZES             = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size'];
const PRESET_COLORS = [
  { name: 'Black',  hex: '#000000' }, { name: 'White',  hex: '#FFFFFF' },
  { name: 'Red',    hex: '#CC0000' }, { name: 'Ash',    hex: '#6B7280' },
  { name: 'Navy',   hex: '#1E3A5F' }, { name: 'Cream',  hex: '#F5F5DC' },
  { name: 'Green',  hex: '#2D6A4F' }, { name: 'Yellow', hex: '#F4C430' },
  { name: 'Brown',  hex: '#7B4F2E' }, { name: 'Pink',   hex: '#E75480' },
  { name: 'Purple', hex: '#6B3FA0' }, { name: 'Orange', hex: '#E8631A' },
];
const colorHex = (name) =>
  PRESET_COLORS.find(c => c.name.toLowerCase() === name?.toLowerCase())?.hex ?? '#aaaaaa';

/* ── Cloudinary direct upload (no backend needed for images) ─── */
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

/* ── Section wrapper ─────────────────────────────────────────── */
const Section = ({ icon: Icon, title, children }) => (
  <div className="border border-border p-5">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-7 h-7 bg-foreground text-background flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <h3 className="text-xs uppercase tracking-[0.2em] font-bold">{title}</h3>
    </div>
    {children}
  </div>
);

/* ── Delete Confirmation Modal ───────────────────────────────── */
function DeleteModal({ product, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background border border-border w-full max-w-sm shadow-2xl">
        <div className="bg-red-600 text-white px-5 py-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs font-bold uppercase tracking-[0.18em]">Delete Product</span>
        </div>
        <div className="p-5">
          <p className="text-sm text-muted-foreground mb-1">You are about to permanently delete:</p>
          <p className="text-sm font-bold mb-2">"{product.name}"</p>
          <p className="text-xs text-red-600 font-medium mb-5">This action cannot be undone.</p>
          <div className="flex gap-2">
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 text-xs uppercase tracking-wider font-bold hover:bg-red-700 transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
              {loading ? 'Deleting…' : 'Yes, Delete'}
            </button>
            <button onClick={onCancel} disabled={loading}
              className="flex-1 border border-border py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-muted transition-colors disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Image item type ─────────────────────────────────────────── */
// { kind:'existing', data:{id,url,key,is_primary,sort_order} }
// { kind:'new',      file:File, preview:string }

/* ── Edit Modal ──────────────────────────────────────────────── */
function EditModal({ product, onSave, onClose, loading, error }) {
  const { data: fullProduct, isLoading: fetchingProduct } = useQuery({
    queryKey: ['product-edit', product.id],
    queryFn:  () => productsApi.get(product.id).then(r => r.data),
    staleTime: 0,
  });

  const [form, setForm] = useState({
    name:           product.name           ?? '',
    category:       product.category       ?? 'men',
    price:          product.price          ?? '',
    original_price: product.original_price ?? '',
    description:    product.description    ?? '',
    details:        product.details        ?? '',
    care:           product.care           ?? '',
    shipping:       product.shipping       ?? '',
    is_new:         product.is_new         ?? false,
    is_best_seller: product.is_best_seller ?? false,
    in_stock:       product.in_stock       ?? true,
  });

  const [imageItems,      setImageItems]      = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [imgUploading,    setImgUploading]    = useState(false);
  const [imgError,        setImgError]        = useState('');

  // ── Drag state ──
  // We use a ref for dragSrc to avoid stale closures inside event handlers.
  // dragOver is kept in state only for visual highlight.
  const dragSrcIndex = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const [selectedColors,  setSelectedColors]  = useState(
    (product.colors ?? []).map(n => ({ name: n, hex: colorHex(n) }))
  );
  const [selectedSizes,   setSelectedSizes]   = useState(product.sizes ?? []);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex,  setCustomColorHex]  = useState('#000000');

  /* Sync when full product loads */
  React.useEffect(() => {
    if (!fullProduct) return;
    setForm({
      name:           fullProduct.name           ?? '',
      category:       fullProduct.category       ?? 'men',
      price:          fullProduct.price          ?? '',
      original_price: fullProduct.original_price ?? '',
      description:    fullProduct.description    ?? '',
      details:        fullProduct.details        ?? '',
      care:           fullProduct.care           ?? '',
      shipping:       fullProduct.shipping       ?? '',
      is_new:         fullProduct.is_new         ?? false,
      is_best_seller: fullProduct.is_best_seller ?? false,
      in_stock:       fullProduct.in_stock       ?? true,
    });
    const sorted = [...(fullProduct.product_images ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );
    setImageItems(sorted.map(img => ({ kind: 'existing', data: img })));
    setSelectedColors((fullProduct.colors ?? []).map(n => ({ name: n, hex: colorHex(n) })));
    setSelectedSizes(fullProduct.sizes ?? []);
  }, [fullProduct]);

  /* ── Drag handlers ── */
  const handleDragStart = (e, index) => {
    dragSrcIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index)); // required for Firefox
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) setDragOverIndex(index);
  };

  const handleDrop = (e, toIndex) => {
    e.preventDefault();
    const fromIndex = dragSrcIndex.current;
    setDragOverIndex(null);
    dragSrcIndex.current = null;
    if (fromIndex === null || fromIndex === toIndex) return;

    setImageItems(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleDragEnd = () => {
    dragSrcIndex.current = null;
    setDragOverIndex(null);
  };

  const handleDragLeave = (e) => {
    // Only clear if leaving the grid entirely, not between children
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  /* ── Image add / remove ── */
  const handleImagePick = (e) => {
    const files = Array.from(e.target.files);
    const oversized = files.filter(f => f.size > 10 * 1024 * 1024);
    if (oversized.length) {
      setImgError(`${oversized.length} image(s) exceed the 10 MB limit.`);
      return;
    }
    setImgError('');
    setImageItems(prev => [
      ...prev,
      ...files.map(file => ({ kind: 'new', file, preview: URL.createObjectURL(file) })),
    ]);
    e.target.value = '';
  };

  const handleRemove = (item) => {
    if (item.kind === 'existing') {
      setRemovedImageIds(prev => [...prev, item.data.id]);
    } else {
      URL.revokeObjectURL(item.preview);
    }
    setImageItems(prev => prev.filter(i => i !== item));
  };

  /* ── Color / size helpers ── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const togglePresetColor = (color) =>
    setSelectedColors(prev =>
      prev.find(c => c.name === color.name)
        ? prev.filter(c => c.name !== color.name)
        : [...prev, color]
    );

  const addCustomColor = () => {
    const name = customColorName.trim();
    if (!name) return;
    if (selectedColors.find(c => c.name.toLowerCase() === name.toLowerCase())) return;
    setSelectedColors(prev => [...prev, { name, hex: customColorHex }]);
    setCustomColorName('');
    setCustomColorHex('#000000');
  };

  const toggleSize = (size) =>
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setImgError('');
    setImgUploading(true);

    try {
      // 1. Delete removed images via backend
      for (const imgId of removedImageIds) {
        await productsApi.deleteImage(product.id, imgId);
      }

      // 2. Upload new images to Cloudinary directly, then save URLs via backend
      const newItems = imageItems.filter(i => i.kind === 'new');
      if (newItems.length > 0) {
        const formData = new FormData();
        newItems.forEach(({ file }) => formData.append('images', file));
        formData.append('is_primary', removedImageIds.length === imageItems.filter(i => i.kind === 'existing').length ? 'true' : 'false');
        await productsApi.uploadImages(product.id, formData);
      }

      // 3. Update product fields
      onSave({
        ...form,
        price:          Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        colors:         selectedColors.map(c => c.name),
        sizes:          selectedSizes,
      });
    } catch (err) {
      setImgError(err?.message || 'Image update failed.');
    } finally {
      setImgUploading(false);
    }
  };

  const isBusy   = loading || imgUploading;
  const newCount = imageItems.filter(i => i.kind === 'new').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background border border-border w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="bg-foreground text-background px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-background/50">Editing Product</p>
            <p className="text-sm font-bold truncate max-w-sm">{product.name}</p>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-background/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">

          {(error || imgError) && (
            <div className="border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm flex items-center justify-between">
              <span>{error || imgError}</span>
              <button type="button" onClick={() => setImgError('')}><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* ── Images ── */}
          <Section icon={ImagePlus} title="Product Images">
            {fetchingProduct ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square bg-muted animate-pulse border border-border" />
                ))}
              </div>
            ) : (
              <>
                {imageItems.length > 1 && (
                  <p className="text-[10px] text-muted-foreground mb-2 flex items-center gap-1">
                    <GripVertical className="w-3 h-3" /> Drag to reorder · First image = main
                  </p>
                )}

                {/* ── Image grid — drag container ── */}
                <div
                  className="grid grid-cols-3 sm:grid-cols-4 gap-3"
                  onDragLeave={handleDragLeave}
                >
                  {imageItems.length === 0 && (
                    <div className="col-span-3 sm:col-span-4 flex flex-col items-center justify-center py-6 border border-dashed border-border text-muted-foreground gap-2">
                      <ImageOff className="w-6 h-6 opacity-40" />
                      <p className="text-xs">No images yet — upload below</p>
                    </div>
                  )}

                  {imageItems.map((item, i) => {
                    const isExisting = item.kind === 'existing';
                    const src        = isExisting ? item.data.url : item.preview;
                    const isMain     = i === 0;
                    const isDragging = dragSrcIndex.current === i;
                    const isTarget   = dragOverIndex === i && !isDragging;

                    return (
                      <div
                        key={isExisting ? `ex-${item.data.id}` : `new-${item.preview}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, i)}
                        onDragOver={(e)  => handleDragOver(e, i)}
                        onDrop={(e)      => handleDrop(e, i)}
                        onDragEnd={handleDragEnd}
                        className={[
                          'relative aspect-square overflow-hidden group select-none',
                          'cursor-grab active:cursor-grabbing',
                          'transition-all duration-150',
                          isExisting ? 'border border-border' : 'border-2 border-dashed border-blue-400',
                          isMain     ? 'ring-2 ring-foreground ring-offset-1' : '',
                          /* ── Visual feedback during drag ── */
                          isDragging ? 'opacity-30 scale-95'  : '',
                          isTarget   ? 'ring-2 ring-blue-500 ring-offset-1 scale-[1.03] bg-blue-50' : 'bg-muted',
                        ].filter(Boolean).join(' ')}
                      >
                        <img
                          src={src}
                          alt={`Product image ${i + 1}`}
                          draggable={false}
                          className="w-full h-full object-cover pointer-events-none"
                          onError={e => { e.currentTarget.style.display = 'none'; }}
                        />

                        {/* Grip handle */}
                        <div className="absolute top-1 right-1 bg-black/50 text-white rounded p-0.5 pointer-events-none opacity-60">
                          <GripVertical className="w-3 h-3" />
                        </div>

                        {/* New badge */}
                        {!isExisting && (
                          <span className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] uppercase tracking-wider px-1.5 py-0.5 pointer-events-none">
                            New
                          </span>
                        )}

                        {/* Main badge */}
                        {isMain && (
                          <span className="absolute bottom-0 left-0 right-0 bg-foreground text-background text-[9px] uppercase tracking-wider text-center py-0.5 pointer-events-none">
                            Main
                          </span>
                        )}

                        {/* Hover remove */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Upload tile */}
                  <label className="aspect-square border-2 border-dashed border-border hover:border-foreground transition-colors flex flex-col items-center justify-center cursor-pointer">
                    <input type="file" accept="image/*" multiple onChange={handleImagePick} className="hidden" />
                    <Upload className="w-5 h-5 text-muted-foreground mb-1.5" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Add Photo</span>
                  </label>
                </div>

                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">
                    {imageItems.length} image{imageItems.length !== 1 ? 's' : ''}
                    {newCount > 0 && <span className="text-blue-600"> · {newCount} new</span>}
                    {removedImageIds.length > 0 && <span className="text-red-500"> · {removedImageIds.length} to remove</span>}
                  </p>
                </div>
              </>
            )}
          </Section>

          {/* ── Product Info ── */}
          <Section icon={Tag} title="Product Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider font-medium mb-2">Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium mb-2">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground bg-background">
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium mb-2">Price (₦) *</label>
                <input name="price" value={form.price} onChange={handleChange} required type="number"
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium mb-2">
                  Original Price (₦) <span className="normal-case font-normal text-muted-foreground">(optional)</span>
                </label>
                <input name="original_price" value={form.original_price} onChange={handleChange} type="number"
                  className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground" />
              </div>
              <div className="flex gap-5 items-center sm:col-span-2">
                {[
                  { name: 'is_new',         label: 'New Arrival' },
                  { name: 'is_best_seller', label: 'Best Seller' },
                  { name: 'in_stock',       label: 'In Stock'    },
                ].map(opt => (
                  <label key={opt.name} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name={opt.name} checked={form[opt.name]} onChange={handleChange}
                      className="accent-foreground w-4 h-4" />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </Section>

          {/* ── Colors ── */}
          <Section icon={Layers} title="Available Colors">
            <p className="text-xs uppercase tracking-wider font-medium mb-3">Quick Select</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {PRESET_COLORS.map(color => {
                const isSelected = !!selectedColors.find(c => c.name === color.name);
                return (
                  <button key={color.name} type="button" title={color.name}
                    onClick={() => togglePresetColor(color)}
                    className={[
                      'w-8 h-8 rounded-full border-2 transition-all duration-150',
                      isSelected ? 'border-foreground scale-110 shadow-md ring-2 ring-foreground/20' : 'border-transparent hover:border-foreground/40 hover:scale-105',
                      color.name === 'White' ? '!border-border' : '',
                    ].join(' ')}
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>

            <p className="text-xs uppercase tracking-wider font-medium mb-3">Custom Color</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative group">
                <input type="color" value={customColorHex} onChange={e => setCustomColorHex(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="w-10 h-10 rounded border-2 border-border group-hover:border-foreground transition-colors flex items-center justify-center"
                  style={{ backgroundColor: customColorHex }}>
                  <span className="text-[9px] font-bold mix-blend-difference text-white select-none">▼</span>
                </div>
              </div>
              <input type="text" value={customColorName} onChange={e => setCustomColorName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
                placeholder="Color name (e.g. Olive, Sand…)"
                className="flex-1 border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground" />
              <button type="button" onClick={addCustomColor}
                className="border border-border px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-muted transition-colors whitespace-nowrap">
                + Add
              </button>
            </div>

            <p className="text-xs uppercase tracking-wider font-medium mb-2">
              Selected{selectedColors.length > 0 ? ` (${selectedColors.length})` : ''}
            </p>
            {selectedColors.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedColors.map(color => (
                  <div key={color.name}
                    className="flex items-center gap-2 px-3 py-1.5 border-2 border-foreground bg-secondary text-sm font-medium">
                    <span className="w-3.5 h-3.5 rounded-full border border-border flex-shrink-0"
                      style={{ backgroundColor: color.hex }} />
                    {color.name}
                    <button type="button"
                      onClick={() => setSelectedColors(prev => prev.filter(c => c.name !== color.name))}
                      className="ml-1 hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No colors selected yet.</p>
            )}
          </Section>

          {/* ── Sizes ── */}
          <Section icon={Ruler} title="Available Sizes">
            <div className="flex flex-wrap gap-2">
              {SIZES.map(size => (
                <button key={size} type="button" onClick={() => toggleSize(size)}
                  className={`px-4 py-2 text-sm font-medium border-2 transition-colors ${
                    selectedSizes.includes(size)
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border hover:border-foreground/40'
                  }`}>
                  {size}
                </button>
              ))}
            </div>
          </Section>

          {/* ── Description ── */}
          <Section icon={FileText} title="Description & Details">
            <div className="space-y-4">
              {[
                { name: 'description', label: 'Product Description *', rows: 3, required: true },
                { name: 'details',     label: 'Product Details',        rows: 2 },
                { name: 'care',        label: 'Care Instructions',      rows: 2 },
                { name: 'shipping',    label: 'Shipping Info',          rows: 2 },
              ].map(({ name, label, rows, required }) => (
                <div key={name}>
                  <label className="block text-xs uppercase tracking-wider font-medium mb-2">{label}</label>
                  <textarea name={name} value={form[name]} onChange={handleChange}
                    required={required} rows={rows}
                    className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground resize-none" />
                </div>
              ))}
            </div>
          </Section>

          {/* ── Actions ── */}
          <div className="flex gap-3 pt-1 pb-2">
            <button type="submit" disabled={isBusy || fetchingProduct}
              className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-3.5 text-xs uppercase tracking-[0.18em] font-bold hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {imgUploading ? 'Uploading images…' : loading ? 'Saving…' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} disabled={isBusy}
              className="border border-border px-8 py-3.5 text-xs uppercase tracking-wider font-semibold hover:bg-muted transition-colors disabled:opacity-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main AdminProducts ──────────────────────────────────────── */
export default function AdminProducts() {
  const [query,          setQuery]          = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editProduct,    setEditProduct]    = useState(null);
  const [deleteProduct,  setDeleteProduct]  = useState(null);
  const [editError,      setEditError]      = useState('');
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn:  () => fetchProducts({ limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteProduct(null);
    },
    onError: (err) => {
      alert(err?.response?.data?.error || err?.message || 'Delete failed.');
      setDeleteProduct(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => productsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product-edit'] });
      setEditProduct(null);
      setEditError('');
    },
    onError: (err) => {
      setEditError(err?.response?.data?.error || err?.message || 'Update failed.');
    },
  });

  const filtered = products.filter(p => {
    const matchQuery = p.name.toLowerCase().includes(query.toLowerCase());
    const matchCat   = categoryFilter === 'all' || p.category === categoryFilter;
    return matchQuery && matchCat;
  });

  return (
    <div className="space-y-6">

      {/* Toolbar */}
      <div className="bg-background border border-border p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..."
              className="w-full border border-border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-foreground" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES_FILTER.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-2 text-xs uppercase tracking-wider font-semibold transition-colors ${
                  categoryFilter === cat ? 'bg-foreground text-background' : 'border border-border hover:bg-muted'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <Link to="/admin/upload"
          className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-xs uppercase tracking-wider font-bold hover:bg-foreground/90 transition-colors whitespace-nowrap">
          <PlusCircle className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-background border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground">Product</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground hidden sm:table-cell">Category</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground">Price</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground hidden md:table-cell">Status</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-sm">Loading products...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-sm">No products found.</td></tr>
            ) : filtered.map(product => {
              const imageUrl = getProductImage(product);
              return (
                <tr key={product.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 border border-border overflow-hidden flex-shrink-0 bg-secondary flex items-center justify-center">
                        {imageUrl ? (
                          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover"
                            onError={e => { e.target.style.display = 'none'; }} />
                        ) : (
                          <Package className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm leading-tight">{product.name}</p>
                        <div className="flex gap-1 mt-1">
                          {product.is_new && <span className="text-[10px] bg-foreground text-background px-1.5 py-0.5 uppercase tracking-wider font-semibold">New</span>}
                          {product.is_best_seller && <span className="text-[10px] bg-secondary border border-border text-foreground px-1.5 py-0.5 uppercase tracking-wider font-semibold">Best Seller</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium capitalize">{product.category}</span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold">{formatPrice(product.price)}</p>
                    {product.original_price && <p className="text-xs text-muted-foreground line-through">{formatPrice(product.original_price)}</p>}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className={`text-xs px-2.5 py-1 font-semibold uppercase tracking-wider ${product.in_stock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/product/${product.id}`}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button onClick={() => { setEditError(''); setEditProduct(product); }}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteProduct(product)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} products</p>

      {editProduct && (
        <EditModal
          product={editProduct}
          onSave={(payload) => { setEditError(''); updateMutation.mutate({ id: editProduct.id, payload }); }}
          onClose={() => { setEditProduct(null); setEditError(''); }}
          loading={updateMutation.isPending}
          error={editError}
        />
      )}

      {deleteProduct && (
        <DeleteModal
          product={deleteProduct}
          onConfirm={() => deleteMutation.mutate(deleteProduct.id)}
          onCancel={() => setDeleteProduct(null)}
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}