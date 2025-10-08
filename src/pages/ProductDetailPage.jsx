import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Minus, Plus, ArrowLeft, Share2 } from 'lucide-react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel.jsx';
import { useApp } from '@/contexts/AppContext.jsx';
import { useToast } from '@/hooks/use-toast.js';

const ProductDetailPage = () => {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { products, cartItems, addToCart, updateQuantity, removeFromCart, toggleWishlist, isInWishlist } = useApp();
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product = products.find(p => p.sku === sku || p._id === sku);
  const wishlistKey = product ? (product.sku || product._id || product.id) : null;
  const cartItem = cartItems.find(item => item.id === product?._id);
  const quantity = cartItem?.quantity || 0;
  const isInStock = (product?.quantity || 0) > 0;

  useEffect(() => {
    if (!product) {
      navigate('/products');
    }
  }, [product, navigate]);

  if (!product) return null;
  

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (isInStock) {
      addToCart(product);
      toast({
        title: "Added to cart!",
        description: `${product.name || 'Product'} has been added to your cart.`,
        variant: 'success',
      });
    }
  };

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(product._id);
      toast({
        title: "Removed from cart",
        description: `${product.name || 'Product'} has been removed from your cart.`,
      });
    } else {
      updateQuantity(product._id, newQuantity);
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: product.name || 'Product',
      text: `Check out this product: ${product.name || ''}`.trim(),
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

  // Product images fallback
  const productImages = product.images?.length
    ? product.images
    : [product.image || 'https://via.placeholder.com/500'];

  const categoryName = product.category || 'General';
  const reviewsCount = product.reviews || 0;
  const badge = product.badge || product.badges?.[0] || null;

  const specifications = [
    { label: 'SKU', value: product.sku || product._id },
    { label: 'Category', value: categoryName },
    { label: 'Availability', value: product.inStock ? 'In Stock' : 'Out of Stock' },
    { label: 'Brand', value: product.brand || 'AgriPro' },
    { label: 'Warranty', value: product.warranty || '2 Years' },
    { label: 'Model', value: (product.sku || product._id).toUpperCase() },
    { label: 'Stock Quantity', value: isInStock ? `${product.quantity} available` : '0' } 
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 hover:bg-grey-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {productImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <img
                          src={image}
                          alt={`${product.name || 'Product'} - Image ${index + 1}`}
                          className="w-full h-[500px] object-cover rounded-lg"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>

                {/* Badges */}
                {badge && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-brand-primary-500 text-white">
                      {badge}
                    </Badge>
                  </div>
                )}

                {product.discount > 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="destructive" className="bg-accent-orange-500">
                      {product.discount}% OFF
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex space-x-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-brand-primary-500' : 'border-grey-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name || 'Product'} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-grey-600 mb-2">{categoryName}</p>
                <h1 className="text-3xl font-bold text-grey-800 mb-4">{product.name || 'Product'}</h1>

                {/* Rating */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-grey-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{product.rating || 0}</span>
                  <span className="text-grey-600">({reviewsCount} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl font-bold text-grey-800">
                    {formatPrice(product.price || 0)}
                  </span>
                  {product.originalPrice && product.originalPrice > (product.price || 0) && (
                    <span className="text-xl text-grey-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <Badge variant="destructive" className="bg-green-500">
                      Save {product.discount}%
                    </Badge>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {isInStock ? (
                    <div className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      <span className="font-medium">In Stock</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                      <span className="font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="space-y-4">
                {quantity === 0 ? (
                  <Button
                    className="w-full h-12 text-lg"
                    size="lg"
                    disabled={!isInStock}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isInStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>isInStock && handleUpdateQuantity(quantity - 1)}
                        disabled={!isInStock}
                        className="h-12 w-12"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-4 py-3 font-semibold text-lg min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUpdateQuantity(quantity + 1)}
                        className="h-12 w-12"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <span className="text-grey-600">
                    Total: {formatPrice((product.price || 0) * quantity)}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button variant="outline" size="lg" className="flex-1" onClick={handleToggleWishlist}>
                    <Heart className={`w-5 h-5 mr-2 ${wishlistKey && isInWishlist(wishlistKey) ? 'text-red-500' : ''}`} {...(wishlistKey && isInWishlist(wishlistKey) ? { fill: 'currentColor' } : {})} />
                    {wishlistKey && isInWishlist(wishlistKey) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1" onClick={handleShare}>
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Specifications */}
              <Card>
              <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-grey-800 mb-4">Specifications</h3>
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-grey-100 last:border-0">
                    <span className="text-grey-600">{spec.label}</span>
                    <span className="font-medium text-grey-800">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-12">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-grey-800 mb-4">Product Description</h3>
                <div className="text-grey-600 leading-relaxed space-y-4">
                  <p>
                    This high-quality {categoryName.toLowerCase()} is designed for professional use. 
                    Built with durable materials and precision engineering, it offers reliable performance.
                  </p>
                  <p>
                    Key features include advanced functionality, easy operation, and exceptional durability. 
                    Perfect for all-scale operations.
                  </p>
                  <p>
                    Backed by our comprehensive warranty and expert customer support, this product represents 
                    the perfect balance of quality, performance, and value.
                  </p>
                </div>
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
