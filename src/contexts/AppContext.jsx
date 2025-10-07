import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { URLS } from '../Urls';
import { toast } from '@/hooks/use-toast.js';



const AppContext = createContext(undefined);

// API base URL - using your tunnel URL
// const API_BASE_URL = "https://p62fbn3v-5000.inc1.devtunnels.ms"; // Ensure no trailing space
const API_BASE_URL = "https://agri-tech-backend-07b8.onrender.com/";

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [wishlistItems, setWishlistItems] = useState([]);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [pendingWishlistProduct, setPendingWishlistProduct] = useState(null);

  // Product state
  const [products, setProducts] = useState([]); // Start with empty array
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  const getWishlistStorageKey = (uid) => `wishlist:${uid}`;

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(getWishlistStorageKey(user.id), JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  // Fetch products from API
  const fetchProducts = async () => {
    setIsProductsLoading(true);
    setProductsError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      // Assuming the API returns an array of products directly
      // Adjust the data access (e.g., response.data.products) if your API structure is different
      setProducts(response.data);
    } catch (error) {
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
          const fetchedUser = await fetchUserDetails(token);
          if (fetchedUser?.id) {
            await loadWishlistFromServer(token, fetchedUser.id);
          }
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
  const fetchUserDetails = async (token) => {
    try {
      const response = await axios.get(`${URLS.GetProfile}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const userData = response.data.user;
      const normalizedUser = {
        id: userData.id || userData._id, // Handle both id and _id
        email: userData.email,
        name: userData.name || userData.username || 'User',
      };
      setUser(normalizedUser);
      return normalizedUser;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  };

  const loadWishlistFromServer = async (token, userId) => {
    try {
      const res = await axios.get(URLS.WishlistGet, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data;
      const products = Array.isArray(data?.products)
        ? data.products
        : (Array.isArray(data?.wishlist?.products) ? data.wishlist.products : []);

      if (!products.length || typeof products[0] === 'string') {
        const local = localStorage.getItem(getWishlistStorageKey(userId));
        setWishlistItems(local ? JSON.parse(local) : []);
        return;
      }

      const mapped = products.map((product) => ({
        id: product.id || product._id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        image: (product.images && product.images[0]) || product.image,
        images: product.images,
        category: product.category || (Array.isArray(product.categories) ? product.categories.join(', ') : undefined),
        categories: product.categories,
        rating: product.rating,
        reviewsCount: product.reviewsCount || product.reviews,
        originalPrice: product.originalPrice,
        discount: product.discount,
        inStock: product.inStock,
      }));
      setWishlistItems(mapped);
    } catch (error) {
      const local = userId ? localStorage.getItem(getWishlistStorageKey(userId)) : null;
      setWishlistItems(local ? JSON.parse(local) : []);
    }
  };

  const addToCart = (product) => {
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
        image: (product.images && product.images[0]) || product.image,
        images: product.images,
        sku: product.sku,
        inStock: product.inStock
      }];
    });
  };

  const isInWishlist = (idOrSku) => {
    return wishlistItems.some(item => item.id === idOrSku || item.sku === idOrSku);
  };

  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      const key = product.sku || product.id || product._id;
      if (prev.some(p => p.id === key || p.sku === key)) return prev;
      return [...prev, {
        id: product._id || product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        image: (product.images && product.images[0]) || product.image,
        images: product.images,
        category: product.category || (Array.isArray(product.categories) ? product.categories.join(', ') : undefined),
        categories: Array.isArray(product.categories) ? product.categories : (product.category ? [product.category] : []),
        rating: product.rating,
        reviewsCount: product.reviewsCount || product.reviews,
        originalPrice: product.originalPrice,
        discount: product.discount,
        inStock: product.inStock,
      }];
    });
  };

  const removeFromWishlist = (idOrSku) => {
    setWishlistItems(prev => prev.filter(item => item.id !== idOrSku && item.sku !== idOrSku));
  };

  const toggleWishlist = async (product) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Defer the wishlist add until after login
      setPendingWishlistProduct(product);
      localStorage.setItem('pendingRedirectToWishlist', '1');
      openLoginDialog();
      return;
    }
    try {
      const productId = product._id || product.id;
      const key = product.sku || product.id || product._id;
      if (!productId) {
        toast({ title: 'Missing product id', description: 'Unable to add this product to wishlist.', variant: 'destructive' });
        return;
      }
      if (isInWishlist(key)) {
        // Optional: call backend remove if available
        try {
          await axios.post(`${URLS.WishlistRemove}/${productId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
        } catch {
          // ignore backend remove error, proceed to local update
        }
        removeFromWishlist(key);
        toast({ title: 'Removed from wishlist', variant: 'destructive' });
      } else {
        try {
          await axios.post(`${URLS.WishlistAdd}/${productId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
          addToWishlist(product);
          toast({ title: 'Added to wishlist', variant: 'success' });
        } catch (err) {
          const statusAdd = err.response?.status;
          const msg = err.response?.data?.message?.toString().toLowerCase();
          if (statusAdd === 400 && msg && msg.includes('already')) {
            // Backend says it already exists → ensure local state reflects it
            addToWishlist(product);
            toast({ title: 'Already in wishlist', description: 'This item is already saved.', variant: 'success' });
          } else {
            throw err;
          }
        }
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        toast({ title: 'Sign in required', description: 'Please sign in to use wishlist.', variant: 'destructive' });
      } else {
        toast({ title: 'Wishlist error', description: error.response?.data?.message || error.message, variant: 'destructive' });
      }
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const openLoginDialog = () => setIsLoginDialogOpen(true);
  const closeLoginDialog = () => setIsLoginDialogOpen(false);

  const login = async (email, password, token) => {
    try {
      let actualToken = token;

      // If no token provided, authenticate with credentials
      if (!actualToken) {
        const response = await axios.post(`${API_BASE_URL}/api/auth/signin`, {
          email,
          password
        });
        console.log("Login API response:", response.data);

        actualToken = response.data.token; // Adjust based on your API response structure
      }

      if (actualToken) {
        localStorage.setItem('authToken', actualToken);
        const fetchedUser = await fetchUserDetails(actualToken);
        if (fetchedUser?.id) {
          await loadWishlistFromServer(actualToken, fetchedUser.id);
        }
        // If login was triggered from a pending wishlist add, complete it and go to wishlist
        if (pendingWishlistProduct) {
          try {
            const productId = pendingWishlistProduct._id || pendingWishlistProduct.id;
            if (productId) {
              await axios.post(`${URLS.WishlistAdd}/${productId}`, {}, { headers: { Authorization: `Bearer ${actualToken}` } });
              addToWishlist(pendingWishlistProduct);
            }
          } catch {}
          setPendingWishlistProduct(null);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      logout(); // Clear any partial state

      // Show specific error message if available
      const errorMessage = error.response?.data?.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const loginWithGoogle = async () => {
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
    setWishlistItems([]);
    toast({
      title: 'Logged out',
      description: 'You have been logged out.',
      variant: 'destructive',
    });
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

  const placeOrder = (shippingAddress) => {
    const orderId = `ORDER-${Date.now()}`;
    const newOrder = {
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

  const getUserOrders = (userId) => {
    return orders.filter(order => order.userId === userId);
  };

  const getAllOrders = () => {
    return orders;
  };

  // Note: These admin functions still use local state. If you want full backend integration,
  // you'll need to make API calls for add/update/delete product operations as well.
  const updateProduct = (updatedProduct) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addProduct = (newProduct) => {
    const id = Math.max(...products.map(p => p.id), 0) + 1; // Handle empty products array
    setProducts(prev => [...prev, { ...newProduct, id }]);
  };

  const updateOrderStatus = (orderId, status) => {
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
      isLoginDialogOpen,
      openLoginDialog,
      closeLoginDialog,
      wishlistItems,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
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
      products,
      updateProduct,
      deleteProduct,
      addProduct,
      getAllOrders,
      updateOrderStatus,
      isProductsLoading,
      productsError,
      fetchProducts
    }}>
      {children}
    </AppContext.Provider>
  );
};
