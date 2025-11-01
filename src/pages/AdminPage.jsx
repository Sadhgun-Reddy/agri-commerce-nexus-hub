// src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, Settings, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast.js';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';

// Import ProductForm
import ProductForm from '../components/admin/ProductForm';

// Centralized URLs
import { URLS } from '@/Urls.jsx';

// Use your existing context
import { useApp } from '@/contexts/AppContext.jsx';

// Delivery status options
const DELIVERY_STATUS_OPTIONS = [
  { value: 'placed', label: 'Order Placed' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Order Shipped' },
  { value: 'delivered', label: 'Delivered' },
];

const normalizeDeliveryStatus = (status, fallbackStatus) => {
  const s = (status || '').toLowerCase();
  if (['placed', 'confirmed', 'shipped', 'delivered', 'cancelled', 'processing'].includes(s)) return s;
  if ((fallbackStatus || '').toLowerCase() === 'created') return 'placed';
  return 'processing';
};

const labelFromDeliveryStatus = (status) => {
  const found = DELIVERY_STATUS_OPTIONS.find((o) => o.value === status);
  if (found) return found.label;
  if (status === 'cancelled') return 'Cancelled';
  if (status === 'processing') return 'Processing';
  return 'Order Placed';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'placed': return 'bg-yellow-500';
    case 'confirmed': return 'bg-blue-500';
    case 'shipped': return 'bg-purple-500';
    case 'delivered': return 'bg-green-500';
    case 'cancelled': return 'bg-red-500';
    case 'processing': return 'bg-orange-500';
    default: return 'bg-gray-500';
  }
};

// Helper function to convert URL to File object
const urlToFile = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });
    return file;
  } catch (error) {
    console.error('Error converting URL to file:', error);
    throw error;
  }
};

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Toggle: Orders / Products
  const [activeTab, setActiveTab] = useState('orders');

  // Dummy auth for now
  const [user] = useState({ name: 'Admin', role: 'admin' });
  const [isAuthLoading] = useState(false);

  // ORDERS via API
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // Local UI for per-order selection and saving
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [savingStatus, setSavingStatus] = useState({});

  // Get products from context
  const { products, deleteProduct, fetchProducts } = useApp();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Product Form Dialog States
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [productFormMode, setProductFormMode] = useState('add'); // 'add' or 'edit'
  const [editingProduct, setEditingProduct] = useState(null);

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Security check
  useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== 'admin')) {
      toast({
        title: 'Access Denied',
        description: 'Administrator privileges required.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [user, isAuthLoading, navigate, toast]);

  // Fetch ORDERS on mount
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchOrders = async () => {
      setOrdersError(null);
      setOrdersLoading(true);
      
      const token = getAuthToken();
      
      if (!token) {
        setOrdersError('No authentication token found');
        setOrdersLoading(false);
        toast({ 
          title: 'Authentication Error', 
          description: 'Please log in again', 
          variant: 'destructive' 
        });
        return;
      }

      try {
        const res = await fetch(URLS.Allorders, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to load orders: ${res.status}`);
        }

        const data = await res.json();
        
        if (!isMounted) return;

        if (data.success) {
          const list = Array.isArray(data.orders) ? data.orders : [];
          setOrders(list);

          const map = {};
          list.forEach((o) => {
            const id = o._id || o.id;
            const current = normalizeDeliveryStatus(o.deliveryStatus, o.status);
            if (id) map[id] = current;
          });
          setSelectedStatuses(map);
        } else {
          throw new Error(data.message || 'Failed to fetch orders');
        }
      } catch (e) {
        if (e?.name === 'AbortError') return;
        console.error('Fetch orders error:', e);
        if (isMounted) {
          setOrdersError(e.message || 'Failed to load orders');
          toast({ 
            title: 'Failed to load orders', 
            description: e.message || 'Please try again', 
            variant: 'destructive' 
          });
        }
      } finally {
        if (isMounted) {
          setOrdersLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [toast]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(price);

  // Update order status
  const handleConfirmStatus = async (order) => {
    const id = order._id || order.id;
    const selected = selectedStatuses[id];
    const current = normalizeDeliveryStatus(order.deliveryStatus, order.status);

    if (!id || !selected || selected === current) return;

    const token = getAuthToken();
    if (!token) {
      toast({ 
        title: 'Authentication Error', 
        description: 'Please log in again', 
        variant: 'destructive' 
      });
      return;
    }

    setSavingStatus((p) => ({ ...p, [id]: true }));

    try {
      const res = await axios.put(
        URLS.UpdateStatus(id),
        { deliveryStatus: selected },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = res.data;

      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => {
            const oid = o._id || o.id;
            return oid === id ? { ...o, deliveryStatus: selected } : o;
          })
        );

        toast({ 
          title: 'Order Updated', 
          description: `Order status changed to ${labelFromDeliveryStatus(selected)}` 
        });
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (e) {
      console.error('Update error:', e);
      toast({ 
        title: 'Update failed', 
        description: e.message || 'Could not update order status', 
        variant: 'destructive' 
      });
      setSelectedStatuses((p) => ({ ...p, [id]: current }));
    } finally {
      setSavingStatus((p) => ({ ...p, [id]: false }));
    }
  };

  // Open Add Product Dialog
  const handleOpenAddProduct = () => {
    setProductFormMode('add');
    setEditingProduct(null);
    setProductDialogOpen(true);
  };

  // Open Edit Product Dialog
  const handleOpenEditProduct = (product) => {
    setProductFormMode('edit');
    setEditingProduct(product);
    setProductDialogOpen(true);
  };

  // Close Product Dialog
  const handleCloseProductDialog = () => {
    setProductDialogOpen(false);
    setEditingProduct(null);
  };

  // Handle Product Save (Add or Edit)
  const handleProductSave = async (submitData) => {
    const token = getAuthToken();
    if (!token) {
      toast({ 
        title: 'Authentication Error', 
        description: 'Please log in again', 
        variant: 'destructive' 
      });
      throw new Error('No authentication token');
    }

    try {
      const { formData, newImageFiles, existingImageUrls, isEdit, hasNewImages } = submitData;
      
      // Create FormData for multipart upload (ALWAYS for updates)
      const apiFormData = new FormData();
      
      if (isEdit) {
        // UPDATE MODE - Backend REQUIRES multipart/form-data with images field
        console.log('Update mode:', { 
          hasNewImages, 
          newImageFilesCount: newImageFiles.length,
          existingImageUrlsCount: existingImageUrls.length 
        });
        
        const productId = editingProduct._id || editingProduct.id;
        
        if (hasNewImages && newImageFiles.length > 0) {
          // Case 1: User uploaded NEW images
          console.log('Uploading new images');
          newImageFiles.forEach((file) => {
            apiFormData.append('images', file);
          });
        } else if (existingImageUrls && existingImageUrls.length > 0) {
          // Case 2: NO new images - Convert existing URLs to files and re-upload
          console.log('Converting existing image URLs to files for re-upload...');
          
          try {
            // Convert all existing image URLs to File objects
            const filePromises = existingImageUrls.map(async (url, index) => {
              const filename = url.split('/').pop() || `image-${index}.jpg`;
              return await urlToFile(url, filename);
            });
            
            const existingFiles = await Promise.all(filePromises);
            
            // Append converted files to FormData
            existingFiles.forEach((file) => {
              apiFormData.append('images', file);
            });
            
            console.log(`Re-uploaded ${existingFiles.length} existing images as files`);
          } catch (error) {
            console.error('Error converting existing images:', error);
            throw new Error('Failed to process existing images. Please try uploading new images.');
          }
        }
        
        // Append all form fields for UPDATE
        apiFormData.append('productName', formData.name);
        apiFormData.append('price', formData.price);
        apiFormData.append('originalPrice', formData.originalPrice || formData.price);
        apiFormData.append('categories', JSON.stringify([formData.category]));
        apiFormData.append('brand', formData.brand || '');
        apiFormData.append('sku', formData.sku);
        apiFormData.append('inStock', formData.inStock.toString());
        apiFormData.append('quantity', formData.quantity);
        apiFormData.append('discount', formData.discount);
        apiFormData.append('badges', JSON.stringify(formData.badge ? [formData.badge] : []));
        
        if (formData.description) apiFormData.append('description', formData.description);
        if (formData.youtubeUrl) apiFormData.append('youtubeUrl', formData.youtubeUrl);
        if (formData.rating) apiFormData.append('rating', formData.rating);
        if (formData.reviewCount) apiFormData.append('reviewCount', formData.reviewCount);

        // Log FormData contents
        console.log('=== UPDATE Request FormData ===');
        for (let pair of apiFormData.entries()) {
          if (pair[1] instanceof File) {
            console.log(pair[0], `[File: ${pair[1].name}, Size: ${pair[1].size} bytes]`);
          } else {
            console.log(pair[0], pair[1]);
          }
        }
        console.log('================================');
        
        const response = await axios.put(
          `${URLS.UpdateProduct}/${productId}`, 
          apiFormData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          toast({
            title: 'Product Updated',
            description: 'Product updated successfully',
          });
          await fetchProducts();
          handleCloseProductDialog();
        } else {
          throw new Error(response.data.message || 'Update failed');
        }
        
      } else {
        // ADD MODE - Always multipart with images
        if (newImageFiles && newImageFiles.length > 0) {
          newImageFiles.forEach((file) => {
            apiFormData.append('images', file);
          });
        }
        
        apiFormData.append('productName', formData.name);
        apiFormData.append('SKU', formData.sku);
        apiFormData.append('price', formData.price);
        apiFormData.append('originalPrice', formData.originalPrice || formData.price);
        apiFormData.append('category', formData.category);
        apiFormData.append('brand', formData.brand || '');
        apiFormData.append('quantity', formData.quantity);
        apiFormData.append('description', formData.description || '');
        apiFormData.append('inStock', formData.inStock.toString());
        apiFormData.append('rating', formData.rating);
        apiFormData.append('reviewCounts', formData.reviewCount);
        apiFormData.append('discount', formData.discount);
        apiFormData.append('badge', formData.badge || '');
        
        if (formData.youtubeUrl) {
          apiFormData.append('youTubeUrl', formData.youtubeUrl);
        }

        const response = await axios.post(URLS.AddProduct, apiFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          toast({
            title: 'Product Added',
            description: 'Product added successfully',
          });
          await fetchProducts();
          handleCloseProductDialog();
        } else {
          throw new Error(response.data.message || 'Failed to add product');
        }
      }
      
    } catch (error) {
      console.error('Product save error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.data?.error ||
                          error.message || 
                          'Could not save product';
      
      console.error('Full error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: errorMessage
      });
      
      toast({
        title: 'Operation Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  };

  // Delete product confirmation
  const handleProductDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteProduct(productToDelete._id || productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      toast({ title: 'Deleted', description: 'Product removed successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      toast({ 
        title: 'Delete failed', 
        description: 'Could not remove product', 
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || o.total || 0), 0);
  const uniqueCustomers = new Set(
    orders.map((o) => o.user?._id || o.user?.id || o.userId).filter(Boolean)
  ).size;

  return (
    <div className="min-h-screen flex flex-col bg-grey-50">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-grey-800 mb-2">Admin Dashboard</h1>
                <p className="text-grey-600">Manage your products, orders, and customers</p>
              </div>
              {user && (
                <Badge variant="default" className="text-sm bg-brand-primary-500">
                  Admin: {user.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-brand-primary-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-brand-primary-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products?.length ?? 0}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <Settings className="h-4 w-4 text-brand-primary-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-brand-primary-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueCustomers}</div>
              </CardContent>
            </Card>
          </div>

          {/* Toggle: Orders / Products */}
          <div className="flex space-x-4 mb-6">
            <Button
              variant={activeTab === 'orders' ? 'default' : 'outline'}
              onClick={() => setActiveTab('orders')}
              className={activeTab === 'orders' ? 'bg-brand-primary-500 hover:bg-brand-primary-600' : ''}
            >
              Orders
            </Button>
            <Button
              variant={activeTab === 'products' ? 'default' : 'outline'}
              onClick={() => setActiveTab('products')}
              className={activeTab === 'products' ? 'bg-brand-primary-500 hover:bg-brand-primary-600' : ''}
            >
              Products
            </Button>
          </div>

          {/* Orders Table */}
          {activeTab === 'orders' && (
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary-500" />
                    <span className="ml-3 text-grey-600">Loading orders...</span>
                  </div>
                ) : ordersError ? (
                  <div className="text-center py-12">
                    <div className="text-red-600 mb-4">{ordersError}</div>
                    <Button
                      onClick={() => window.location.reload()}
                      className="bg-brand-primary-500 hover:bg-brand-primary-600"
                    >
                      Retry
                    </Button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 text-grey-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-grey-300" />
                    <p>No orders found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Delivery Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => {
                          const id = order._id || order.id;
                          const current = normalizeDeliveryStatus(order.deliveryStatus, order.status);
                          const selected = selectedStatuses[id] ?? current;
                          const isSaving = !!savingStatus[id];
                          const isUnchanged = selected === current;

                          return (
                            <TableRow key={id}>
                              <TableCell className="font-medium">
                                {id?.slice(-8) || 'N/A'}
                              </TableCell>
                              <TableCell>
                                {order?.user?.name || order?.address?.fullName || order?.shippingAddress?.name || 'N/A'}
                              </TableCell>
                              <TableCell>{formatPrice(order.amount || order.total || 0)}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(current)}>
                                  {labelFromDeliveryStatus(current)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(order.createdAt).toLocaleDateString('en-IN')}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Select 
                                    value={selected} 
                                    onValueChange={(v) => setSelectedStatuses((p) => ({ ...p, [id]: v }))}
                                    disabled={isSaving}
                                  >
                                    <SelectTrigger className="w-44">
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {DELIVERY_STATUS_OPTIONS.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>
                                          {s.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>

                                  <Button
                                    variant="default"
                                    onClick={() => handleConfirmStatus(order)}
                                    disabled={isUnchanged || isSaving}
                                    className="bg-brand-primary-500 hover:bg-brand-primary-600"
                                  >
                                    {isSaving ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Confirming...
                                      </>
                                    ) : (
                                      'Confirm'
                                    )}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Products Table */}
          {activeTab === 'products' && (
            <div className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Products</CardTitle>
                  <Button 
                    onClick={handleOpenAddProduct}
                    className="bg-brand-primary-500 hover:bg-brand-primary-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </CardHeader>
                <CardContent>
                  {!products || products.length === 0 ? (
                    <div className="text-center py-12 text-grey-500">
                      <Package className="w-12 h-12 mx-auto mb-3 text-grey-300" />
                      <p>No products available</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product._id || product.id}>
                              <TableCell>
                                <img
                                  src={product.image || (Array.isArray(product.images) ? product.images[0] : '') || '/placeholder.jpg'}
                                  alt={product.name || product.productName || 'Product'}
                                  className="w-12 h-12 object-cover rounded border border-grey-200"
                                  onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                {product.name || product.productName}
                              </TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>{formatPrice(product.price)}</TableCell>
                              <TableCell>
                                <Badge variant={product.inStock ? 'default' : 'destructive'}>
                                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenEditProduct(product)}
                                    className="hover:bg-blue-50"
                                  >
                                    <Edit2 className="w-4 h-4 text-blue-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setProductToDelete(product);
                                      setDeleteDialogOpen(true);
                                    }}
                                    className="hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Product Form Dialog (Add/Edit) */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {productFormMode === 'add' ? 'Add New Product' : 'Edit Product'}
            </DialogTitle>
            <DialogDescription>
              {productFormMode === 'add' 
                ? 'Fill in the details to add a new product to your inventory' 
                : 'Update the product information'}
            </DialogDescription>
          </DialogHeader>

          <ProductForm
            product={editingProduct}
            onSave={handleProductSave}
            onCancel={handleCloseProductDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the product "{productToDelete?.name || productToDelete?.productName}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleProductDeleteConfirm}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default AdminPage;
