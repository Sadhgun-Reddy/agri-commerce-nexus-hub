import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Import API services
import authService from '@/services/authService';
import productsService from '@/services/productsService';
import cartService from '@/services/cartService';
import ordersService from '@/services/ordersService';

// Import types
import type {
  User,
  Product,
  Category,
  Brand,
  CartItem as ApiCartItem,
  Order as ApiOrder,
  LoginRequest,
  RegisterRequest,
} from '@/types/api';

// Frontend interfaces for compatibility
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
  inStock: boolean;
}

interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface LegacyProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  sku: string;
  discount?: number;
  inStock: boolean;
  badge?: string;
  brand: string;
}

interface AppUser {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
}

interface AppContextType {
  // Cart state
  cartItems: CartItem[];
  addToCart: (product: any) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  cartCount: number;
  clearCart: () => Promise<void>;
  
  // User state
  user: AppUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Orders
  orders: Order[];
  placeOrder: (shippingAddress: any) => Promise<string>;
  getUserOrders: (userId: string) => Order[];
  
  // Products state
  products: LegacyProduct[];
  categories: Category[];
  brands: Brand[];
  loading: boolean;
  error: string | null;
  
  // Product functions
  loadProducts: (params?: any) => Promise<void>;
  loadCategories: () => Promise<void>;
  loadBrands: () => Promise<void>;
  
  // Admin functionality
  updateProduct: (product: LegacyProduct) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addProduct: (product: Omit<LegacyProduct, 'id'>) => Promise<void>;
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<AppUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<LegacyProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Helper function to convert API Product to LegacyProduct
  const convertProduct = (apiProduct: Product): LegacyProduct => ({
    id: apiProduct.id,
    name: apiProduct.name,
    price: apiProduct.price,
    originalPrice: apiProduct.original_price,
    rating: apiProduct.rating || 0,
    reviews: apiProduct.review_count || 0,
    image: apiProduct.image_url || "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: apiProduct.category.name,
    sku: apiProduct.sku,
    discount: apiProduct.original_price ? Math.round(((apiProduct.original_price - apiProduct.price) / apiProduct.original_price) * 100) : undefined,
    inStock: apiProduct.stock_quantity > 0,
    badge: apiProduct.is_featured ? "Featured" : undefined,
    brand: apiProduct.brand.name,
  });

  // Helper function to convert API CartItem to CartItem
  const convertCartItem = (apiCartItem: ApiCartItem): CartItem => ({
    id: apiCartItem.id,
    name: apiCartItem.product.name,
    price: apiCartItem.product.price,
    quantity: apiCartItem.quantity,
    image: apiCartItem.product.image_url || "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    sku: apiCartItem.product.sku,
    inStock: apiCartItem.product.stock_quantity > 0,
  });

  // Load functions
  const loadCategories = async () => {
    try {
      setError(null);
      const categoriesData = await productsService.getCategories();
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error: any) {
      console.error('Failed to load categories:', error);
      setCategories([]); // Ensure categories is always an array
      setError(error.message);
    }
  };

  const loadBrands = async () => {
    try {
      setError(null);
      const brandsData = await productsService.getBrands();
      setBrands(Array.isArray(brandsData) ? brandsData : []);
    } catch (error: any) {
      console.error('Failed to load brands:', error);
      setBrands([]); // Ensure brands is always an array
      setError(error.message);
    }
  };

  const loadProducts = async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsService.getProducts(params);
      const convertedProducts = Array.isArray(response?.results) ? response.results.map(convertProduct) : [];
      setProducts(convertedProducts);
    } catch (error: any) {
      console.error('Failed to load products:', error);
      setProducts([]); // Ensure products is always an array
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserCart = async () => {
    if (!user) return;
    
    try {
      const cart = await cartService.getCart();
      const convertedItems = cart.items.map(convertCartItem);
      setCartItems(convertedItems);
    } catch (error: any) {
      console.error('Failed to load cart:', error);
      // Fallback to local cart if API fails
      const guestCart = cartService.getLocalCart();
      setCartItems(guestCart.map(convertCartItem));
    }
  };

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for stored user
        if (authService.isAuthenticated()) {
          try {
            const currentUser = await authService.getCurrentUser();
            setUser({
              id: currentUser.id,
              email: currentUser.email,
              name: `${currentUser.first_name} ${currentUser.last_name}`.trim(),
              isAdmin: currentUser.is_staff,
            });
          } catch (error) {
            console.error('Failed to get current user:', error);
            authService.clearStoredUser();
          }
        }

        // Load initial data with graceful error handling
        try {
          await loadCategories();
        } catch (error) {
          console.warn('Categories failed to load:', error);
        }
        
        try {
          await loadBrands();
        } catch (error) {
          console.warn('Brands failed to load:', error);
        }
        
        try {
          await loadProducts();
        } catch (error) {
          console.warn('Products failed to load:', error);
          setError('Unable to connect to backend. Please make sure the backend server is running.');
        }
      } catch (error) {
        console.error('App initialization failed:', error);
        setError('App initialization failed. Please refresh the page.');
      }
    };

    initializeApp();
  }, []);

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadUserCart();
    } else {
      // Load guest cart from localStorage
      const guestCart = cartService.getLocalCart();
      setCartItems(guestCart.map(convertCartItem));
    }
  }, [user]);

  // Cart functions
  const addToCart = async (product: any) => {
    try {
      if (user) {
        // Add to server cart
        await cartService.addToCart({
          product: product.id,
          quantity: 1,
        });
        await loadUserCart();
      } else {
        // Add to local cart
        cartService.addToLocalCart(product, 1);
        const guestCart = cartService.getLocalCart();
        setCartItems(guestCart.map(convertCartItem));
      }

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      if (user) {
        // Update server cart
        await cartService.updateCartItem(id, { quantity });
        await loadUserCart();
      } else {
        // Update local cart
        cartService.updateLocalCartItem(id, quantity);
        const guestCart = cartService.getLocalCart();
        setCartItems(guestCart.map(convertCartItem));
      }
    } catch (error: any) {
      console.error('Failed to update quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      if (user) {
        // Remove from server cart
        await cartService.removeFromCart(id);
        await loadUserCart();
      } else {
        // Remove from local cart
        cartService.removeFromLocalCart(id);
        const guestCart = cartService.getLocalCart();
        setCartItems(guestCart.map(convertCartItem));
      }

      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    } catch (error: any) {
      console.error('Failed to remove from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        // Clear server cart
        await cartService.clearCart();
      } else {
        // Clear local cart
        cartService.clearLocalCart();
      }
    setCartItems([]);
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    }
  };

  // Auth functions
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password });
      const { user: apiUser } = response;
      
      setUser({
        id: apiUser.id,
        email: apiUser.email,
        name: `${apiUser.first_name} ${apiUser.last_name}`.trim(),
        isAdmin: apiUser.is_staff,
      });

      // Sync local cart with server if needed
      const localCart = cartService.getLocalCart();
      if (localCart.length > 0) {
        try {
          const cartItems = localCart.map(item => ({
            product: item.product.id,
            quantity: item.quantity,
          }));
          await cartService.syncCart(cartItems);
          cartService.clearLocalCart();
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      }

      await loadUserCart();

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });

      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      const response = await authService.register(userData);
      const { user: apiUser } = response;
      
    setUser({
        id: apiUser.id,
        email: apiUser.email,
        name: `${apiUser.first_name} ${apiUser.last_name}`.trim(),
        isAdmin: apiUser.is_staff,
      });

      await loadUserCart();

      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });

    return true;
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    setUser(null);
      setCartItems([]);
      authService.clearStoredUser();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error('Logout failed:', error);
    }
  };

  // Admin functions
  const updateProduct = async (product: LegacyProduct) => {
    try {
      // This would need proper conversion from LegacyProduct to API format
      toast({
        title: "Feature not implemented",
        description: "Product update functionality coming soon.",
        variant: "destructive",
      });
    } catch (error: any) {
      console.error('Failed to update product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productsService.deleteProduct(id);
      await loadProducts();
      
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted.",
      });
    } catch (error: any) {
      console.error('Failed to delete product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const addProduct = async (product: Omit<LegacyProduct, 'id'>) => {
    try {
      // This would need proper conversion from LegacyProduct to API format
      toast({
        title: "Feature not implemented",
        description: "Product creation functionality coming soon.",
        variant: "destructive",
      });
    } catch (error: any) {
      console.error('Failed to add product:', error);
    }
  };

  const placeOrder = async (shippingAddress: any): Promise<string> => {
    try {
      const orderItems = cartItems.map(item => ({
        product: item.id,
        quantity: item.quantity,
      }));

      const orderData = {
        items: orderItems,
        shipping_address: shippingAddress,
      };

      const order = await ordersService.createOrder(orderData);
      await clearCart();
      
      toast({
        title: "Order placed!",
        description: "Your order has been successfully placed.",
      });

      return order.id;
    } catch (error: any) {
      console.error('Failed to place order:', error);
      toast({
        title: "Order failed",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getUserOrders = (userId: string): Order[] => {
    // This should be replaced with actual API call
    return orders.filter(order => order.userId === userId);
  };

  const getAllOrders = (): Order[] => {
    return orders;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await ordersService.updateOrderStatus(orderId, status);
      
      toast({
        title: "Order updated",
        description: "Order status has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const isLoggedIn = !!user;

  const value: AppContextType = {
    // Cart state
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      cartCount,
      clearCart,

    // User state
      user,
    isLoggedIn,
      login,
    register,
      logout,

    // Search state
      searchQuery,
      setSearchQuery,

    // Orders
      orders,
      placeOrder,
      getUserOrders,

    // Products state
      products,
    categories,
    brands,
    loading,
    error,

    // Product functions
    loadProducts,
    loadCategories,
    loadBrands,

    // Admin functionality
      updateProduct,
      deleteProduct,
      addProduct,
      getAllOrders,
    updateOrderStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
