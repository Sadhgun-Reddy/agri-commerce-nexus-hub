import React, { useEffect, useMemo, useState } from 'react';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
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
          amount: o.amount,              // rupees per your verify response
          address: o.address || o.shippingAddress || {},
          items: Array.isArray(o.items) ? o.items.map(it => ({
            productId: String(it.productId || it.product || it._id),
            quantity: it.quantity || 1,
            // will enrich below
            name: it.name,
            price: it.price,
            image: it.image,
          })) : [],
        })) : [];

        // Enrich with product details based on productId
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
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order {order.id}</CardTitle>
                        <p className="text-sm text-grey-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Items */}
                      <div>
                        <h4 className="font-semibold mb-3">Items Ordered</h4>
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={`${item.productId}-${idx}`} className="flex items-center space-x-3">
                              {item.image ? (
                                <img src={item.image} alt={item.name || item.productId} className="w-12 h-12 object-cover rounded" />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">IMG</div>
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.name || `Product ${item.productId}`}</p>
                                <p className="text-xs text-grey-600">Qty: {item.quantity}</p>
                              </div>
                              {typeof item.price === 'number' ? (
                                <p className="font-medium">{formatINR(item.price * item.quantity)}</p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping + Total */}
                      <div>
                        <h4 className="font-semibold mb-3">Shipping Address</h4>
                        <div className="text-sm text-grey-600 mb-4">
                          <p>{order.address?.fullName}</p>
                          <p>{order.address?.address}</p>
                          <p>{order.address?.city}, {order.address?.state} {order.address?.pincode}</p>
                          {order.address?.phone ? <p>Phone: {order.address.phone}</p> : null}
                          {order.address?.email ? <p>Email: {order.address.email}</p> : null}
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Total</span>
                            <span className="font-bold text-lg">{formatINR(order.amount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;
