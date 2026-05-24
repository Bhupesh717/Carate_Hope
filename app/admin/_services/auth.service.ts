// Auth service — currently returns mock data, swap to API calls later
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const authService = {
  login: async (email: string, password: string) => {
    await delay(800);
    if (email === 'admin@example.com' && password === 'admin123') {
      return { success: true, user: { id: 'admin-001', name: 'Admin', email, role: 'super_admin' as const, avatar: 'https://i.pravatar.cc/150?u=admin-001' } };
    }
    return { success: false, error: 'Invalid email or password' };
  },
  logout: async () => { await delay(); },
  getCurrentUser: async () => { await delay(); return null; },
};
