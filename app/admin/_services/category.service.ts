import { mockCategories } from '../_data/categories';
import { AdminCategory } from '../_types';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
let categories = [...mockCategories];

export const categoryService = {
  getAll: async (): Promise<AdminCategory[]> => { await delay(); return [...categories]; },
  getById: async (id: string): Promise<AdminCategory | undefined> => { await delay(); return categories.find((c) => c.id === id); },
  create: async (data: Omit<AdminCategory, 'id' | 'createdAt'>): Promise<AdminCategory> => {
    await delay();
    const item: AdminCategory = { ...data, id: `cat-${Date.now()}`, createdAt: new Date().toISOString() };
    categories = [item, ...categories];
    return item;
  },
  update: async (id: string, data: Partial<AdminCategory>): Promise<AdminCategory> => {
    await delay();
    categories = categories.map((c) => (c.id === id ? { ...c, ...data } : c));
    return categories.find((c) => c.id === id)!;
  },
  delete: async (id: string): Promise<void> => { await delay(); categories = categories.filter((c) => c.id !== id); },
  toggleStatus: async (id: string): Promise<AdminCategory> => {
    await delay();
    categories = categories.map((c) => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c);
    return categories.find((c) => c.id === id)!;
  },
};
