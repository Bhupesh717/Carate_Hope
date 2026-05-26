import { adminApiClient } from '@/lib/api-client';
import { AdminProduct } from '../_types';

const mapProduct = (p: any): AdminProduct => {
  const imgs = p.product_images || [];
  // Sort images so primary is first
  const sortedImgs = [...imgs].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
  const images = sortedImgs.map((img: any) => img.image_path);
  
  return {
    id: String(p.id),
    images: images.length ? images : [''],
    name: p.name,
    sku: p.sku,
    categoryId: String(p.category_id),
    price: Number(p.price),
    discountPrice: p.discount_price ? Number(p.discount_price) : null,
    stockQty: Number(p.stock_qty),
    description: p.description || '',
    status: p.status,
    isFeatured: Boolean(p.is_featured),
    createdAt: p.created_at,
  };
};

export const productService = {
  getAll: async (): Promise<AdminProduct[]> => {
    const response = await adminApiClient.get('/admin/products');
    return (response.data.data || []).map(mapProduct);
  },

  getById: async (id: string): Promise<AdminProduct | undefined> => {
    const response = await adminApiClient.get(`/admin/products/${id}`);
    if (response.data && response.data.success) {
      return mapProduct(response.data.data);
    }
    return undefined;
  },

  create: async (data: Omit<AdminProduct, 'id' | 'createdAt'>): Promise<AdminProduct> => {
    const payload = {
      name: data.name,
      sku: data.sku,
      category_id: Number(data.categoryId),
      price: data.price,
      discount_price: data.discountPrice,
      stock_qty: data.stockQty,
      description: data.description,
      images: data.images,
    };
    const response = await adminApiClient.post('/admin/products', payload);
    return mapProduct(response.data.data);
  },

  update: async (id: string, data: Partial<AdminProduct>): Promise<AdminProduct> => {
    const payload = {
      name: data.name,
      sku: data.sku,
      category_id: data.categoryId ? Number(data.categoryId) : undefined,
      price: data.price,
      discount_price: data.discountPrice,
      stock_qty: data.stockQty,
      description: data.description,
      images: data.images,
    };
    const response = await adminApiClient.put(`/admin/products/${id}`, payload);
    return mapProduct(response.data.data);
  },

  delete: async (id: string): Promise<void> => {
    await adminApiClient.delete(`/admin/products/${id}`);
  },

  toggleStatus: async (id: string): Promise<AdminProduct> => {
    const response = await adminApiClient.patch(`/admin/products/${id}/toggle-status`);
    return mapProduct(response.data.data);
  },

  toggleFeatured: async (id: string): Promise<AdminProduct> => {
    const response = await adminApiClient.patch(`/admin/products/${id}/toggle-featured`);
    return mapProduct(response.data.data);
  },
};
