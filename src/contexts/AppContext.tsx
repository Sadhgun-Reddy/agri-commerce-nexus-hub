// contexts/AppContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface CartItem {
  id: number;
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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface Product { // Export Product interface for use in other components
  id: number;
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
  // Add any other fields your API returns
}

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
  // Add other user properties as needed based on your API response
}

interface AppContextType {
  // Cart state
  cartItems: CartItem[];
  addToCart: (product: any) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  cartCount: number;
  clearCart: () => void;

  // User state
  user: User | null;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  login: (email: string, password: string, token?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;

  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (shippingAddress: any) => string;
  getUserOrders: (userId: string) => Order[];

  // Admin functionality (keeping these for now, might need adjustment based on API)
  products: Product[];
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Product fetching state
  isProductsLoading: boolean;
  productsError: string | null;
  fetchProducts: () => Promise<void>; // Expose fetch function if needed elsewhere
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// API base URL - using your tunnel URL
const API_BASE_URL = "https://p62fbn3v-5000.inc1.devtunnels.ms"; // Ensure no trailing space

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Product state
  const [products, setProducts] = useState<Product[]>([]); // Start with empty array
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Load cart from localStorage on mount (moved inside useState initializer above)
  // useEffect for saving cart is kept below

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch products from API
  const fetchProducts = async () => {
    setIsProductsLoading(true);
    setProductsError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      // Assuming the API returns an array of products directly
      // Adjust the data access (e.g., response.data.products) if your API structure is different
      setProducts(response.data);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load products';
      setProductsError(errorMessage);
    } finally {
      setIsProductsLoading(false);
    }
  };

  // Initialize auth state and fetch products on app load
  useEffect(() => {
    const initializeApp = async () => {
      // Initialize Auth
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          await fetchUserDetails(token);
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          // Clear invalid token
          localStorage.removeItem('authToken');
        }
      }
      setIsAuthLoading(false);

      // Fetch Products
      await fetchProducts();
    };

    initializeApp();
  }, []); // Empty dependency array means this runs once on mount

  // Fetch user details using token
  const fetchUserDetails = async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const userData = response.data.user;
      setUser({
        id: userData.id || userData._id, // Handle both id and _id
        email: userData.email,
        name: userData.name || userData.username || 'User',
        isAdmin: userData.isAdmin || userData.role === 'admin' || false
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  };

  const addToCart = (product: any) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        sku: product.sku,
        inStock: product.inStock
      }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const login = async (email: string, password: string, token?: string): Promise<boolean> => {
    try {
      let actualToken = token;

      // If no token provided, authenticate with credentials
      if (!actualToken) {
        const response = await axios.post(`${API_BASE_URL}/api/auth/signin`, {
          email,
          password
        });

        actualToken = response.data.token; // Adjust based on your API response structure
      }

      if (actualToken) {
        localStorage.setItem('authToken', actualToken);
        await fetchUserDetails(actualToken);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      logout(); // Clear any partial state

      // Show specific error message if available
      const errorMessage = error.response?.data?.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    // Implement Google login logic
    // This is a placeholder - implement based on your Google auth flow
    try {
      // Your Google auth implementation here
      // After successful Google login, you should get a token
      // Then call fetchUserDetails with that token
      setUser({
        id: 'google-1',
        email: 'user@gmail.com',
        name: 'Google User',
        isAdmin: false
      });
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('authToken');
    if (token && user) {
      try {
        await fetchUserDetails(token);
      } catch (error) {
        console.error('Error refreshing user:', error);
        logout();
      }
    }
  };

  const placeOrder = (shippingAddress: any): string => {
    const orderId = `ORDER-${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      userId: user?.id || '',
      items: [...cartItems],
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress
    };
    setOrders(prev => [...prev, newOrder]);
    clearCart();
    return orderId;
  };

  const getUserOrders = (userId: string): Order[] => {
    return orders.filter(order => order.userId === userId);
  };

  const getAllOrders = (): Order[] => {
    return orders;
  };

  // Note: These admin functions still use local state. If you want full backend integration,
  // you'll need to make API calls for add/update/delete product operations as well.
  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = Math.max(...products.map(p => p.id), 0) + 1; // Handle empty products array
    setProducts(prev => [...prev, { ...newProduct, id }]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };


  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      cartCount,
      clearCart,
      user,
      isLoggedIn: !!user,
      isAuthLoading,
      login,
      loginWithGoogle,
      logout,
      refreshUser,
      searchQuery,
      setSearchQuery,
      orders,
      placeOrder,
      getUserOrders,
      products, // Now comes from API
      updateProduct,
      deleteProduct,
      addProduct,
      getAllOrders,
      updateOrderStatus,
      isProductsLoading, // New state
      productsError,     // New state
      fetchProducts      // Expose fetch function
    }}>
      {children}
    </AppContext.Provider>
  );
};