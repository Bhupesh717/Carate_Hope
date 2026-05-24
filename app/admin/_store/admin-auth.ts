'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser } from '../_types';

/** Mock admin credentials */
const MOCK_ADMIN: AdminUser = {
  id: 'admin-001',
  name: 'Admin',
  email: 'admin@example.com',
  role: 'super_admin',
  avatar: 'https://i.pravatar.cc/150?u=admin-001',
};

const MOCK_PASSWORD = 'admin123';

interface AdminAuthState {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      adminUser: null,
      isAdminAuthenticated: false,

      adminLogin: async (email, password) => {
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 800));
        if (email === MOCK_ADMIN.email && password === MOCK_PASSWORD) {
          set({ adminUser: MOCK_ADMIN, isAdminAuthenticated: true });
          return { success: true };
        }
        return { success: false, error: 'Invalid email or password' };
      },

      adminLogout: () => {
        set({ adminUser: null, isAdminAuthenticated: false });
      },
    }),
    { name: 'caratehope-admin-auth' }
  )
);
