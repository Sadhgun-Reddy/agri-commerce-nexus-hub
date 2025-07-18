// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
}

// Product Types
export interface Category {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  website_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  sku: string;
  category: Category;
  brand: Brand;
  stock_quantity: number;
  image_url?: string;
  is_active: boolean;
  is_featured: boolean;
  weight?: number;
  dimensions?: string;
  warranty_period?: number;
  created_at: string;
  updated_at: string;
  rating?: number;
  review_count?: number;
}

export interface ProductReview {
  id: string;
  product: string;
  user: User;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  product: Product;
  user: string;
  created_at: string;
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: string;
  user: string;
  items: CartItem[];
  total_amount: number;
  created_at: string;
  updated_at: string;
}

// Order Types
export interface Order {
  id: string;
  user: User;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ShippingAddress {
  id: string;
  full_name: string;
  phone_number: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Request Types
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category: string; // Category ID
  brand: string; // Brand ID
  stock_quantity: number;
  image_url?: string;
  weight?: number;
  dimensions?: string;
  warranty_period?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  image_url?: string;
}

export interface CreateBrandRequest {
  name: string;
  description: string;
  logo_url?: string;
  website_url?: string;
}

export interface CreateReviewRequest {
  product: string;
  rating: number;
  comment: string;
}

export interface CreateOrderRequest {
  items: Array<{
    product: string;
    quantity: number;
  }>;
  shipping_address: Omit<ShippingAddress, 'id' | 'is_default'>;
}

export interface AddToCartRequest {
  product: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Error Types
export interface ApiError {
  message: string;
  details?: Record<string, string[]>;
  status?: number;
} 