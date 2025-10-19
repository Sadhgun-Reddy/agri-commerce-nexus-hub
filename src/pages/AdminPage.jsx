import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, Settings, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext.jsx';
import { useToast } from '@/hooks/use-toast.js';
import ProductForm from '@/components/admin/ProductForm.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAuthLoading } = useApp();
  const [activeTab, setActiveTab] = useState('orders');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    getAllOrders,
    updateOrderStatus,
    products,
    updateProduct,
    deleteProduct,
    addProduct,
    fetchProducts
  } = useApp();

  const { toast } = useToast();

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

  const orders = getAllOrders();

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast({
      title: "Order Updated",
      description: `Order status changed to ${newStatus}`,
    });
  };

  const handleProductEdit = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleProductDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleProductDeleteConfirm = async () => {
    if (!productToDelete) return;

    setIsSubmitting(true);
    try {
      await deleteProduct(productToDelete._id || productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductSave = async (productData) => {
    setIsSubmitting(true);
    
    try {
      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct._id || editingProduct.id, productData);
      } else {
        // Add new product
        await addProduct(productData);
      }
      
      setShowProductForm(false);
      setEditingProduct(null);
      
      // Refresh products list
      await fetchProducts();
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                <div className="text-2xl font-bold">{products.length}</div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <Settings className="h-4 w-4 text-brand-primary-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-brand-primary-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(orders.map(order => order.userId)).size}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs */}
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

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-grey-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-grey-300" />
                    <p>No orders yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.shippingAddress?.name || 'N/A'}</TableCell>
                            <TableCell>{formatPrice(order.total)}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleStatusUpdate(order.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Product Management</CardTitle>
                <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setEditingProduct(null);
                        setShowProductForm(true);
                      }}
                      className="bg-brand-primary-500 hover:bg-brand-primary-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingProduct 
                          ? 'Update product information and images' 
                          : 'Fill in the product details and upload images'}
                      </DialogDescription>
                    </DialogHeader>
                    {isSubmitting ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-primary-500" />
                        <span className="ml-3 text-grey-600">
                          {editingProduct ? 'Updating...' : 'Adding...'}
                        </span>
                      </div>
                    ) : (
                      <ProductForm
                        product={editingProduct}
                        onSave={handleProductSave}
                        onCancel={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                        }}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
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
                                src={product.image || (product.images && product.images[0]) || '/placeholder.jpg'}
                                alt={product.name || product.productName}
                                className="w-12 h-12 object-cover rounded border border-grey-200"
                                onError={(e) => {
                                  e.target.src = '/placeholder.jpg';
                                }}
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
                                  onClick={() => handleProductEdit(product)}
                                  className="hover:bg-brand-primary-50"
                                >
                                  <Edit2 className="w-4 h-4 text-brand-primary-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleProductDeleteClick(product)}
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
          )}
        </div>
      </main>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{productToDelete?.name || productToDelete?.productName}".
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
