// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, ShoppingCart, Heart, Minus, Plus, ArrowLeft, Share2, 
  Shield, Truck, RefreshCw, Package, Award, 
  Check, X, ZoomIn, ChevronRight, MessageCircle 
} from 'lucide-react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { useApp } from '@/contexts/AppContext.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Separator } from '@/components/ui/separator.jsx';

// Optimized sub-components
const ProductImageGallery = ({ 
  images, 
  selectedImageIndex, 
  onImageSelect, 
  productName 
}) => (
  <div className="space-y-4">
    <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg group aspect-square">
      <img
        src={images[selectedImageIndex]}
        alt={`${productName} - Main view`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    
    {images.length > 1 && (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              selectedImageIndex === index 
                ? 'border-brand-primary-500 shadow-md' 
                : 'border-grey-200 hover:border-grey-300'
            }`}
          >
            <img
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    )}
  </div>
);

const ProductVideoSection = ({ videos, productName }) => {
  if (!videos.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-grey-900 mb-3">Product Video</h3>
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-grey-200">
        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src={videos[0]}
            title={`${productName} video`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

const TrustBadges = () => (
  <div className="grid grid-cols-3 gap-3 mt-6">
    {[
      { icon: Shield, label: 'Secure Payment' },
      { icon: Truck, label: 'Fast Shipping' },
      { icon: RefreshCw, label: 'Easy Returns' }
    ].map(({ icon: Icon, label }, index) => (
      <Card key={index} className="bg-white border-grey-200 hover:shadow-md transition-shadow">
        <CardContent className="p-3 text-center">
          <Icon className="w-5 h-5 text-brand-primary-500 mx-auto mb-1" />
          <p className="text-xs font-medium text-grey-700">{label}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

const QuantitySelector = ({ 
  quantity, 
  onQuantityChange, 
  maxQuantity,
  isInCart = false 
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-grey-700">
      {isInCart ? 'Update Quantity' : 'Quantity'}
    </label>
    <div className="flex items-center gap-3">
      <div className="flex items-center border-2 border-grey-300 rounded-xl overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="h-10 w-10 hover:bg-grey-100"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="px-4 py-2 font-bold text-base min-w-[50px] text-center">
          {quantity}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
          className="h-10 w-10 hover:bg-grey-100"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <span className="text-sm text-grey-600">Max: {maxQuantity}</span>
    </div>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    products, 
    isProductsLoading, 
    cartItems, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    toggleWishlist, 
    isInWishlist 
  } = useApp();
  
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [saved, setSaved] = useState(false);

  // YouTube URL conversion helper
  const convertYouTubeUrl = useCallback((url) => {
    if (!url) return null;
    
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    
    return videoIdMatch?.[1] 
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : url.includes('youtube.com/embed/') ? url : null;
  }, []);

  // Optimized product lookup
  const product = useMemo(() => {
    if (!products?.length) return null;
    
    return products.find(p => 
      String(p._id || p.id) === String(id) || 
      p.sku === id || 
      p.SKU === id
    ) || null;
  }, [products, id]);

  // Product data normalization
  const productData = useMemo(() => {
    if (!product) return null;

    const name = product.name || product.productName || 'Unnamed Product';
    const price = product.price || 0;
    const originalPrice = product.originalPrice || null;
    const discount = product.discount || 0;
    const rating = product.rating || 0;
    const reviews = product.reviewCounts || product.reviewsCount || product.reviews || 0;
    const category = product.category || 'General';
    const brand = product.brand || '';
    const description = product.description || `High-quality ${category.toLowerCase()} product designed for professional use.`;
    const badge = product.badge || (product.badges && product.badges[0]) || null;
    const warranty = product.warranty || '';
    const quantityAvailable = product.quantity || 0;
    const sku = product.sku || product.SKU || product._id;
    const inStock = product.inStock !== false && quantityAvailable > 0;

    // Calculate savings
    const savingsAmount = originalPrice && originalPrice > price ? originalPrice - price : 0;
    const savingsPercentage = originalPrice && originalPrice > price 
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : discount;

    // Process images
    const images = product.images?.length 
      ? product.images 
      : product.imageUrls?.length 
        ? product.imageUrls 
        : [product.image || '/placeholder-product.png'];

    // Process videos
    const videos = [product.youTubeUrl || product.youtubeUrl]
      .filter(Boolean)
      .map(convertYouTubeUrl)
      .filter(Boolean);

    return {
      name,
      price,
      originalPrice,
      discount,
      rating,
      reviews,
      category,
      brand,
      description,
      badge,
      warranty,
      quantityAvailable,
      sku,
      inStock,
      savingsAmount,
      savingsPercentage,
      images,
      videos,
      _id: product._id || product.id
    };
  }, [product, convertYouTubeUrl]);

  // Wishlist management
  const wishlistKey = productData?.sku;
  useEffect(() => {
    if (wishlistKey) {
      setSaved(isInWishlist(wishlistKey));
    }
  }, [wishlistKey, isInWishlist]);

  const cartItem = useMemo(() => 
    cartItems.find(item => item.product?._id === productData?._id || item.id === productData?._id),
    [cartItems, productData]
  );

  const cartQuantity = cartItem?.quantity || 0;

  // Scroll to top on product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Handlers
  const handleAddToCart = useCallback(() => {
    if (!productData?.inStock) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    toast({
      title: "Added to cart!",
      description: `${quantity} ${productData.name} added to your cart.`,
      variant: 'success',
    });
    setQuantity(1);
  }, [productData, quantity, addToCart, toast]);

  const handleUpdateCartQuantity = useCallback((newQuantity) => {
    if (!productData) return;

    if (newQuantity <= 0) {
      removeFromCart(productData._id);
      toast({
        title: "Removed from cart",
        description: `${productData.name} removed from cart.`,
      });
    } else {
      updateQuantity(productData._id, newQuantity);
    }
  }, [productData, removeFromCart, updateQuantity, toast]);

  const handleToggleWishlist = useCallback(async () => {
    if (!product) return;

    await toggleWishlist(product);
    setSaved(!saved);
  }, [product, toggleWishlist, saved]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const shareData = {
      title: productData?.name,
      text: `Check out this product: ${productData?.name}`,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast({ 
          title: 'Link copied', 
          description: 'Product link copied to clipboard.', 
          variant: 'success' 
        });
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast({ 
          title: 'Share failed', 
          description: 'Unable to share product.', 
          variant: 'destructive' 
        });
      }
    }
  }, [productData, toast]);

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  }, []);

  // Loading state
  if (isProductsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-grey-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brand-primary-200 border-t-brand-primary-600 rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-grey-600 font-medium">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Product not found state
  if (!productData) {
    return (
      <div className="min-h-screen flex flex-col bg-grey-50">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-grey-900 mb-3">Product Not Found</h2>
            <p className="text-grey-600 mb-6">
              Sorry, we couldn't find the product you're looking for.
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
                Browse Products
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const {
    name,
    price,
    originalPrice,
    rating,
    reviews,
    category,
    brand,
    description,
    badge,
    warranty,
    quantityAvailable,
    sku,
    inStock,
    savingsAmount,
    savingsPercentage,
    images,
    videos
  } = productData;

  const specifications = [
    { label: 'SKU', value: sku },
    { label: 'Category', value: category },
    { label: 'Availability', value: inStock ? `In Stock (${quantityAvailable} available)` : 'Out of Stock' },
    ...(brand ? [{ label: 'Brand', value: brand }] : []),
    ...(warranty ? [{ label: 'Warranty', value: warranty }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-grey-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="hover:bg-white hover:shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-grey-600">
              <button 
                onClick={() => navigate('/')}
                className="hover:text-brand-primary-600 transition-colors"
              >
                Home
              </button>
              <ChevronRight className="w-4 h-4" />
              <button 
                onClick={() => navigate('/products')}
                className="hover:text-brand-primary-600 transition-colors"
              >
                Products
              </button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-grey-900 font-medium truncate max-w-[200px]">
                {name}
              </span>
            </div>
          </nav>

          {/* Main Product Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Media */}
            <div className="space-y-6">
              <ProductImageGallery
                images={images}
                selectedImageIndex={selectedImageIndex}
                onImageSelect={setSelectedImageIndex}
                productName={name}
              />
              
              <ProductVideoSection videos={videos} productName={name} />
              <TrustBadges />
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              <div className="lg:sticky lg:top-24 space-y-6">
                <Card className="bg-white rounded-2xl shadow-lg border-grey-200">
                  <CardContent className="p-6 space-y-5">
                    {/* Category & Brand */}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-brand-primary-600 border-brand-primary-300">
                        {category}
                      </Badge>
                      {brand && (
                        <span className="text-sm text-grey-500 font-medium">{brand}</span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h1 className="text-2xl lg:text-3xl font-bold text-grey-900 leading-tight">
                      {name}
                    </h1>

                    {/* Rating */}
                    {rating > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(rating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-grey-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-base font-semibold text-grey-900">
                          {rating.toFixed(1)}
                        </span>
                        {reviews > 0 && (
                          <span className="text-sm text-grey-500">({reviews} reviews)</span>
                        )}
                      </div>
                    )}

                    <Separator />

                    {/* Price Section */}
                    <div className="space-y-2">
                      <div className="flex items-end gap-3 flex-wrap">
                        <span className="text-3xl font-bold text-grey-900">
                          {formatPrice(price)}
                        </span>
                        {originalPrice && originalPrice > price && (
                          <span className="text-xl text-grey-400 line-through font-medium">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      {savingsAmount > 0 && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Save {formatPrice(savingsAmount)} ({savingsPercentage}%)
                        </Badge>
                      )}
                    </div>

                    <Separator />

                    {/* Stock Status */}
                    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                      inStock 
                        ? 'text-green-600 bg-green-50' 
                        : 'text-red-600 bg-red-50'
                    }`}>
                      {inStock ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                      <span className="font-semibold">
                        {inStock ? `In Stock - ${quantityAvailable} available` : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Top Badges */}
                    <div className="flex flex-wrap gap-2">
                      {badge && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
                          <Award className="w-3 h-3 mr-1" />
                          {badge}
                        </Badge>
                      )}
                      {savingsPercentage > 0 && (
                        <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                          -{savingsPercentage}% OFF
                        </Badge>
                      )}
                    </div>

                    {/* Quantity & Cart Management */}
                    {cartQuantity === 0 ? (
                      inStock && (
                        <QuantitySelector
                          quantity={quantity}
                          onQuantityChange={setQuantity}
                          maxQuantity={quantityAvailable}
                        />
                      )
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-brand-primary-50 px-4 py-3 rounded-xl">
                          <span className="text-sm font-medium text-brand-primary-700">
                            {cartQuantity} item(s) in cart
                          </span>
                          <span className="font-bold text-brand-primary-900">
                            {formatPrice(price * cartQuantity)}
                          </span>
                        </div>
                        <QuantitySelector
                          quantity={cartQuantity}
                          onQuantityChange={handleUpdateCartQuantity}
                          maxQuantity={quantityAvailable}
                          isInCart={true}
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                      {cartQuantity === 0 ? (
                        <Button
                          className="w-full h-12 text-base font-semibold bg-brand-primary-500 hover:bg-brand-primary-600 shadow-lg"
                          disabled={!inStock}
                          onClick={handleAddToCart}
                        >
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          {inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="lg"
                          className="w-full h-12 bg-brand-primary-500 hover:bg-brand-primary-600"
                          onClick={() => navigate('/cart')}
                        >
                          View Cart & Checkout
                        </Button>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          size="lg"
                          className="h-11 border-2 hover:bg-grey-50"
                          onClick={handleToggleWishlist}
                        >
                          <Heart
                            className={`w-4 h-4 mr-2 ${
                              saved ? 'text-red-500 fill-red-500' : ''
                            }`}
                          />
                          {saved ? 'Saved' : 'Save'}
                        </Button>

                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="h-11 border-2 hover:bg-grey-50"
                          onClick={handleShare}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Specifications */}
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
                          <span className="text-sm font-semibold text-grey-900 text-right">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Tabbed Content Section */}
          <div className="mt-12">
            <Card className="bg-white rounded-2xl shadow-lg border-grey-200">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-12 bg-grey-100 p-1 rounded-xl">
                    <TabsTrigger value="description" className="rounded-lg font-semibold">
                      Description
                    </TabsTrigger>
                    <TabsTrigger value="specifications" className="rounded-lg font-semibold">
                      Specifications
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="rounded-lg font-semibold">
                      Reviews ({reviews})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="mt-6 space-y-4">
                    <h3 className="text-xl font-bold text-grey-900">Product Description</h3>
                    <p className="text-grey-700 leading-relaxed">
                      {description}
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-grey-900">Key Features</h4>
                      <ul className="space-y-2 text-grey-700">
                        {[
                          'High-quality construction with premium materials',
                          'Designed for professional and home use',
                          'Easy to use and maintain',
                          'Exceptional durability and long-lasting performance',
                          ...(warranty ? [`Backed by ${warranty} warranty`] : [])
                        ].map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="specifications" className="mt-6">
                    <h3 className="text-xl font-bold text-grey-900 mb-6">Technical Specifications</h3>
                    <div className="grid gap-3">
                      {specifications.map((spec, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-3 bg-grey-50 rounded-xl"
                        >
                          <span className="text-grey-600 font-medium">{spec.label}</span>
                          <span className="font-bold text-grey-900">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-6">
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-grey-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-grey-900 mb-2">No Reviews Yet</h3>
                      <p className="text-grey-600 mb-6">Be the first to review this product!</p>
                      <Button className="bg-brand-primary-500 hover:bg-brand-primary-600">
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