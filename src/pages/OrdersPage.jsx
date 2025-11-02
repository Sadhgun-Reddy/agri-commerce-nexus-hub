// src/pages/OrdersPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Package, Clock, Truck, CheckCircle, XCircle, Eye, X } from 'lucide-react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useApp } from '@/contexts/AppContext.jsx';
import { useToast } from '@/hooks/use-toast.js';
import axios from 'axios';
import { URLS } from '@/Urls';

const OrdersPage = () => {
  const { user, products } = useApp();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const productMap = useMemo(() => {
    const map = new Map();
    (products || []).forEach(p => {
      const id = p._id || p.id;
      if (id) {
        map.set(String(id), {
          id,
          name: p.name || p.productName,
          price: p.price || 0,
          image: (p.images && p.images[0]) || p.image || '',
        });
      }
    });
    return map;
  }, [products]);

  const formatINR = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

  const getStatusIcon = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered':
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered':
      case 'paid': return 'bg-green-600';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDeliveryStatusIcon = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'placed': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'placed': return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'processing': return 'bg-orange-100 text-orange-700 border border-orange-300';
      case 'shipped': return 'bg-purple-100 text-purple-700 border border-purple-300';
      case 'delivered': return 'bg-green-100 text-green-700 border border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-700 border border-red-300';
      default: return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  const getDeliveryStatusLabel = (status) => {
    const labels = {
      'placed': 'Order Placed',
      'confirmed': 'Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
    };
    return labels[status?.toLowerCase()] || status || 'Unknown';
  };

  const fetchProductById = async (id, token) => {
    try {
      const res = await axios.get(URLS.ProductById(id), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = res.data?.data || res.data || {};
      return {
        id: data._id || data.id || id,
        name: data.name || data.productName || `Product ${id}`,
        price: data.price || 0,
        image: (data.images && data.images[0]) || data.image || '',
      };
    } catch {
      return { id, name: `Product ${id}`, price: undefined, image: '' };
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await axios.get(URLS.UserOrders, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const raw = res.data?.orders || res.data?.data?.orders || res.data?.data || [];
        const normalized = Array.isArray(raw) ? raw.map(o => ({
          id: o._id || o.id,
          createdAt: o.createdAt || new Date().toISOString(),
          status: o.status || 'paid',
          deliveryStatus: o.deliveryStatus || 'placed',
          amount: o.amount,
          address: o.address || o.shippingAddress || {},
          items: Array.isArray(o.items) ? o.items.map(it => ({
            productId: String(it.productId || it.product || it._id),
            quantity: it.quantity || 1,
            name: it.name,
            price: it.price,
            image: it.image,
          })) : [],
        })) : [];

        const cache = new Map(productMap);
        for (const order of normalized) {
          for (let i = 0; i < order.items.length; i++) {
            const it = order.items[i];
            const cached = cache.get(it.productId);
            if (cached) {
              order.items[i] = { ...it, ...cached };
            } else {
              const fetched = await fetchProductById(it.productId, token);
              cache.set(it.productId, fetched);
              order.items[i] = { ...it, ...fetched };
            }
          }
        }

        setOrders(normalized);
      } catch (err) {
        console.error('Orders fetch error', err?.response?.data || err);
        toast({ title: 'Failed to load orders', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [user, productMap, toast]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-grey-800 mb-4">Please Login</h1>
            <p className="text-grey-600">You need to be logged in to view your orders.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-grey-800 mb-2">My Orders</h1>
            <p className="text-grey-600">Track your order status and history</p>
          </div>

          {loading ? (
            <Card><CardContent className="py-12 text-center">Loading orders…</CardContent></Card>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-16 h-16 text-grey-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-grey-800 mb-2">No Orders Yet</h3>
                <p className="text-grey-600">You haven't placed any orders yet. Start shopping to see your orders here!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Card key={order.id} className="p-4">
                  {/* Top Row - Payment Status & Date */}
                {/* Top Row - Payment Status & Date */}
<div className="flex justify-between items-start gap-4 mb-3">
  <div>
    <p className="text-sm font-semibold">Order #{order.id}</p>
    <p className="text-xs text-grey-600">
      {new Date(order.createdAt).toLocaleDateString()}
    </p>
  </div>
  <div className="flex flex-col items-end gap-2">
    <Badge className={`${getStatusColor(order.status)} text-white text-xs`}>
      <div className="flex items-center gap-1">
        {getStatusIcon(order.status)}
        <span>{order.status}</span>
      </div>
    </Badge>
    <button
      onClick={() => openOrderDetails(order)}
      className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
      aria-label="View order details"
    >
      <Eye className="w-6 h-6" />
      <span>View Details</span>
    </button>
  </div>
</div>

{/* Shipping Status Badge */}
{/* <div className="mb-3">
  <Badge className={`${getDeliveryStatusColor(order.deliveryStatus)} text-xs`}>
    <div className="flex items-center gap-1">
      {getDeliveryStatusIcon(order.deliveryStatus)}
      <span className="font-medium">{getDeliveryStatusLabel(order.deliveryStatus)}</span>
    </div>
  </Badge>
</div> */}


                  {/* Shipping Status Badge & View Details Button */}
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <Badge className={`${getDeliveryStatusColor(order.deliveryStatus)} text-xs`}>
                      <div className="flex items-center gap-1">
                        {getDeliveryStatusIcon(order.deliveryStatus)}
                        <span className="font-medium">{getDeliveryStatusLabel(order.deliveryStatus)}</span>
                      </div>
                    </Badge>
                    {/* <button
                      onClick={() => openOrderDetails(order)}
                      className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      aria-label="View order details"
                    >
                      <Eye className="w-6 h-6" />
                      <span>View Details</span>
                    </button> */}
                  </div>

                  {/* Product Item */}
                  <div className="flex gap-3 mb-3">
                    {order.items[0]?.image ? (
                      <img src={order.items[0].image} alt={order.items[0].name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">IMG</div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{order.items[0]?.name || 'Product'}</p>
                      <p className="text-xs text-grey-600">{order.items[0]?.quantity}x</p>
                      {order.items.length > 1 && (
                        <p className="text-xs text-blue-600">+{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}</p>
                      )}
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="border-t pt-2">
                    <p className="text-sm font-semibold">{formatINR(order.amount)}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Custom Modal - Styled Div Instead of Bootstrap Modal */}
      {showModal && selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
          style={{ overflow: 'auto' }}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex justify-between items-center p-4 border-b bg-white">
              <h5 className="text-lg font-semibold text-grey-800">
                Order Details #{selectedOrder.id}
              </h5>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-grey-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Order Status Section */}
              <div>
                <h6 className="font-semibold mb-2 text-grey-800">Order Status</h6>
                <div className="flex gap-2 flex-wrap">
                  <Badge className={`${getStatusColor(selectedOrder.status)} text-white`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedOrder.status)}
                      <span className="text-xs">{selectedOrder.status}</span>
                    </div>
                  </Badge>
                  <Badge className={`${getDeliveryStatusColor(selectedOrder.deliveryStatus)}`}>
                    <div className="flex items-center gap-1">
                      {getDeliveryStatusIcon(selectedOrder.deliveryStatus)}
                      <span className="text-xs font-medium">{getDeliveryStatusLabel(selectedOrder.deliveryStatus)}</span>
                    </div>
                  </Badge>
                </div>
                <p className="text-sm text-grey-600 mt-2">
                  Ordered on {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Order Items Section */}
              <div>
                <h6 className="font-semibold mb-3 text-grey-800">Order Items ({selectedOrder.items.length})</h6>
                <div className="space-y-2 border rounded-lg p-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-grey-100 rounded flex items-center justify-center text-xs text-grey-500">
                          No Image
                        </div>
                      )}
                      <div className="flex-1">
                        <h6 className="font-medium text-grey-800">{item.name || 'Product'}</h6>
                        <p className="text-sm text-grey-600">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-grey-800">
                          {item.price ? formatINR(item.price) : 'Price N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-grey-800">
                          {item.price ? formatINR(item.price * item.quantity) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address Section */}
              <div>
                <h6 className="font-semibold mb-2 text-grey-800">Shipping Address</h6>
                <div className="bg-grey-50 rounded-lg p-3 border border-grey-200">
                  {selectedOrder.address && Object.keys(selectedOrder.address).length > 0 ? (
                    <div className="space-y-1">
                      {selectedOrder.address.fullName && (
                        <p className="font-medium text-grey-800">{selectedOrder.address.fullName}</p>
                      )}
                      {selectedOrder.address.address && (
                        <p className="text-sm text-grey-700">{selectedOrder.address.address}</p>
                      )}
                      <p className="text-sm text-grey-700">
                        {[
                          selectedOrder.address.city,
                          selectedOrder.address.state,
                          selectedOrder.address.pincode
                        ].filter(Boolean).join(', ')}
                      </p>
                      {selectedOrder.address.phone && (
                        <p className="text-sm text-grey-700">
                          <span className="font-medium">Phone:</span> {selectedOrder.address.phone}
                        </p>
                      )}
                      {selectedOrder.address.email && (
                        <p className="text-sm text-grey-700">
                          <span className="font-medium">Email:</span> {selectedOrder.address.email}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-grey-600">No shipping address available</p>
                  )}
                </div>
              </div>

              {/* Order Summary Section */}
              <div>
                <h6 className="font-semibold mb-2 text-grey-800">Order Summary</h6>
                <div className="bg-grey-50 rounded-lg p-3 border border-grey-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-grey-700">Subtotal:</span>
                    <span className="font-medium text-grey-800">{formatINR(selectedOrder.amount)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-grey-700">Shipping:</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-grey-800">Total:</span>
                    <span className="font-bold text-blue-600 text-lg">{formatINR(selectedOrder.amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 flex justify-end gap-2 bg-grey-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-grey-300 text-grey-800 rounded hover:bg-grey-400 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
