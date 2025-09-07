import React, { useState } from 'react';
import { CreditCard, Truck, Shield, ArrowLeft, Smartphone, Landmark } from 'lucide-react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useApp } from '@/contexts/AppContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast.js';

const CheckoutPage = () => {
  const { cartItems } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: ''
  });

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 25000 ? 0 : 2500;
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const total = subtotal + shipping + cgst + sgst;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Mock payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Order Placed Successfully!",
        description: "You will receive a confirmation email shortly.",
      });
      navigate('/');
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold text-grey-800">Your cart is empty</h1>
            <p className="text-grey-600">Add items to your cart before checkout</p>
            <Link to="/products">
              <Button size="lg">Browse Products</Button>
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
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Link to="/cart">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-grey-800 ml-4">Checkout</h1>
          </div>

          <form onSubmit={handlePlaceOrder}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="w-5 h-5 mr-2" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Full Name"
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Email Address"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <Input
                      placeholder="Phone Number"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                    <Input
                      placeholder="Address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                      required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="City"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                        required
                      />
                      <Select
                        value={shippingInfo.state}
                        onValueChange={(value) => setShippingInfo(prev => ({ ...prev, state: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Pin Code"
                        value={shippingInfo.pincode}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, pincode: e.target.value }))}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                          <CreditCard className="w-5 h-5" />
                          <span>Credit/Debit Card</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center space-x-2 cursor-pointer">
                          <Smartphone className="w-5 h-5" />
                          <span>UPI</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="netbanking" id="netbanking" />
                        <Label htmlFor="netbanking" className="flex items-center space-x-2 cursor-pointer">
                          <Landmark className="w-5 h-5" />
                          <span>Net Banking</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {paymentMethod === 'card' && <CreditCard className="w-5 h-5 mr-2" />}
                      {paymentMethod === 'upi' && <Smartphone className="w-5 h-5 mr-2" />}
                      {paymentMethod === 'netbanking' && <Landmark className="w-5 h-5 mr-2" />}
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {paymentMethod === 'card' && (
                      <>
                        <Input
                          placeholder="Card Number"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                          required
                        />
                        <Input
                          placeholder="Cardholder Name"
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardName: e.target.value }))}
                          required
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                            required
                          />
                          <Input
                            placeholder="CVV"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                            required
                          />
                        </div>
                      </>
                    )}
                    {paymentMethod === 'upi' && (
                      <Input
                        placeholder="UPI ID (e.g., yourname@paytm)"
                        value={paymentInfo.upiId}
                        onChange={(e) => setPaymentInfo(prev => ({ ...prev, upiId: e.target.value }))}
                        required
                      />
                    )}
                    {paymentMethod === 'netbanking' && (
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sbi">State Bank of India</SelectItem>
                          <SelectItem value="hdfc">HDFC Bank</SelectItem>
                          <SelectItem value="icici">ICICI Bank</SelectItem>
                          <SelectItem value="axis">Axis Bank</SelectItem>
                          <SelectItem value="pnb">Punjab National Bank</SelectItem>
                          <SelectItem value="other">Other Banks</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-grey-600">
                      <Shield className="w-4 h-4" />
                      <span>Your payment information is encrypted and secure</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-6"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-grey-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Price Breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-grey-600">Subtotal</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-grey-600">Shipping</span>
                        <span className="font-medium">
                          {shipping === 0 ? 'Free' : formatPrice(shipping)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-grey-600">CGST (9%)</span>
                        <span className="font-medium">{formatPrice(cgst)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-grey-600">SGST (9%)</span>
                        <span className="font-medium">{formatPrice(sgst)}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
