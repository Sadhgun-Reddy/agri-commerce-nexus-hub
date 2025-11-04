// import React, { useMemo, useState } from 'react';
// import { Truck, ArrowLeft } from 'lucide-react';
// import Header from '@/components/layout/Header.jsx';
// import Footer from '@/components/layout/Footer.jsx';
// import { Button } from '@/components/ui/button.jsx';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
// import { Input } from '@/components/ui/input.jsx';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
// import { Separator } from '@/components/ui/separator.jsx';
// // import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
// import { useApp } from '@/contexts/AppContext.jsx';
// import { Info } from "lucide-react";
// import { Link, useNavigate } from 'react-router-dom';
// import { useToast } from '@/hooks/use-toast.js';
// import axios from 'axios';
// import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
// import { URLS } from '../Urls';

// const CheckoutPage = () => {
//   const { cartItems } = useApp();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [errors, setErrors] = useState({});

//   const [shippingInfo, setShippingInfo] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: ''
//   });

//   const indianStates = [
//     'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
//   ];

//   const formatPrice = (price) =>
//     new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

//   // Adjust to your actual cart structure (fallbacks included)
//   const subtotal = useMemo(() => {
//     return cartItems.reduce((sum, item) => sum + ((item.price ?? item.product?.price ?? 0) * item.quantity), 0);
//   }, [cartItems]);

//   // const shipping = subtotal > 250 ? 0 : 250;
//   const shipping = 0;

//   const cgst = 0;
  
//   const sgst = 0;
//   const total = subtotal + shipping ;

//   const validate = () => {
//     const e = {};
//     if (!shippingInfo.fullName.trim()) e.fullName = 'Full name is required';
//     if (!shippingInfo.email.trim()) e.email = 'Email is required';
//     if (!/^\d{10}$/.test(shippingInfo.phone || '')) e.phone = 'Valid 10-digit phone required';
//     if (!shippingInfo.address.trim()) e.address = 'Address is required';
//     if (!shippingInfo.city.trim()) e.city = 'City is required';
//     if (!shippingInfo.state.trim()) e.state = 'State is required';
//     if (!/^\d{6}$/.test(shippingInfo.pincode || '')) e.pincode = 'Valid 6-digit pincode required';
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

// const handleReviewAndPay = async () => {
//   if (!validate()) return;
//   if (cartItems.length === 0) return;

//   try {
//     setIsProcessing(true);
//     const token = localStorage.getItem('authToken');

//  const { data } = await axios.post(
//   URLS.createOrder,
//   {
//     amount: total,                       // rupees (server will recompute)
//     items: cartItems.map(ci => ({
//       productId: ci.productId || ci.product?._id,
//       quantity: ci.quantity,
//     })),
//     address: {
//       fullName: shippingInfo.fullName.trim(),
//       email: shippingInfo.email.trim(),
//       phone: shippingInfo.phone.trim(),
//       address: shippingInfo.address.trim(),
//       city: shippingInfo.city.trim(),
//       state: shippingInfo.state.trim(),
//       pincode: shippingInfo.pincode.trim(),
//     },
//   },
//   { headers: { Authorization: `Bearer ${token}` } }
// );

//     const { orderId, amount, currency, razorpayKey, orderDbId } = data || {};
//     if (!orderId || !amount || !currency) {
//       console.error('Invalid createOrder response', data);
//       toast({ title: 'Order error', description: 'Invalid payment data', variant: 'destructive' });
//       setIsProcessing(false);
//       return;
//     }

//   const key = razorpayKey || import.meta.env.VITE_RAZORPAY_KEY_ID;
// if (!window.Razorpay || !key) {
//   toast({ title: 'Payment error', description: 'Razorpay is unavailable', variant: 'destructive' });
//   setIsProcessing(false);
//   return;
// }

//     const rzp = new window.Razorpay({
//       key,
//       order_id: orderId,
//       amount,               // paise from server
//       currency,             // 'INR'
//       name: 'kisan krushi',
//       description: 'Order Payment',
//       prefill: {
//         name: shippingInfo.fullName,
//         email: shippingInfo.email,
//         contact: shippingInfo.phone,
//       },
//       notes: { orderDbId },
//       theme: { color: '#3399cc' },
//       handler: async (resp) => {
//         try {
//           const verify = await axios.post(
//             URLS.verifypayment,
//             {
//               razorpay_order_id: resp.razorpay_order_id,
//               razorpay_payment_id: resp.razorpay_payment_id,
//               razorpay_signature: resp.razorpay_signature,
//               orderDbId,
//             },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           if (verify.data?.success) {
//             toast({ title: 'Payment Successful', description: 'Order confirmed' });
//             navigate('/orders');
//           } else {
//             toast({ title: 'Verification failed', description: 'Please contact support', variant: 'destructive' });
//             setIsProcessing(false);
//           }
//         } catch (e) {
//           toast({ title: 'Verification error', description: e.message || 'Please try again', variant: 'destructive' });
//           setIsProcessing(false);
//         }
//       },
//       modal: { ondismiss: () => setIsProcessing(false) },
//     });

//     rzp.open();
//   } catch (err) {
//     console.error('createOrder error', err?.response?.data || err);
//     toast({ title: 'Unable to create order', description: err?.response?.data?.message || 'Please try again', variant: 'destructive' });
//     setIsProcessing(false);
//   }
// };


//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-1 flex items-center justify-center">
//           <div className="text-center space-y-6">
//             <h1 className="text-3xl font-bold text-grey-800">Your cart is empty</h1>
//             <p className="text-grey-600">Add items to your cart before checkout</p>
//             <Link to="/products"><Button size="lg">Browse Products</Button></Link>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-1">
//         <div className="container mx-auto px-4 py-8">
//           <div className="flex items-center mb-8">
//             <Link to="/cart">
//               <Button variant="ghost" size="sm">
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Back to Cart
//               </Button>
//             </Link>
//             <h1 className="text-3xl font-bold text-grey-800 ml-4">Checkout</h1>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-8">
//             {/* Left: Shipping Info */}
//             <div className="lg:col-span-2 space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center">
//                     <Truck className="w-5 h-5 mr-2" />
//                     Shipping Information
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <Input
//                         placeholder="Full Name"
//                         value={shippingInfo.fullName}
//                         onChange={(e) => setShippingInfo(prev => ({ ...prev, fullName: e.target.value }))}
//                         required
//                       />
//                       {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
//                     </div>
//                     <div>
//                       <Input
//                         type="email"
//                         placeholder="Email Address"
//                         value={shippingInfo.email}
//                         onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
//                         required
//                       />
//                       {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
//                     </div>
//                   </div>
//                   <div>
//                     <Input
//                       placeholder="Phone Number"
//                       value={shippingInfo.phone}
//                       onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
//                       required
//                     />
//                     {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
//                   </div>
//                   <div>
//                     <Input
//                       placeholder="Address"
//                       value={shippingInfo.address}
//                       onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
//                       required
//                     />
//                     {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <Input
//                         placeholder="City"
//                         value={shippingInfo.city}
//                         onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
//                         required
//                       />
//                       {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
//                     </div>
//                     <Select
//                       value={shippingInfo.state}
//                       onValueChange={(value) => setShippingInfo(prev => ({ ...prev, state: value }))}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="State" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {indianStates.map((state) => (
//                           <SelectItem key={state} value={state}>
//                             {state}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <div>
//                       <Input
//                         placeholder="Pin Code"
//                         value={shippingInfo.pincode}
//                         onChange={(e) => setShippingInfo(prev => ({ ...prev, pincode: e.target.value }))}
//                         required
//                       />
//                       {errors.pincode && <p className="text-sm text-red-600 mt-1">{errors.pincode}</p>}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Right: Order Summary with Review & Pay */}
//             <div>
//               <Card className="sticky top-24">
//                 <CardHeader>
//                   <CardTitle>Order Summary</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-3">
//                     {cartItems.map((item) => (
//                       <div key={item.id || item._id} className="flex items-center space-x-3">
//                         <img
//                           src={item.image || item.product?.images?.[0] || '/placeholder.svg'}
//                           alt={item.name || item.product?.name || 'Product'}
//                           className="w-12 h-12 object-cover rounded-6"
//                         />
//                         <div className="flex-1">
//                           <p className="font-medium text-sm">{item.name || item.product?.name}</p>
//                           <p className="text-xs text-grey-600">Qty: {item.quantity}</p>
//                         </div>
//                         <p className="font-medium">{formatPrice((item.price ?? item.product?.price ?? 0) * item.quantity)}</p>
//                       </div>
//                     ))}
//                   </div>

//                   <Separator />

//                   <div className="space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-grey-600">Subtotal</span>
//                       <span className="font-medium">{formatPrice(subtotal)}</span>
//                     </div>
//    <div className="flex flex-col">
//   <div className="flex justify-between items-center">
//     <div className="flex items-center gap-1">
//       <span className="text-grey-600">Shipping</span>
//     </div>
//     <span className="font-medium">
//       {shipping === 0 ? 'Chargeable' : formatPrice(shipping)}
//     </span>
//   </div>

//   {/* Info text below with tooltip */}
//   <p className="text-sm text-red-500 mt-1 ml-2 pl-2 flex items-center gap-1">
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
//             <Info size={14} />
//           </button>
//         </TooltipTrigger>
//         <TooltipContent side="top">
//           <p>Additional charges may apply depending on your location.</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//     Charges are applicable based on the location
//   </p>
// </div>

                  
//                   </div>

//                   <Separator />

//                   <div className="flex justify-between text-lg font-bold">
//                     <span>Total</span>
//                     <span>{formatPrice(total)}</span>
//                   </div>

//                   <Button
//                     type="button"
//                     className="w-full"
//                     size="lg"
//                     onClick={handleReviewAndPay}
//                     disabled={isProcessing}
//                   >
//                     {isProcessing ? 'Processing...' : `Review & Pay`}
//                   </Button>
//                   <p className="text-xs text-grey-500 text-center">A secure Razorpay popup will open to complete payment</p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default CheckoutPage;




import React, { useMemo, useState } from 'react';
import { Truck, ArrowLeft, Info } from 'lucide-react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useApp } from '@/contexts/AppContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast.js';
import axios from 'axios';
import { URLS } from '../Urls';

const CheckoutPage = () => {
  const { cartItems } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const indianStates = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
  ];

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + ((item.price ?? item.product?.price ?? 0) * item.quantity), 0);
  }, [cartItems]);

  const shipping = 0;
  const cgst = 0;
  const sgst = 0;
  const total = subtotal + shipping;

  const validate = () => {
    const e = {};
    if (!shippingInfo.fullName.trim()) e.fullName = 'Full name is required';
    if (!shippingInfo.email.trim()) e.email = 'Email is required';
    if (!/^\d{10}$/.test(shippingInfo.phone || '')) e.phone = 'Valid 10-digit phone required';
    if (!shippingInfo.address.trim()) e.address = 'Address is required';
    if (!shippingInfo.city.trim()) e.city = 'City is required';
    if (!shippingInfo.state.trim()) e.state = 'State is required';
    if (!/^\d{6}$/.test(shippingInfo.pincode || '')) e.pincode = 'Valid 6-digit pincode required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePayment = async (amountToPay, paymentType = 'full') => {
    if (!validate()) return;
    if (cartItems.length === 0) return;

    try {
      setIsProcessing(true);
      const token = localStorage.getItem('authToken');

      const { data } = await axios.post(
        URLS.createOrder,
        {
          amount: amountToPay,
          items: cartItems.map(ci => ({
            productId: ci.productId || ci.product?._id,
            quantity: ci.quantity,
          })),
          address: shippingInfo,
          paymentType, // "full" or "advance"
          remainingAmount: paymentType === 'advance' ? total - 2000 : 0
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderId, amount, currency, razorpayKey, orderDbId } = data || {};
      if (!orderId || !amount || !currency) {
        toast({ title: 'Order error', description: 'Invalid payment data', variant: 'destructive' });
        setIsProcessing(false);
        return;
      }

      const key = razorpayKey || import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!window.Razorpay || !key) {
        toast({ title: 'Payment error', description: 'Razorpay is unavailable', variant: 'destructive' });
        setIsProcessing(false);
        return;
      }

      const rzp = new window.Razorpay({
        key,
        order_id: orderId,
        amount,
        currency,
        name: 'Kisan Krushi',
        description: paymentType === 'advance' ? 'Advance Payment' : 'Full Payment',
        prefill: {
          name: shippingInfo.fullName,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        notes: { orderDbId, paymentType },
        theme: { color: '#3399cc' },
        handler: async (resp) => {
          try {
            const verify = await axios.post(
              URLS.verifypayment,
              {
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
                orderDbId,
                paymentType,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verify.data?.success) {
              toast({
                title: paymentType === 'advance' ? 'Advance Payment Successful' : 'Payment Successful',
                description:
                  paymentType === 'advance'
                    ? `₹2000 paid. Remaining balance ₹${total - 2000} to be paid later.`
                    : 'Order confirmed successfully',
              });
              navigate('/orders');
            } else {
              toast({ title: 'Verification failed', description: 'Please contact support', variant: 'destructive' });
            }
          } catch (e) {
            toast({ title: 'Verification error', description: e.message || 'Please try again', variant: 'destructive' });
          } finally {
            setIsProcessing(false);
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
      });

      rzp.open();
    } catch (err) {
      toast({
        title: 'Unable to create order',
        description: err?.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold text-grey-800">Your cart is empty</h1>
            <p className="text-grey-600">Add items to your cart before checkout</p>
            <Link to="/products"><Button size="lg">Browse Products</Button></Link>
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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input placeholder="Full Name" value={shippingInfo.fullName} onChange={(e) => setShippingInfo(prev => ({ ...prev, fullName: e.target.value }))} />
                      {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <Input type="email" placeholder="Email Address" value={shippingInfo.email} onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))} />
                      {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <Input placeholder="Phone Number" value={shippingInfo.phone} onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))} />
                    {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <Input placeholder="Address" value={shippingInfo.address} onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))} />
                    {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Input placeholder="City" value={shippingInfo.city} onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))} />
                      {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
                    </div>
                    <Select value={shippingInfo.state} onValueChange={(value) => setShippingInfo(prev => ({ ...prev, state: value }))}>
                      <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div>
                      <Input placeholder="Pin Code" value={shippingInfo.pincode} onChange={(e) => setShippingInfo(prev => ({ ...prev, pincode: e.target.value }))} />
                      {errors.pincode && <p className="text-sm text-red-600 mt-1">{errors.pincode}</p>}
                    </div>
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
                  {cartItems.map((item) => (
                    <div key={item.id || item._id} className="flex items-center space-x-3">
                      <img src={item.image || item.product?.images?.[0] || '/placeholder.svg'} alt={item.name || item.product?.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name || item.product?.name}</p>
                        <p className="text-xs text-grey-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatPrice((item.price ?? item.product?.price ?? 0) * item.quantity)}</p>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>

                  <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span>Shipping</span>
                      </div>
                      <span className="font-medium">{shipping === 0 ? 'Chargeable' : formatPrice(shipping)}</span>
                    </div>
                    <p className="text-sm text-red-500 mt-1 ml-2 pl-2 flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
                              <Info size={14} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Additional charges may apply depending on your location.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      Charges are applicable based on the location
                    </p>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  {/* Full Payment */}
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => handlePayment(total, 'full')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Pay Full Amount`}
                  </Button>

                  {/* Advance Payment */}
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    size="lg"
                    onClick={() => handlePayment(2000, 'advance')}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Pay ₹2000 in Advance'}
                  </Button>

                  <p className="text-xs text-grey-500 text-center">A secure Razorpay popup will open to complete payment</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
