import { mockProducts } from '../_data/products';
import { AdminProduct } from '../_types';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
let products = [...mockProducts];

export const productService = {
  getAll: async (): Promise<AdminProduct[]> => { await delay(); return [...products]; },
  getById: async (id: string): Promise<AdminProduct | undefined> => { await delay(); return products.find((p) => p.id === id); },
  create: async (data: Omit<AdminProduct, 'id' | 'createdAt'>): Promise<AdminProduct> => {
    await delay();
    const item: AdminProduct = { ...data, id: `prod-${Date.now()}`, createdAt: new Date().toISOString() };
    products = [item, ...products];
    return item;
  },
  update: async (id: string, data: Partial<AdminProduct>): Promise<AdminProduct> => {
    await delay();
    products = products.map((p) => (p.id === id ? { ...p, ...data } : p));
    return products.find((p) => p.id === id)!;
  },
  delete: async (id: string): Promise<void> => { await delay(); products = products.filter((p) => p.id !== id); },
  toggleStatus: async (id: string): Promise<AdminProduct> => {
    await delay();
    products = products.map((p) => p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p);
    return products.find((p) => p.id === id)!;
  },
  toggleFeatured: async (id: string): Promise<AdminProduct> => {
    await delay();
    products = products.map((p) => p.id === id ? { ...p, isFeatured: !p.isFeatured } : p);
    return products.find((p) => p.id === id)!;
  },
};
