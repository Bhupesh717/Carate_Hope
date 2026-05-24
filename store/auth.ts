import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        // Mock delay for API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Mock successful login
        set({
          user: {
            id: 'u-1',
            name: email.split('@')[0],
            email: email,
            joinDate: new Date().toISOString(),
          },
          isAuthenticated: true,
        });
      },

      register: async (name, email, password) => {
        // Mock delay for API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock successful registration
        set({
          user: {
            id: 'u-2',
            name: name,
            email: email,
            joinDate: new Date().toISOString(),
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'caratehope-auth',
    }
  )
);
