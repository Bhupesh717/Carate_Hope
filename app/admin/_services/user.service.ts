import { mockUsers } from '../_data/users';
import { AppUser } from '../_types';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
let users = [...mockUsers];

export const userService = {
  getAll: async (): Promise<AppUser[]> => { await delay(); return [...users]; },
  getById: async (id: string): Promise<AppUser | undefined> => { await delay(); return users.find((u) => u.id === id); },
  delete: async (id: string): Promise<void> => { await delay(); users = users.filter((u) => u.id !== id); },
  toggleStatus: async (id: string): Promise<AppUser> => {
    await delay();
    users = users.map((u) => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u);
    return users.find((u) => u.id === id)!;
  },
};
