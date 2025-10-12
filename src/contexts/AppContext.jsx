import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { URLS } from '../Urls';
import { toast } from '@/hooks/use-toast.js';

const AppContext = createContext(undefined);

// API base URL
const API_BASE_URL = "https://agri-tech-backend-07b8.onrender.com/api/auth";

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
 
  const [wishlistItems, setWishlistItems] = useState([]);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [pendingWishlistProduct, setPendingWishlistProduct] = useState(null);

  // Product state
  const [products, setProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [cartItems, setCartItems] = useState([]);

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
      const response = await axios.get(`${URLS.Products}`);
      setProducts(response.data.data);
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
          // Clear invalid token and user data
          clearAuthData();
        }
      }
      setIsAuthLoading(false);

      // Fetch Products
      await fetchProducts();
    };

    initializeApp();
  }, []);

  // Helper function to clear auth data from localStorage
  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userCart');
  };

  // Helper function to store user data in localStorage
  const storeUserData = (userData, cart) => {
    if (userData.name) {
      localStorage.setItem('userName', userData.name);
    }
    if (userData.email) {
      localStorage.setItem('userEmail', userData.email);
    }
    if (userData.role) {
      localStorage.setItem('userRole', userData.role);
    }
    if (cart) {
      localStorage.setItem('userCart', JSON.stringify(cart));
    }
  };

 const loadCartFromServer = async (token) => {
    try {
      const res = await axios.get(URLS.CartGet, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;

      if (data.items && Array.isArray(data.items)) {
        setCartItems(data.items.map(mapCartItem));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    }
  };



const mapCartItem = (item) => ({
    _id: item._id,
    quantity: item.quantity,
    product: item.product
  });


  // AppContext.jsx

const mapCartProduct = (item) => ({
  _id: item._id,
  quantity: item.quantity,
  product: {
    _id: typeof item.product === 'string' ? item.product : item.product._id,
    name: item.product?.name || item.productName || 'Unknown',
    price: item.product?.price || 0,
    images: item.product?.images || [],
    sku: item.product?.SKU || item.product?.sku || 'N/A',
  },
});


  // Fetch user details using token
  const fetchUserDetails = async (token) => {

    console.log("Fetching user details with token:", token);
    try {
      const response = await axios.get(`${URLS.GetProfile}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const userData = response.data.data.user;
      const userCart = response.data.data.cart || [];
      
      // Store user data in localStorage
      storeUserData(userData, userCart);
      
      // Set user state with role
      setUser({
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        cart: userCart
      });
      
      return {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        cart: userCart
      };
    } catch (error) {
      console.error("Profile fetch error:", error);
      if (
        error.response &&
        (error.response.status === 401 || error.response.data.data.message === "Invalid or expired token")
      ) {
        logout();
      }
      return null;
    }
  };

  const loadWishlistFromServer = async (token, userId) => {
    
    try {
      const res = await axios.get(URLS.WishlistGet, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data;
      const products = Array.isArray(res.data?.data?.products)
        ? res.data.data.products
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

const addToCart = async (product) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    toast({ title: 'Please sign in', variant: 'destructive' });
    openLoginDialog();
    return;
  }
  // console.log("mytoken",token);
  try {
    const payload = {
      productId: product._id || product.id,
      quantity: 1,
    };
    const res = await axios.post(URLS.CartAdd, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("Add to cart response:", res.data);
    const raw = res.data;
  const updatedCart = raw?.items || [];
    // console.log("Updated cart from server:", updatedCart); 
 // Because items[] holds your cart products
  setCartItems(updatedCart.map(mapCartProduct));
    toast({ title: 'Added to cart', variant: 'success' });
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast({
      title: 'Cart error',
      description: error.response?.data?.message || error.message,
      variant: 'destructive',
    });
  }
};


  const isInWishlist = (idOrSku) => {
    return wishlistItems.some(item => item.id === idOrSku || item.sku === idOrSku);
  };

 const addToWishlist = async (productId) => {
  const token = localStorage.getItem("authToken");
  if (!token) return alert("Please login to add to wishlist");

  try {
    const res = await axios.post(`${URLS.WishlistAdd}/${productId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // console.log(res.data);
     loadWishlistFromServer(token); // reload wishlist
  } catch (err) {
    console.error("Add wishlist error:", err.response?.data || err.message);
  }
};



const removeFromWishlist = async (productId) => {
  const token = localStorage.getItem("authToken");

  // console.log("Removing product from wishlist:", productId);
  // console.log("Using token:", token);
  if (!token) return alert("Please login to remove from wishlist");

  try {
     await axios.delete(`${URLS.WishlistRemove}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("hwy man",res.data);
    setWishlistItems(prev => prev.filter(item => item._id !== productId));
  } catch (err) {
    console.error("Remove wishlist error:", err.response?.data || err.message);
  }
};




// Call this on product wishlist toggle
const toggleWishlist = async (product) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    // Store pending product
    localStorage.setItem('pendingWishlistProduct', JSON.stringify(product));
    localStorage.setItem('pendingRedirectToWishlist', '1');
    openLoginDialog(); // open login modal
    return;
  }

  await handleWishlist(product, token);
};

// Function to handle actual wishlist add/remove
const handleWishlist = async (product, token) => {
  const productId = product._id || product.id;
  const key = product.sku || product.id || product._id;

  if (!productId) {
    toast({ title: 'Missing product id', description: 'Unable to add this product to wishlist.', variant: 'destructive' });
    return;
  }

  try {
    if (isInWishlist(key)) {
      await axios.delete(`${URLS.WishlistRemove}/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
      removeFromWishlist(key);
      await loadWishlistFromServer(token);
      toast({ title: 'Removed from wishlist', variant: 'destructive' });
    } else {
      await axios.post(`${URLS.WishlistAdd}/${productId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      addToWishlist(product);
      await loadWishlistFromServer(token);
      window.dispatchEvent(new Event('wishlist-updated'));
      toast({ title: 'Added to wishlist', variant: 'success' });
    }
  } catch (err) {
    const status = err.response?.status;
    const msg = err.response?.data?.message?.toLowerCase();
    if (status === 400 && msg.includes('already')) {
      addToWishlist(product);
      toast({ title: 'Already in wishlist', variant: 'success' });
    } else if (status === 401) {
      toast({ title: 'Sign in required', description: 'Please sign in to use wishlist.', variant: 'destructive' });
    } else {
      toast({ title: 'Wishlist error', description: err.response?.data?.message || err.message, variant: 'destructive' });
    }
  }
};

// --- In your Login Success Handler ---
const onLoginSuccess = async (token) => {
  // Check for pending wishlist product
  const pendingProductStr = localStorage.getItem('pendingWishlistProduct');
  if (pendingProductStr) {
    const pendingProduct = JSON.parse(pendingProductStr);
    await handleWishlist(pendingProduct, token);
    localStorage.removeItem('pendingWishlistProduct');
    localStorage.removeItem('pendingRedirectToWishlist');
    navigate('/wishlist'); // navigate to wishlist page immediately
  }
};

const updateQuantity = async (productId, action) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await axios.put(
      URLS.CartUpdate,
      { productId, action }, // make sure productId is here
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.items) {
      setCartItems(res.data.items.map(mapCartProduct));
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
};

  const removeFromCart = async (productId) => {
  const token = localStorage.getItem('authToken');
  if (!token) return;

  try {
    await axios.delete(URLS.CartRemove(productId), {
      headers: { Authorization: `Bearer ${token}` },
    });

    setCartItems(prev => prev.filter(item => item.product._id !== productId));
  } catch (error) {
    console.error("Error removing item:", error);
  }
};



  const clearCart = () => {
    setCartItems([]);
  };

  const openLoginDialog = () => setIsLoginDialogOpen(true);
  const closeLoginDialog = () => setIsLoginDialogOpen(false);

const login = async (email, password) => {
  try {
    let token = localStorage.getItem('authToken');

    if (!token) {
      const response = await axios.post(`${API_BASE_URL}/signin`, { email, password });
      token = response.data.data.token;
      localStorage.setItem('authToken', token);
    }

    if (token) {
      const fetchedUser = await fetchUserDetails(token);
      if (fetchedUser?.id) {
        await loadWishlistFromServer(token, fetchedUser.id);
        await loadCartFromServer(token);
      }

      if (pendingWishlistProduct) {
        const productId = pendingWishlistProduct._id || pendingWishlistProduct.id;
        if (productId) {
          await axios.post(`${URLS.WishlistAdd}/${productId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          addToWishlist(pendingWishlistProduct);
        }
        setPendingWishlistProduct(null);
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error('Login error:', error);
    clearAuthData();
    const errorMessage = error.response?.data?.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

  const loginWithGoogle = async () => {
    try {
      // Implement your Google auth logic here
      // After successful login, store user data
      const userData = {
        id: 'google-1',
        email: 'user@gmail.com',
        name: 'Google User',
        role: 'user'
      };
      storeUserData(userData, []);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const logout = () => {
    clearAuthData();
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
    const id = Math.max(...products.map(p => p.id), 0) + 1;
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
      fetchProducts,
      loadCartFromServer
    }}>
      {children}
    </AppContext.Provider>
  );
};
