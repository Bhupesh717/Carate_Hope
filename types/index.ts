export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating?: number;
  reviews?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {
  addedAt: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}
