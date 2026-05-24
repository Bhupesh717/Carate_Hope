// ============================================================
// Admin Panel TypeScript Types
// ============================================================

/** Admin user session */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  avatar: string;
}

/** Banner / hero slide */
export interface Banner {
  id: string;
  image: string;
  badge: string;
  title: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

/** Product category */
export interface AdminCategory {
  id: string;
  image: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  status: 'active' | 'inactive';
  createdAt: string;
}

/** Product */
export interface AdminProduct {
  id: string;
  images: string[];
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  discountPrice: number | null;
  stockQty: number;
  description: string;
  status: 'active' | 'inactive';
  isFeatured: boolean;
  createdAt: string;
}

/** Coupon / discount code */
export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

/** Order status enum */
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

/** Payment status */
export type PaymentStatus = 'paid' | 'unpaid' | 'refunded';

/** A single item inside an order */
export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

/** Order */
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
}

/** App user (customer) */
export interface AppUser {
  id: string;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  status: 'active' | 'inactive';
  orderCount: number;
  totalSpent: number;
}

// ============================================================
// Generic helpers for the data-table component
// ============================================================

export interface ColumnDef<T> {
  key: string;
  header: string;
  /** Return a ReactNode for custom rendering, or a string/number for plain text */
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDef {
  key: string;
  label: string;
  options: FilterOption[];
}
