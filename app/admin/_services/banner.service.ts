import { mockBanners } from '../_data/banners';
import { Banner } from '../_types';

// Simulate async API delay
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

let banners = [...mockBanners];

export const bannerService = {
  getAll: async (): Promise<Banner[]> => { await delay(); return [...banners]; },
  getById: async (id: string): Promise<Banner | undefined> => { await delay(); return banners.find((b) => b.id === id); },
  create: async (data: Omit<Banner, 'id' | 'createdAt'>): Promise<Banner> => {
    await delay();
    const newBanner: Banner = { ...data, id: `ban-${Date.now()}`, createdAt: new Date().toISOString() };
    banners = [newBanner, ...banners];
    return newBanner;
  },
  update: async (id: string, data: Partial<Banner>): Promise<Banner> => {
    await delay();
    banners = banners.map((b) => (b.id === id ? { ...b, ...data } : b));
    return banners.find((b) => b.id === id)!;
  },
  delete: async (id: string): Promise<void> => { await delay(); banners = banners.filter((b) => b.id !== id); },
  toggleStatus: async (id: string): Promise<Banner> => {
    await delay();
    banners = banners.map((b) => b.id === id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b);
    return banners.find((b) => b.id === id)!;
  },
};
