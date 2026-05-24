import { mockCoupons } from '../_data/coupons';
import { Coupon } from '../_types';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
let coupons = [...mockCoupons];

export const couponService = {
  getAll: async (): Promise<Coupon[]> => { await delay(); return [...coupons]; },
  getById: async (id: string): Promise<Coupon | undefined> => { await delay(); return coupons.find((c) => c.id === id); },
  create: async (data: Omit<Coupon, 'id' | 'createdAt' | 'usageCount'>): Promise<Coupon> => {
    await delay();
    const item: Coupon = { ...data, id: `cpn-${Date.now()}`, usageCount: 0, createdAt: new Date().toISOString() };
    coupons = [item, ...coupons];
    return item;
  },
  update: async (id: string, data: Partial<Coupon>): Promise<Coupon> => {
    await delay();
    coupons = coupons.map((c) => (c.id === id ? { ...c, ...data } : c));
    return coupons.find((c) => c.id === id)!;
  },
  delete: async (id: string): Promise<void> => { await delay(); coupons = coupons.filter((c) => c.id !== id); },
  toggleStatus: async (id: string): Promise<Coupon> => {
    await delay();
    coupons = coupons.map((c) => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c);
    return coupons.find((c) => c.id === id)!;
  },
};
