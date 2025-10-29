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

  // ✅ Fetch products from API
  const fetchProducts = async () => {
    setIsProductsLoading(true);
    setProductsError(null);
    
    try {
      const response = await axios.get(`${URLS.Products}`);
      
      // Extract nested data array
      const productsData = response.data?.data || response.data || [];
      
      // Validate and normalize
      const normalizedProducts = Array.isArray(productsData) ? productsData.map(product => ({
        ...product,
        id: product._id || product.id,
        name: product.productName || product.name,
        image: product.images?.[0] || product.image || '',
        sku: product.SKU || product.sku || '',
      })) : [];
      
      setProducts(normalizedProducts);
      
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load products';
      setProductsError(errorMessage);
      setProducts([]);
    } finally {
      setIsProductsLoading(false);
    }
  };

  // Initialize auth state and fetch products on app load
  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const fetchedUser = await fetchUserDetails(token);
          if (fetchedUser?.id) {
            await loadWishlistFromServer(token, fetchedUser.id);
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          clearAuthData();
        }
      }
      setIsAuthLoading(false);
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
    if (userData.name) localStorage.setItem('userName', userData.name);
    if (userData.email) localStorage.setItem('userEmail', userData.email);
    if (userData.role) localStorage.setItem('userRole', userData.role);
    if (cart) localStorage.setItem('userCart', JSON.stringify(cart));
  };

  const loadCartFromServer = async (token) => {
    try {
      const res = await axios.get(URLS.CartGet, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data.items;

      if (Array.isArray(data)) {
        setCartItems(data.map(mapCartItem));
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
    try {
      const response = await axios.get(`${URLS.GetProfile}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const userData = response.data.data.user;
      const userCart = response.data.data.cart || [];
      
      storeUserData(userData, userCart);
      
      setUser({
        id: userData._id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        cart: userCart
      });
      
      return {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        cart: userCart
      };
    } catch (error) {
      console.error("Profile fetch error:", error);
      if (error.response && (error.response.status === 401 || error.response.data.data?.message === "Invalid or expired token")) {
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
      _id: product._id || product.id,  // ✅ Include _id for consistency
      sku: product.sku || product.SKU,
      name: product.name || product.productName,
      price: product.price,
      image: (product.images && product.images[0]) || product.image,
      images: product.images,
      category: product.category || (Array.isArray(product.categories) ? product.categories.join(', ') : undefined),
      categories: product.categories,
      rating: product.rating,
      reviewsCount: product.reviewsCount || product.reviewCounts || product.reviews,
      originalPrice: product.originalPrice,
      discount: product.discount,
      quantity: product.quantity || 0,
      inStock: product.inStock !== undefined ? product.inStock : (product.quantity || 0) > 0,
      badge: product.badge,
      brand: product.brand,
      description: product.description,
    }));
    setWishlistItems(mapped);
  } catch (error) {
    console.error('Error loading wishlist:', error);
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

  const productInStock = product.inStock !== undefined 
    ? product.inStock 
    : (product.quantity || 0) > 0;

  if (!productInStock) {
    toast({ 
      title: 'Out of stock', 
      description: 'This product is currently unavailable.',
      variant: 'destructive' 
    });
    return;
  }
  
  try {
    const payload = {
      productId: product._id || product.id,
      quantity: 1,
    };
    const res = await axios.post(URLS.CartAdd, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const raw = res.data;
    const updatedCart = raw?.items || [];
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
      loadWishlistFromServer(token);
    } catch (err) {
      console.error("Add wishlist error:", err.response?.data || err.message);
    }
  };

  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return alert("Please login to remove from wishlist");

    try {
      await axios.delete(`${URLS.WishlistRemove}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
    } catch (err) {
      console.error("Remove wishlist error:", err.response?.data || err.message);
    }
  };

  const toggleWishlist = async (product) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      localStorage.setItem('pendingWishlistProduct', JSON.stringify(product));
      localStorage.setItem('pendingRedirectToWishlist', '1');
      openLoginDialog();
      return;
    }

    await handleWishlist(product, token);
  };

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

  const updateQuantity = async (productId, action) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.product._id === productId) {
          const newQty = action === "increment" ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: Math.max(newQty, 1) };
        }
        return item;
      })
    );

    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await axios.put(
        URLS.CartUpdate,
        { productId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.data?.items) {
        setCartItems(res.data.data.items.map(mapCartProduct));
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

  const login = async (identifier, password) => {
    try {
      let token = localStorage.getItem('authToken');

      if (!token) {
        const response = await axios.post(`${API_BASE_URL}/signin`, { identifier, password });
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

  // ✅ FIXED: UPDATE PRODUCT with correct field mapping
  const updateProduct = async (productId, productData) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');

    try {
      const formData = new FormData();

      // Append all text fields with correct field names
      formData.append('productName', productData.productName || productData.name || '');
      formData.append('SKU', productData.SKU || productData.sku || '');
      formData.append('price', productData.price?.toString() || '0');
      formData.append('originalPrice', productData.originalPrice?.toString() || productData.price?.toString() || '0');
      formData.append('category', productData.category || '');
      formData.append('brand', productData.brand || '');
      formData.append('quantity', productData.quantity?.toString() || '0');
      formData.append('description', productData.description || '');
      formData.append('rating', productData.rating?.toString() || '4.0');
      formData.append('reviewCounts', productData.reviewCounts?.toString() || productData.reviews?.toString() || '0');
      formData.append('discount', productData.discount?.toString() || '0');
      formData.append('badge', productData.badge || '');
      formData.append('inStock', productData.inStock?.toString() || 'true');
      formData.append('youtubeUrl', productData.youtubeUrl || ''); // ✅ FIXED: Added youtubeUrl

      // Handle categories array
      if (productData.categories && Array.isArray(productData.categories)) {
        formData.append('categories', JSON.stringify(productData.categories));
      }

      // ✅ FIXED: Handle images properly - use newImages from ProductForm
      if (productData.newImages && productData.newImages.length > 0) {
        // User uploaded new images
        productData.newImages.forEach(file => {
          formData.append('images', file);
        });
      } else if (productData.existingImages && productData.existingImages.length > 0) {
        // Keep existing images - send as array
        formData.append('existingImages', JSON.stringify(productData.existingImages));
      }

      const response = await axios.put(
        `${URLS.UpdateProduct}/${productId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Update local state
      setProducts(prev =>
        prev.map(product =>
          (product._id === productId || product.id === productId)
            ? { ...product, ...response.data.data }
            : product
        )
      );

      toast({
        title: "Product Updated",
        description: "Product has been updated successfully",
        variant: "success",
      });

      return response.data.data;
    } catch (error) {
      console.error('Error updating product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update product';
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  // ✅ DELETE PRODUCT
  const deleteProduct = async (productId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      await axios.delete(`${URLS.DeleteProduct}/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      setProducts(prev => prev.filter(product => product._id !== productId && product.id !== productId));

      toast({
        title: 'Product Deleted',
        description: 'Product has been removed successfully',
        variant: 'success',
      });

      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      toast({
        title: 'Delete Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // ✅ FIXED: ADD PRODUCT with correct field mapping
  const addProduct = async (productData) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const formData = new FormData();
      
      // ✅ FIXED: Append all fields with correct names including youtubeUrl
      formData.append('productName', productData.productName || productData.name || '');
      formData.append('SKU', productData.SKU || productData.sku || '');
      formData.append('price', productData.price?.toString() || '0');
      formData.append('originalPrice', (productData.originalPrice || productData.price)?.toString() || '0');
      formData.append('category', productData.category || '');
      formData.append('brand', productData.brand || '');
      formData.append('quantity', (productData.quantity || 0).toString());
      formData.append('description', productData.description || '');
      formData.append('rating', (productData.rating || 4.0).toString());
      formData.append('reviewCounts', (productData.reviewCounts || productData.reviews || 0).toString());
      formData.append('discount', (productData.discount || 0).toString());
      formData.append('badge', productData.badge || '');
      formData.append('inStock', (productData.inStock !== undefined ? productData.inStock : true).toString());
      formData.append('youtubeUrl', productData.youtubeUrl || ''); // ✅ FIXED: Added youtubeUrl

      // ✅ FIXED: Handle image files - use newImages from ProductForm
      if (productData.newImages && productData.newImages.length > 0) {
        productData.newImages.forEach((file) => {
          formData.append('images', file);
        });
      }

      const response = await axios.post(
        URLS.AddProduct,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Update local state with new product
      const newProduct = response.data.data;
      setProducts(prev => [...prev, {
        ...newProduct,
        id: newProduct._id,
        name: newProduct.productName || newProduct.name
      }]);

      toast({
        title: 'Product Added',
        description: 'New product has been added successfully',
        variant: 'success',
      });

      // Refresh products list
      await fetchProducts();

      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add product';
      toast({
        title: 'Add Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile();
      fetchCartItems();
      fetchWishlist();
      fetchOrders();
    }
  }, []);

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