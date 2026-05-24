'use client';

import React, { useEffect, useState } from 'react';
import {
  Package, Layers3, ShoppingCart, Users, TicketPercent, DollarSign,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { StatsCard } from './_components/stats-card';
import { StatusBadge } from './_components/status-badge';
import { DataTableSkeleton } from './_components/data-table-skeleton';
import { mockProducts } from './_data/products';
import { mockCategories } from './_data/categories';
import { mockOrders } from './_data/orders';
import { mockUsers } from './_data/users';
import { mockCoupons } from './_data/coupons';
import { format } from 'date-fns';

/* ---------- mock chart data ---------- */
const revenueData = [
  { month: 'Jan', revenue: 12400 }, { month: 'Feb', revenue: 18200 },
  { month: 'Mar', revenue: 15800 }, { month: 'Apr', revenue: 21500 },
  { month: 'May', revenue: 19300 }, { month: 'Jun', revenue: 24100 },
  { month: 'Jul', revenue: 22000 }, { month: 'Aug', revenue: 26800 },
  { month: 'Sep', revenue: 23500 }, { month: 'Oct', revenue: 28900 },
  { month: 'Nov', revenue: 31200 }, { month: 'Dec', revenue: 35000 },
];

const orderStatusCounts = [
  { name: 'Pending', value: mockOrders.filter((o) => o.orderStatus === 'pending').length },
  { name: 'Processing', value: mockOrders.filter((o) => o.orderStatus === 'processing').length },
  { name: 'Shipped', value: mockOrders.filter((o) => o.orderStatus === 'shipped').length },
  { name: 'Delivered', value: mockOrders.filter((o) => o.orderStatus === 'delivered').length },
  { name: 'Cancelled', value: mockOrders.filter((o) => o.orderStatus === 'cancelled').length },
];
const PIE_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'];

const totalRevenue = mockOrders
  .filter((o) => o.paymentStatus === 'paid')
  .reduce((s, o) => s + o.totalAmount, 0);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const recentOrders = [...mockOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back — here&#39;s what&#39;s happening with your store.</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard title="Products" value={mockProducts.length} icon={<Package className="h-5 w-5" />} trend={{ value: 8.2, label: 'vs last month' }} />
        <StatsCard title="Categories" value={mockCategories.length} icon={<Layers3 className="h-5 w-5" />} />
        <StatsCard title="Orders" value={mockOrders.length} icon={<ShoppingCart className="h-5 w-5" />} trend={{ value: 12.5, label: 'vs last month' }} />
        <StatsCard title="Users" value={mockUsers.length} icon={<Users className="h-5 w-5" />} trend={{ value: 5.1, label: 'vs last month' }} />
        <StatsCard title="Coupons" value={mockCoupons.length} icon={<TicketPercent className="h-5 w-5" />} />
        <StatsCard title="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} trend={{ value: 18.3, label: 'vs last month' }} />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold">Revenue Overview</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1, 25 95% 53%))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1, 25 95% 53%))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#b97a57" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order status pie */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold">Orders by Status</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={orderStatusCounts} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                  {orderStatusCounts.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Recent Orders</h2>
        {loading ? (
          <DataTableSkeleton columns={5} rows={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Order ID</th>
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Customer</th>
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Amount</th>
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">Status</th>
                  <th className="pb-2 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-2.5 pr-4 font-mono text-xs">{order.id}</td>
                    <td className="py-2.5 pr-4">{order.customerName}</td>
                    <td className="py-2.5 pr-4">₹{order.totalAmount.toLocaleString()}</td>
                    <td className="py-2.5 pr-4"><StatusBadge status={order.orderStatus} /></td>
                    <td className="py-2.5 text-muted-foreground">{format(new Date(order.createdAt), 'dd MMM yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
