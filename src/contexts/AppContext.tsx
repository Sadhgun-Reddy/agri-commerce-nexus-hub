import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface Product {
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
}

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
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
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Orders
  orders: Order[];
  placeOrder: (shippingAddress: any) => string;
  getUserOrders: (userId: string) => Order[];
  
  // Admin functionality
  products: Product[];
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Honda Power Weeder GX25",
      price: 28000,
      originalPrice: 32000,
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Intercultivators/Power weeders",
      sku: "HON-PW-GX25",
      discount: 12,
      inStock: true,
      badge: "Best Seller",
      brand: "Honda"
    },
    {
      id: 2,
      name: "Professional Earth Auger 52cc",
      price: 15000,
      originalPrice: 18000,
      rating: 4.6,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Earth Augers",
      sku: "PRO-EA-52CC",
      discount: 17,
      inStock: true,
      badge: "New Arrival",
      brand: "Mahindra"
    }
  ]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

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

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email && password) {
      const isAdmin = email === 'admin@agri.com';
      setUser({
        id: isAdmin ? 'admin-1' : '1',
        email,
        name: email.split('@')[0],
        isAdmin
      });
      return true;
    }
    return false;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setUser({
      id: 'google-1',
      email: 'user@gmail.com',
      name: 'Google User',
      isAdmin: false
    });
    return true;
  };

  const logout = () => {
    setUser(null);
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

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

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
    const id = Math.max(...products.map(p => p.id)) + 1;
    setProducts(prev => [...prev, { ...newProduct, id }]);
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
      login,
      loginWithGoogle,
      logout,
      searchQuery,
      setSearchQuery,
      orders,
      placeOrder,
      getUserOrders,
      products,
      updateProduct,
      deleteProduct,
      addProduct,
      getAllOrders,
      updateOrderStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};
