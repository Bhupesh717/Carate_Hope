'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff, Pencil, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable, DTColumn, DTFilter } from '../_components/data-table';
import { FormModal } from '../_components/form-modal';
import { ConfirmDialog } from '../_components/confirm-dialog';
import { DetailModal } from '../_components/detail-modal';
import { ImageUpload } from '../_components/image-upload';
import { MultiImageUpload } from '../_components/multi-image-upload';
import { productService } from '../_services/product.service';
import { categoryService } from '../_services/category.service';
import { AdminProduct, AdminCategory } from '../_types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const emptyForm = { 
  images: [''] as string[], 
  name: '', 
  sku: '', 
  categoryId: '', 
  price: 0, 
  discountPrice: null as number | null, 
  stockQty: 0, 
  description: '', 
  status: 'active' as 'active' | 'inactive', 
  isFeatured: false 
};

export default function ProductsPage() {
  const [data, setData] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewItem, setViewItem] = useState<AdminProduct | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [prods, cats] = await Promise.all([productService.getAll(), categoryService.getAll()]);
    setData(prods); 
    setCategories(cats); 
    setLoading(false);
  }, []);

  useEffect(() => { 
    load(); 
  }, [load]);

  const catName = (id: string) => categories.find((c) => c.id === id)?.name || '—';
  
  const openAdd = () => { 
    setEditing(null); 
    setForm(emptyForm); 
    setFormOpen(true); 
  };

  const openEdit = (p: AdminProduct) => { 
    setEditing(p); 
    setForm({ 
      images: p.images.length ? p.images : [''], 
      name: p.name, 
      sku: p.sku, 
      categoryId: p.categoryId, 
      price: p.price, 
      discountPrice: p.discountPrice, 
      stockQty: p.stockQty, 
      description: p.description, 
      status: p.status, 
      isFeatured: p.isFeatured 
    }); 
    setFormOpen(true); 
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (!form.sku.trim()) { toast.error('SKU is required'); return; }
    if (form.price <= 0) { toast.error('Price must be > 0'); return; }
    setSaving(true);
    const payload = { 
      ...form, 
      images: form.images.filter(Boolean),
      status: editing ? form.status : 'active', // default to active on create
    };
    if (editing) { 
      await productService.update(editing.id, payload); 
      toast.success('Product updated'); 
    } else { 
      await productService.create(payload); 
      toast.success('Product created'); 
    }
    setSaving(false); 
    setFormOpen(false); 
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true); 
    await productService.delete(deleteTarget.id); 
    toast.success('Product deleted'); 
    setDeleting(false); 
    setDeleteTarget(null); 
    load();
  };

  const handleToggle = async (p: AdminProduct) => {
    await productService.toggleStatus(p.id);
    toast.success(`Product is now ${p.status === 'active' ? 'inactive' : 'active'}`);
    load();
  };

  const columns: DTColumn<AdminProduct>[] = [
    { 
      key: 'images', 
      header: 'Image', 
      render: (r) => r.images[0] ? <img src={r.images[0]} alt="" className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-muted" /> 
    },
    { 
      key: 'name', 
      header: 'Name' 
    },
    { 
      key: 'sku', 
      header: 'SKU', 
      className: 'hidden md:table-cell font-mono text-xs' 
    },
    { 
      key: 'categoryId', 
      header: 'Category', 
      render: (r) => catName(r.categoryId), 
      className: 'hidden lg:table-cell' 
    },
    { 
      key: 'price', 
      header: 'Price', 
      render: (r) => (
        <div>
          <span className={r.discountPrice ? 'line-through text-muted-foreground text-xs' : ''}>₹{r.price.toLocaleString()}</span>
          {r.discountPrice && <span className="ml-1 text-emerald-600 font-medium">₹{r.discountPrice.toLocaleString()}</span>}
        </div>
      )
    },
    { 
      key: 'stockQty', 
      header: 'Stock', 
      render: (r) => <span className={r.stockQty === 0 ? 'text-destructive font-medium' : ''}>{r.stockQty}</span>, 
      className: 'hidden md:table-cell' 
    },
    { 
      key: 'isFeatured', 
      header: '★', 
      render: (r) => r.isFeatured ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> : null, 
      className: 'hidden lg:table-cell' 
    },
    { 
      key: 'status', 
      header: 'Status', 
      render: (r) => (
        <button
          onClick={() => handleToggle(r)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer select-none",
            r.status === 'active'
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80"
              : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100/80"
          )}
          title={`Click to make ${r.status === 'active' ? 'inactive' : 'active'}`}
        >
          {r.status === 'active' ? (
            <>
              <Eye className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
              <span>Active</span>
            </>
          ) : (
            <>
              <EyeOff className="h-3.5 w-3.5 text-zinc-400" />
              <span>Inactive</span>
            </>
          )}
        </button>
      ) 
    },
  ];

  const filters: DTFilter[] = [
    { 
      key: 'status', 
      label: 'Status', 
      options: [
        { label: 'Active', value: 'active' }, 
        { label: 'Inactive', value: 'inactive' }
      ] 
    },
    { 
      key: 'categoryId', 
      label: 'Category', 
      options: categories.map((c) => ({ label: c.name, value: c.id })) 
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="text-sm text-muted-foreground">Manage your jewelry product catalog.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading} 
        filters={filters} 
        searchKeys={['name', 'sku']} 
        onAdd={openAdd} 
        addLabel="Add Product"
        actions={(row) => (
          <>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewItem(row)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(row)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      />

      <FormModal 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        title={editing ? 'Edit Product' : 'Add Product'} 
        onSubmit={handleSave} 
        loading={saving}
      >
        <ImageUpload 
          value={form.images[0] || ''} 
          onChange={(v) => setForm({ ...form, images: [v, ...form.images.slice(1)] })} 
          label="Primary Image" 
          dimensions="800x800px" 
        />
        
        <MultiImageUpload
          values={form.images.slice(1)}
          onChange={(urls) => setForm({ ...form, images: [form.images[0] || '', ...urls] })}
          label="Product Gallery"
          maxImages={5}
          dimensions="800x800px"
        />

        <div className="space-y-2">
          <Label>Name *</Label>
          <Input 
            placeholder="e.g. Diamond Stud Earrings"
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>SKU *</Label>
            <Input 
              placeholder="e.g. CH-EAR-007"
              value={form.sku} 
              onChange={(e) => setForm({ ...form, sku: e.target.value })} 
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={form.categoryId || '__none__'} 
              onValueChange={(v) => setForm({ ...form, categoryId: v === '__none__' ? '' : v })}
            >
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Price (₹) *</Label>
            <Input 
              type="number" 
              min={0} 
              value={form.price} 
              onChange={(e) => setForm({ ...form, price: +e.target.value })} 
            />
          </div>
          <div className="space-y-2">
            <Label>Discount Price</Label>
            <Input 
              type="number" 
              min={0} 
              value={form.discountPrice ?? ''} 
              onChange={(e) => setForm({ ...form, discountPrice: e.target.value ? +e.target.value : null })} 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Stock Quantity</Label>
          <Input 
            type="number" 
            min={0} 
            value={form.stockQty} 
            onChange={(e) => setForm({ ...form, stockQty: +e.target.value })} 
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea 
            placeholder="Describe the product details..."
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
            rows={3} 
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Label>Featured Product</Label>
            <Switch 
              checked={form.isFeatured} 
              onCheckedChange={(c) => setForm({ ...form, isFeatured: c })} 
            />
          </div>
        </div>
      </FormModal>

      <ConfirmDialog 
        open={!!deleteTarget} 
        onOpenChange={() => setDeleteTarget(null)} 
        title={`Delete "${deleteTarget?.name}"?`} 
        description="This product will be permanently removed." 
        onConfirm={handleDelete} 
        loading={deleting} 
      />

      {viewItem && (
        <DetailModal 
          open={!!viewItem} 
          onOpenChange={() => setViewItem(null)} 
          title="Product Details"
          fields={[
            { 
              label: 'Images', 
              value: viewItem.images && viewItem.images.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {viewItem.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt="" 
                      className={cn(
                        "rounded-md object-cover border",
                        idx === 0 ? "h-16 w-16 border-primary ring-2 ring-primary/20" : "h-12 w-12 opacity-80"
                      )} 
                      title={idx === 0 ? "Primary Image" : `Gallery Image ${idx}`}
                    />
                  ))}
                </div>
              ) : '—' 
            },
            { label: 'Name', value: viewItem.name },
            { label: 'SKU', value: <code className="font-mono text-sm">{viewItem.sku}</code> },
            { label: 'Category', value: catName(viewItem.categoryId) },
            { label: 'Price', value: `₹${viewItem.price.toLocaleString()}` },
            { label: 'Discount Price', value: viewItem.discountPrice ? `₹${viewItem.discountPrice.toLocaleString()}` : '—' },
            { label: 'Stock', value: viewItem.stockQty },
            { label: 'Featured', value: viewItem.isFeatured ? 'Yes' : 'No' },
            { 
              label: 'Status', 
              value: (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-semibold uppercase",
                  viewItem.status === 'active' ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-800"
                )}>
                  {viewItem.status}
                </span>
              ) 
            },
            { label: 'Description', value: viewItem.description || '—' },
            { label: 'Created', value: format(new Date(viewItem.createdAt), 'dd MMM yyyy') },
          ]}
        />
      )}
    </div>
  );
}
