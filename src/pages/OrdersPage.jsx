// src/pages/OrdersPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Package, Clock, Truck, CheckCircle, XCircle, Eye, X, CreditCard, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useApp } from '@/contexts/AppContext.jsx';
import { useToast } from '@/hooks/use-toast.js';
import axios from 'axios';
import { URLS } from '../Urls.jsx';

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

  const handlePayRemaining = async (order) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast({
          title: "❌ Authentication Required",
          description: "Please login to continue payment",
          variant: "destructive",
          className: "bg-red-50 border-red-500 text-red-900",
        });
        return;
      }

      toast({
        title: "⏳ Processing...",
        description: "Initiating payment gateway",
        className: "bg-blue-50 border-blue-200",
      });

      const res = await axios.post(
        URLS.remainingAmount,
        { orderId: order.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;

      if (!data.success) {
        toast({
          title: "❌ Payment Failed",
          description: data.message || "Could not initiate payment",
          variant: "destructive",
          className: "bg-red-50 border-red-500 text-red-900",
        });
        return;
      }

      const { key, amount, currency, orderId: razorpayOrderId } = data;

      if (!razorpayOrderId || !amount || !key) {
        toast({
          title: "❌ Configuration Error",
          description: "Invalid payment configuration",
          variant: "destructive",
          className: "bg-red-50 border-red-500 text-red-900",
        });
        return;
      }

      const options = {
        key,
        amount,
        currency: currency || "INR",
        order_id: razorpayOrderId,
        name: "Kisan Krushi",
        description: "Remaining Payment",
        
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              URLS.verifypayment,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentType: "remaining",
                orderId: order.id,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              toast({
                title: "✅ Payment Successful!",
                description: "Your remaining balance has been paid.",
                className: "bg-green-50 border-green-500 text-green-900",
              });
              setTimeout(() => window.location.reload(), 1500);
            } else {
              toast({
                title: "❌ Verification Failed",
                description: verifyRes.data.message || "Payment received but verification failed",
                variant: "destructive",
                className: "bg-red-50 border-red-500 text-red-900",
              });
            }
          } catch (verifyError) {
            toast({
              title: "❌ Verification Error",
              description: "Payment received but could not verify",
              variant: "destructive",
              className: "bg-red-50 border-red-500 text-red-900",
            });
          }
        },

        prefill: {
          name: order.address?.fullName || "",
          contact: order.address?.phone || "",
          email: order.address?.email || "",
        },

        theme: { color: "#10b981" },

        modal: {
          ondismiss: function() {
            toast({
              title: "⚠️ Payment Cancelled",
              description: "You closed the payment window",
              className: "bg-yellow-50 border-yellow-500 text-yellow-900",
            });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast({
        title: "❌ Payment Failed",
        description: err.response?.data?.message || "Could not process payment",
        variant: "destructive",
        className: "bg-red-50 border-red-500 text-red-900",
      });
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
        if (!user) return setLoading(false);

        const token = localStorage.getItem("authToken");
        if (!token) return setLoading(false);

        const res = await axios.get(URLS.UserOrders, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const raw = res.data?.orders || [];

        const normalized = raw.map((o) => {
          let remaining = 0;
          let paidAmount = 0;
          let paymentStatus = (o.paymentStatus || "").toLowerCase();

          if (o.paymentType === "advance") {
            paidAmount = o.advanceAmount || 0;
            remaining = (o.amount || 0) - paidAmount;
            paymentStatus = remaining > 0 ? "partially paid" : "paid";
          } else if (o.paymentType === "full") {
            paidAmount = o.amount || 0;
            remaining = 0;
            paymentStatus = "paid";
          }

          remaining = Math.max(0, Number(remaining) || 0);

          return {
            id: o._id,
            createdAt: o.createdAt,
            amount: o.amount,
            paidAmount,
            paymentType: o.paymentType,
            paymentStatus,
            remainingAmount: remaining,
            deliveryStatus: o.deliveryStatus,
            status: o.status.toLowerCase(),
            address: o.address || {},

            items: (o.items || []).map((it) => {
              const p = it.product || {};
              return {
                productId: p._id || it.productId,
                quantity: it.quantity,
                name: p.productName || it.name,
                price: p.price || it.price,
                image: p.images?.[0] || it.image,
              };
            }),
          };
        });

        const cache = new Map(productMap);

        for (const order of normalized) {
          for (let i = 0; i < order.items.length; i++) {
            const item = order.items[i];
            const pid = item.productId;

            let productData = cache.get(pid);
            if (!productData) {
              productData = await fetchProductById(pid, token);
              cache.set(pid, productData);
            }

            order.items[i] = {
              ...item,
              name: item.name || productData.name,
              price: item.price || productData.price,
              image: item.image || productData.image,
            };
          }
        }

        setOrders(normalized);
      } catch (err) {
        console.error("Orders fetch error:", err);
        toast({
          title: "Failed to load orders",
          variant: "destructive",
        });
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

                      <div className="flex flex-col items-end gap-1">
                        {/* Show remaining amount ONLY if payment is partial */}
                        {order.remainingAmount > 0 && order.paymentStatus === "partially paid" && (
                          <p className="text-sm font-semibold text-red-600">
                            Remaining: {formatINR(order.remainingAmount)}
                          </p>
                        )}

                        <div className="flex items-center gap-2">
                          {/* Pay Now button - ONLY visible for partial payments */}
                          {order.remainingAmount > 0 && order.paymentStatus === "partially paid" && (
                            <button
                              onClick={() => handlePayRemaining(order)}
                              className="px-4 py-1.5 text-xs font-semibold rounded bg-gradient-to-r from-green-500 to-green-600 
                                       text-white shadow hover:from-green-600 hover:to-green-700 
                                       transition-all transform hover:scale-105"
                            >
                              Pay Now
                            </button>
                          )}

                          <button
                            onClick={() => openOrderDetails(order)}
                            className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Eye className="w-6 h-6" />
                            <span>View Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <Badge className={`${getDeliveryStatusColor(order.deliveryStatus)} text-xs`}>
                      <div className="flex items-center gap-1">
                        {getDeliveryStatusIcon(order.deliveryStatus)}
                        <span className="font-medium">{getDeliveryStatusLabel(order.deliveryStatus)}</span>
                      </div>
                    </Badge>
                  </div>

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

      {/* MODAL WITH PAYMENT DETAILS */}
      {showModal && selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
          style={{ overflow: 'auto' }}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex justify-between items-center p-4 border-b bg-white z-10">
              <h5 className="text-lg font-semibold text-grey-800">
                Order Details #{selectedOrder.id}
              </h5>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-6 h-6 text-grey-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* PAYMENT BREAKDOWN SECTION - Only show if remaining amount */}
              {selectedOrder.remainingAmount > 0 && selectedOrder.paymentStatus === "partially paid" && (
                <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-5 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <h6 className="text-lg font-bold text-red-700">Payment Pending</h6>
                  </div>

                  <div className="bg-white rounded-lg p-4 space-y-3 mb-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm font-medium text-grey-700">Total Order Amount:</span>
                      <span className="text-lg font-bold text-grey-900">{formatINR(selectedOrder.amount)}</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm font-medium text-grey-700">Amount Paid:</span>
                      <span className="text-lg font-semibold text-green-600">{formatINR(selectedOrder.paidAmount || 0)}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-base font-bold text-grey-800">Remaining Amount:</span>
                      <span className="text-2xl font-extrabold text-red-600">{formatINR(selectedOrder.remainingAmount)}</span>
                    </div>
                  </div>

                  {/* PAY NOW BUTTON INSIDE MODAL */}
                  <button
                    onClick={() => handlePayRemaining(selectedOrder)}
                    className="w-full py-4 text-lg font-bold rounded-lg bg-gradient-to-r 
                             from-green-500 via-green-600 to-green-700 text-white 
                             shadow-lg hover:shadow-xl hover:from-green-600 
                             hover:via-green-700 hover:to-green-800 
                             transition-all transform hover:scale-105 
                             active:scale-95 flex items-center justify-center gap-3 
                             border-2 border-green-400"
                  >
                    <CreditCard className="w-6 h-6" />
                    Pay {formatINR(selectedOrder.remainingAmount)} Now
                  </button>

                  <p className="text-xs text-center text-grey-600 mt-3">
                    Secure payment powered by Razorpay
                  </p>
                </div>
              )}

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
                        <p className="text-sm text-grey-600">Qty: {item.quantity}</p>
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
