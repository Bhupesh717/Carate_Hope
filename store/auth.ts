import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  phone?: string;
  permanentAddress?: string;
  shippingAddress?: string;
}

interface AuthState {
  user: User | null;
  customerToken: string | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    phone: string;
    password: string;
    email?: string;
    shipping_address?: string;
    permanent_address?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    name: string;
    email?: string;
    phone?: string;
    permanentAddress?: string;
    shippingAddress?: string;
  }) => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const mapUser = (u: any): User => ({
  id: String(u.id),
  name: u.name,
  email: u.email || '',
  joinDate: u.created_at || new Date().toISOString(),
  phone: u.phone,
  permanentAddress: u.permanent_address || '',
  shippingAddress: u.shipping_address || '',
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      customerToken: null,
      isAuthenticated: false,

      login: async (phone, password) => {
        try {
          const response = await apiClient.post('/public/login', {
            phone,
            password,
          });

          if (response.data && response.data.success) {
            const { token, user } = response.data.data;
            set({
              user: mapUser(user),
              customerToken: token,
              isAuthenticated: true,
            });
          } else {
            throw new Error(response.data?.message || 'Login failed');
          }
        } catch (error: any) {
          throw new Error(error.response?.data?.message || error.message || 'Login failed');
        }
      },

      register: async (data) => {
        try {
          const response = await apiClient.post('/public/register', data);

          if (response.data && response.data.success) {
            const { token, user } = response.data.data;
            set({
              user: mapUser(user),
              customerToken: token,
              isAuthenticated: true,
            });
          } else {
            throw new Error(response.data?.message || 'Registration failed');
          }
        } catch (error: any) {
          throw new Error(error.response?.data?.message || error.message || 'Registration failed');
        }
      },

      logout: async () => {
        try {
          if (get().customerToken) {
            await apiClient.post('/public/logout');
          }
        } catch (error) {
          console.error('Customer logout API call failed:', error);
        } finally {
          set({ user: null, customerToken: null, isAuthenticated: false });
        }
      },

      updateProfile: async (data) => {
        try {
          const response = await apiClient.put('/public/profile', {
            name: data.name,
            email: data.email,
            shipping_address: data.shippingAddress,
            permanent_address: data.permanentAddress,
          });

          if (response.data && response.data.success) {
            const updatedUser = response.data.data;
            set({
              user: mapUser(updatedUser),
            });
          } else {
            throw new Error(response.data?.message || 'Failed to update profile');
          }
        } catch (error: any) {
          throw new Error(error.response?.data?.message || error.message || 'Failed to update profile');
        }
      },

      fetchProfile: async () => {
        try {
          if (!get().customerToken) return;
          const response = await apiClient.get('/public/profile');
          if (response.data && response.data.success) {
            set({
              user: mapUser(response.data.data),
              isAuthenticated: true,
            });
          }
        } catch (error) {
          console.error('Error fetching customer profile:', error);
          set({ user: null, customerToken: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'caratehope-auth',
    }
  )
);
