import React, { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext.jsx';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, user, loadCartFromServer } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (user && token) {
      loadCartFromServer(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 50000 ? 0 : 500;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-grey-800 mb-4">Your Cart is Empty</h1>
            <p className="text-grey-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-grey-800 mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = item.product;
              return (
                <Card key={item._id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product?.images?.[0] || '/placeholder.svg'}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.svg'; }}
                        alt={product?.name || product?.productName || 'Product'}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-grey-800">{product?.name || product?.productName}</h3>
                        <p className="text-grey-600 text-sm">SKU: {product?.SKU || 'N/A'}</p>
                        <p className="font-bold text-lg mt-2">{formatPrice(product?.price)}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="icon"
                           onClick={() => updateQuantity(product._id, "decrement")}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(product._id, "increment")}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFromCart(product._id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping > 0 ? formatPrice(shipping) : 'Free'}</span></div>
                <div className="flex justify-between"><span>Tax (GST 18%)</span><span>{formatPrice(tax)}</span></div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <Link to="/checkout">
                  <Button className="w-full" size="lg">Proceed to Checkout</Button>
                </Link>
                <Link to="/products">
                  <Button variant="outline" className="w-full">Continue Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
