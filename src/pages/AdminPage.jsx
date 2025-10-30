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
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';

// Centralized URLs
import { URLS } from '@/Urls.jsx';

// Use your existing context only for PRODUCTS
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

  // ✅ FIXED: Get products from context WITHOUT calling fetchProducts
  const { products, deleteProduct } = useApp();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  

  // Security check (dummy)
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

  // Fetch ORDERS on mount - Only once
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

          // Initialize selected statuses
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(price);

  // ORDERS: Confirm status change (persist to backend)

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
    // ✅ Use PUT and send status in body
    const res = await axios.put(
      URLS.UpdateStatus(id),
      { deliveryStatus: selected },  // ✅ sent in body
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

  // PRODUCTS: delete via API
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

          {/* Orders (API) */}
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

          {/* Products (from context - no loading needed) */}
          {activeTab === 'products' && (
            <div className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Products</CardTitle>
                  <Button disabled className="opacity-60 cursor-not-allowed">
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
                                    disabled
                                    className="opacity-50 cursor-not-allowed"
                                    title="Edit coming soon"
                                  >
                                    <Edit2 className="w-4 h-4" />
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
