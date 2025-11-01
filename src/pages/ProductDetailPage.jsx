// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, ShoppingCart, Heart, Minus, Plus, ArrowLeft, Share2, 
  TrendingUp, Shield, Truck, RefreshCw, Package, Award, 
  Check, X, ZoomIn, ChevronRight, MessageCircle 
} from 'lucide-react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel.jsx';
import { useApp } from '@/contexts/AppContext.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Separator } from '@/components/ui/separator.jsx';


const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, isProductsLoading, cartItems, addToCart, updateQuantity, removeFromCart, toggleWishlist, isInWishlist } = useApp();
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [saved, setSaved] = useState(false);


  // ✅ FIXED: Better product lookup with string conversion
  const product = useMemo(() => {
    if (!products || !Array.isArray(products) || products.length === 0) {
      return null;
    }
    
    const found = products.find(p => {
      const productId = String(p._id || p.id);
      const urlId = String(id);
      return productId === urlId || p.sku === id || p.SKU === id;
    });
    
    return found || null;
  }, [products, id]);

  const wishlistKey = product ? (product.sku || product.SKU || product._id || product.id) : null;
  const cartItem = cartItems.find(item => item.product?._id === product?._id || item.id === product?._id);
  const cartQuantity = cartItem?.quantity || 0;
  const isInStock = product && (product.inStock === true || product.inStock === undefined) && (product.quantity || 0) > 0;

// Add this helper function at the top of your component
const convertYouTubeUrl = (url) => {
  if (!url) return null;
  
  const videoIdMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  }
  
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  return null;
};

const productVideos = product 
  ? [product.youTubeUrl || product.youtubeUrl]
      .filter(Boolean)
      .map(convertYouTubeUrl)
      .filter(Boolean)
  : [];



  useEffect(() => {
    if (product && wishlistKey) {
      setSaved(isInWishlist(wishlistKey));
    }
  }, [product, wishlistKey, isInWishlist]);


  useEffect(() => {
    const handleWishlistUpdate = () => {
      if (wishlistKey) {
        setSaved(isInWishlist(wishlistKey));
      }
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);

    return () => window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  }, [wishlistKey, isInWishlist]);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);


  if (isProductsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-grey-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-brand-primary-200 border-t-brand-primary-600 rounded-full animate-spin" />
          <p className="mt-4 text-grey-600 font-medium">Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }


  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-grey-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-grey-900 mb-3">Product Not Found</h2>
            <p className="text-grey-600 mb-6">
              Sorry, we couldn't find the product you're looking for. It may have been removed or is temporarily unavailable.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button 
                onClick={() => navigate('/products')}
                className="bg-brand-primary-500 hover:bg-brand-primary-600"
              >
                Browse All Products
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }


  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };


  const handleAddToCart = () => {
    if (isInStock) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      toast({
        title: "Added to cart!",
        description: `${quantity} ${product.name || product.productName || 'item(s)'} added to your cart.`,
        variant: 'success',
      });
      setQuantity(1);
    }
  };


  const handleUpdateCartQuantity = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(product._id || product.id);
      toast({
        title: "Removed from cart",
        description: `${product.name || product.productName || 'Product'} removed from cart.`,
      });
    } else {
      updateQuantity(product._id || product.id, newQuantity);
    }
  };


  const handleToggleWishlist = async () => {
    if (!product) return;

    await toggleWishlist(product);
    setSaved(!saved);
    window.dispatchEvent(new Event("wishlist-updated"));
  };


  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: product.name || product.productName || 'Product',
      text: `Check out this product: ${product.name || product.productName || ''}`.trim(),
      url,
    };
    try {
      if (navigator.share && typeof navigator.share === 'function') {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: 'Link copied', description: 'Product link copied to clipboard.', variant: 'success' });
      }
    } catch (err) {
      toast({ title: 'Share failed', description: err.message || 'Unable to share.', variant: 'destructive' });
    }
  };


  const displayName = product.name || product.productName || 'Unnamed Product';
  const displaySKU = product.sku || product.SKU || product._id;
  const displayPrice = product.price || 0;
  const displayOriginalPrice = product.originalPrice || null;
  const displayRating = product.rating || 0;
  const displayReviews = product.reviewCounts || product.reviewsCount || product.reviews || 0;
  const displayDiscount = product.discount || 0;
  const displayCategory = product.category || 'General';
  const displayBrand = product.brand || '';
  const displayDescription = product.description || `High-quality ${displayCategory.toLowerCase()} product designed for professional use. Built with durable materials and precision engineering for reliable performance.`;
  const displayBadge = product.badge || (product.badges && product.badges[0]) || null;
  const displayWarranty = product.warranty || '';
  const displayQuantityAvailable = product.quantity || 0;
  //  const productVideos = product.videoUrls || [product.youTubeUrl || product.youtubeUrl].filter(Boolean);


  const productImages = product.images?.length
    ? product.images
    : product.imageUrls?.length
    ? product.imageUrls
    : [product.image || '/placeholder-product.png'];


  const specifications = [
    { label: 'SKU', value: displaySKU },
    displayCategory && { label: 'Category', value: displayCategory },
    { label: 'Availability', value: isInStock ? `In Stock (${displayQuantityAvailable} available)` : 'Out of Stock' },
    displayBrand && { label: 'Brand', value: displayBrand },
    displayWarranty && { label: 'Warranty', value: displayWarranty },
  ].filter(Boolean);


  const savingsAmount = displayOriginalPrice && displayOriginalPrice > displayPrice 
    ? displayOriginalPrice - displayPrice 
    : 0;


  const savingsPercentage = displayOriginalPrice && displayOriginalPrice > displayPrice
    ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
    : displayDiscount;


  return (
    <div className="min-h-screen flex flex-col bg-grey-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb & Back Button */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="hover:bg-white hover:shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-grey-600">
              <span className="hover:text-brand-primary-600 cursor-pointer transition-colors">Home</span>
              <ChevronRight className="w-4 h-4" />
              <span className="hover:text-brand-primary-600 cursor-pointer transition-colors">Products</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-grey-900 font-medium">{displayName}</span>
            </div>
          </div>


          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Product Images */}
            <div className="space-y-4">
              {/* Main Image with Zoom */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg group">
                <div className="aspect-square relative">
                  <img
                    src={productImages[selectedImageIndex]}
                    alt={`${displayName} - Image ${selectedImageIndex + 1}`}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isZoomed ? 'scale-150' : 'scale-100'
                    } group-hover:scale-110`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
                    <div className="flex flex-col gap-2">
                      {displayBadge && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-0 shadow-lg">
                          <Award className="w-3 h-3 mr-1" />
                          {displayBadge}
                        </Badge>
                      )}
                      {savingsPercentage > 0 && (
                        <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg">
                          -{savingsPercentage}% OFF
                        </Badge>
                      )}
                      {!isInStock && (
                        <Badge className="bg-grey-800/90 text-white border-0 shadow-lg backdrop-blur-sm">
                          <Package className="w-3 h-3 mr-1" />
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </div>


                  {/* Zoom Icon */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg">
                      <ZoomIn className="w-5 h-5 text-grey-700" />
                    </div>
                  </div>
                </div>
              </div>


         

              {/* Thumbnail Navigation */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-brand-primary-500 shadow-md scale-105' 
                          : 'border-grey-200 hover:border-grey-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${displayName} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

                   {/* Product Video Section */}
              {productVideos.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-grey-900 mb-3">Product Videos</h3>
                  <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-grey-200">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      {productVideos.map((video, index) => (
          <div key={index} className="w-full aspect-video rounded-2xl overflow-hidden relative">
            <iframe
              className="w-full h-full"
              src={video}  // ✅ NOW CORRECT - Embed URL format
              title={`Product Video ${index + 1}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        ))}
                    </div>
                  </div>
                </div>
              )}



              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-white border-grey-200">
                  <CardContent className="p-4 text-center">
                    <Shield className="w-6 h-6 text-brand-primary-500 mx-auto mb-2" />
                    <p className="text-xs font-medium text-grey-700">Secure Payment</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-grey-200">
                  <CardContent className="p-4 text-center">
                    <Truck className="w-6 h-6 text-brand-primary-500 mx-auto mb-2" />
                    <p className="text-xs font-medium text-grey-700">Fast Shipping</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-grey-200">
                  <CardContent className="p-4 text-center">
                    <RefreshCw className="w-6 h-6 text-brand-primary-500 mx-auto mb-2" />
                    <p className="text-xs font-medium text-grey-700">Easy Returns</p>
                  </CardContent>
                </Card>
              </div>
            </div>


            {/* Right Column - Product Details */}
            <div className="space-y-6">
              {/* Sticky Purchase Section */}
              <div className="lg:sticky lg:top-24 space-y-6">
                <Card className="bg-white rounded-2xl shadow-lg border-grey-200">
                  <CardContent className="p-6 space-y-5">
                    {/* Category & Brand */}
                    <div className="flex items-center justify-between">
                      {displayCategory && (
                        <Badge variant="outline" className="text-brand-primary-600 border-brand-primary-300">
                          {displayCategory}
                        </Badge>
                      )}
                      {displayBrand && (
                        <span className="text-sm text-grey-500 font-medium">{displayBrand}</span>
                      )}
                    </div>


                    {/* Product Name */}
                    <h1 className="text-3xl lg:text-4xl font-bold text-grey-900 leading-tight">
                      {displayName}
                    </h1>


                    {/* Rating */}
                    {displayRating > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(displayRating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : i < displayRating
                                  ? 'text-yellow-400 fill-yellow-400 opacity-50'
                                  : 'text-grey-300 fill-grey-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-lg font-semibold text-grey-900">{displayRating.toFixed(1)}</span>
                        {displayReviews > 0 && (
                          <span className="text-sm text-grey-500">({displayReviews} reviews)</span>
                        )}
                      </div>
                    )}


                    <Separator />


                    {/* Price Section */}
                    <div className="space-y-3">
                      <div className="flex items-end gap-3 flex-wrap">
                        <span className="text-4xl font-bold text-grey-900">
                          {formatPrice(displayPrice)}
                        </span>
                        {displayOriginalPrice && displayOriginalPrice > displayPrice && (
                          <span className="text-2xl text-grey-400 line-through font-medium">
                            {formatPrice(displayOriginalPrice)}
                          </span>
                        )}
                      </div>
                      
                      {savingsAmount > 0 && (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Save {formatPrice(savingsAmount)} ({savingsPercentage}%)
                          </Badge>
                        </div>
                      )}
                    </div>


                    <Separator />


                    {/* Stock Status */}
                    <div>
                      {isInStock ? (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl">
                          <Check className="w-5 h-5" />
                          <span className="font-semibold">In Stock - {displayQuantityAvailable} available</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                          <X className="w-5 h-5" />
                          <span className="font-semibold">Currently Out of Stock</span>
                        </div>
                      )}
                    </div>


                    {/* Quantity Selector (only if not in cart yet) */}
                    {cartQuantity === 0 && isInStock && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-grey-700">Quantity</label>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border-2 border-grey-300 rounded-xl overflow-hidden">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="h-12 w-12 hover:bg-grey-100"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="px-6 py-3 font-bold text-lg min-w-[60px] text-center">
                              {quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setQuantity(Math.min(displayQuantityAvailable, quantity + 1))}
                              className="h-12 w-12 hover:bg-grey-100"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <span className="text-sm text-grey-600">
                            Max: {displayQuantityAvailable}
                          </span>
                        </div>
                      </div>
                    )}


                    {/* Cart Management (if already in cart) */}
                    {cartQuantity > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-brand-primary-50 px-4 py-3 rounded-xl">
                          <span className="text-sm font-medium text-brand-primary-700">
                            {cartQuantity} item(s) in cart
                          </span>
                          <span className="font-bold text-brand-primary-900">
                            {formatPrice(displayPrice * cartQuantity)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border-2 border-grey-300 rounded-xl overflow-hidden flex-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateCartQuantity(cartQuantity - 1)}
                              className="h-12 w-12 hover:bg-grey-100"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="px-4 py-3 font-bold text-lg flex-1 text-center">
                              {cartQuantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateCartQuantity(cartQuantity + 1)}
                              className="h-12 w-12 hover:bg-grey-100"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}


                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                      {cartQuantity === 0 && (
                        <Button
                          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 shadow-lg hover:shadow-xl transition-all"
                          disabled={!isInStock}
                          onClick={handleAddToCart}
                        >
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          {isInStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      )}


                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          size="lg"
                          className="h-12 border-2 hover:bg-grey-50"
                          onClick={handleToggleWishlist}
                        >
                          <Heart
                            className={`w-5 h-5 mr-2 ${
                              saved ? 'text-red-500 fill-red-500' : ''
                            }`}
                          />
                          {saved ? 'Saved' : 'Save'}
                        </Button>


                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="h-12 border-2 hover:bg-grey-50"
                          onClick={handleShare}
                        >
                          <Share2 className="w-5 h-5 mr-2" />
                          Share
                        </Button>
                      </div>


                      {cartQuantity > 0 && (
                        <Button
                          variant="default"
                          size="lg"
                          className="w-full h-12 bg-brand-primary-500 hover:bg-brand-primary-600"
                          onClick={() => navigate('/cart')}
                        >
                          View Cart & Checkout
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>


                {/* Quick Specifications */}
                {specifications.length > 0 && (
                  <Card className="bg-white rounded-2xl shadow-md border-grey-200">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-grey-900 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-brand-primary-500" />
                        Product Details
                      </h3>
                      <div className="space-y-3">
                        {specifications.map((spec, index) => (
                          <div key={index} className="flex justify-between py-2 border-b border-grey-100 last:border-0">
                            <span className="text-sm text-grey-600 font-medium">{spec.label}</span>
                            <span className="text-sm font-semibold text-grey-900">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>


          {/* Tabbed Content Section */}
          <div className="mt-12">
            <Card className="bg-white rounded-2xl shadow-lg border-grey-200">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-14 bg-grey-100 p-1 rounded-xl">
                    <TabsTrigger 
                      value="description" 
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
                    >
                      Description
                    </TabsTrigger>
                    <TabsTrigger 
                      value="specifications"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
                    >
                      Specifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reviews"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
                    >
                      Reviews ({displayReviews})
                    </TabsTrigger>
                  </TabsList>


                  <TabsContent value="description" className="mt-6 space-y-4">
                    <h3 className="text-2xl font-bold text-grey-900">About This Product</h3>
                    <div className="prose prose-grey max-w-none">
                      <p className="text-grey-700 leading-relaxed text-lg">
                        {displayDescription}
                      </p>
                      
                      <div className="mt-6 space-y-3">
                        <h4 className="text-xl font-semibold text-grey-900">Key Features</h4>
                        <ul className="space-y-2 text-grey-700">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>High-quality construction with premium materials</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Designed for professional and home use</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Easy to use and maintain</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Exceptional durability and long-lasting performance</span>
                          </li>
                          {displayWarranty && (
                            <li className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>Backed by {displayWarranty} warranty</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>


                  <TabsContent value="specifications" className="mt-6">
                    <h3 className="text-2xl font-bold text-grey-900 mb-6">Technical Specifications</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {specifications.map((spec, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-4 bg-grey-50 rounded-xl hover:bg-grey-100 transition-colors"
                        >
                          <span className="text-grey-600 font-medium">{spec.label}</span>
                          <span className="font-bold text-grey-900">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>


                  <TabsContent value="reviews" className="mt-6">
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 text-grey-300 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-grey-900 mb-2">No Reviews Yet</h3>
                      <p className="text-grey-600 mb-6">Be the first to review this product!</p>
                      <Button size="lg" className="bg-brand-primary-500 hover:bg-brand-primary-600">
                        Write a Review
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};


export default ProductDetailPage;
