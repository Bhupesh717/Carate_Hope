import { mockOrders } from '../_data/orders';
import { Order, OrderStatus } from '../_types';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
let orders = [...mockOrders];

export const orderService = {
  getAll: async (): Promise<Order[]> => { await delay(); return [...orders]; },
  getById: async (id: string): Promise<Order | undefined> => { await delay(); return orders.find((o) => o.id === id); },
  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    await delay();
    orders = orders.map((o) => (o.id === id ? { ...o, orderStatus: status } : o));
    return orders.find((o) => o.id === id)!;
  },
};
