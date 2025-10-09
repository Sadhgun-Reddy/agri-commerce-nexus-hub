import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Eye, TrendingUp, Package, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext.jsx';
import { useToast } from '@/hooks/use-toast.js';

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const { toast } = useToast();

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
        description: `${product.name || product.productName} has been added to your cart.`,
        variant: 'success',
      });
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isInStock = (product.quantity || 0) > 0 && product.inStock;
  const displayName = product.name || product.productName || 'Unnamed Product';
  const displaySKU = product._id || product.sku || product.SKU;
  const displayImage = product.images?.[0] || product.image || '/placeholder-product.png';
  const displayRating = product.rating || 0;
  const displayReviews = product.reviewCounts || product.reviewsCount || 0;
  const displayDiscount = product.discount || 0;
  const displayCategory = product.category || 'General';
  const displayBrand = product.brand || '';

  return (
    <Card className="group relative overflow-hidden border border-grey-200 bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-grey-50 to-grey-100">
        <Link to={`/product/${displaySKU}`}>
          <div className="relative w-full h-full">
            {/* Skeleton Loader */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gradient-to-r from-grey-200 via-grey-300 to-grey-200 animate-pulse" />
            )}
            
            {/* Product Image */}
            <img
              src={displayImage}
              alt={displayName}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              } group-hover:scale-110`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />

            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Top Badges Row */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
          {/* Left Badges */}
          <div className="flex flex-col gap-2">
            {displayDiscount > 0 && (
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg backdrop-blur-sm px-3 py-1 font-bold animate-bounce-slow">
                -{displayDiscount}% OFF
              </Badge>
            )}
            {product.badge && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-0 shadow-lg backdrop-blur-sm px-3 py-1 font-semibold">
                <Award className="w-3 h-3 mr-1" />
                {product.badge}
              </Badge>
            )}
            {!isInStock && (
              <Badge className="bg-grey-800/90 text-white border-0 shadow-lg backdrop-blur-sm px-3 py-1">
                <Package className="w-3 h-3 mr-1" />
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            size="icon"
            variant="secondary"
            className="w-10 h-10 bg-white/90 backdrop-blur-md hover:bg-white shadow-lg border border-grey-200/50 transition-all duration-300 hover:scale-110"
            onClick={handleWishlistToggle}
            aria-label={isInWishlist(displaySKU) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                isInWishlist(displaySKU) 
                  ? 'text-red-500 fill-red-500 scale-110' 
                  : 'text-grey-600 hover:text-red-500'
              }`}
            />
          </Button>
        </div>

        {/* Quick View Button - Shows on Hover */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <Link to={`/product/${displaySKU}`}>
            <Button 
              size="sm" 
              className="bg-white/95 backdrop-blur-md text-grey-800 hover:bg-white shadow-lg border border-grey-200/50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-5 space-y-3">
        {/* Category & Brand */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-grey-500 font-medium uppercase tracking-wider">
            {displayCategory}
          </span>
          {displayBrand && (
            <span className="text-grey-400 font-medium">
              {displayBrand}
            </span>
          )}
        </div>

        {/* Product Name */}
        <Link to={`/product/${displaySKU}`}>
          <h3 className="font-bold text-grey-900 text-lg leading-tight hover:text-brand-primary-500 transition-colors duration-200 line-clamp-2 min-h-[3.5rem]">
            {displayName}
          </h3>
        </Link>

        {/* Rating Section */}
        {displayRating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 transition-colors ${
                    i < Math.floor(displayRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : i < displayRating
                      ? 'text-yellow-400 fill-yellow-400 opacity-50'
                      : 'text-grey-300 fill-grey-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-grey-900">{displayRating.toFixed(1)}</span>
            {displayReviews > 0 && (
              <span className="text-xs text-grey-500">({displayReviews} reviews)</span>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-end gap-2 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-grey-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-grey-400 line-through font-medium">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {displayDiscount > 0 && (
            <span className="text-xs font-semibold text-green-600 ml-auto">
              Save {formatPrice(product.originalPrice - product.price)}
            </span>
          )}
        </div>

        {/* Stock Indicator */}
        {isInStock && (
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-600 font-medium">In Stock ({product.quantity} available)</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link to={`/product/${displaySKU}`} className="flex-1">
            <Button 
              className={`w-full transition-all duration-300 ${
                isInStock
                  ? 'bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 shadow-md hover:shadow-lg'
                  : 'bg-grey-300 cursor-not-allowed'
              }`}
              disabled={!isInStock}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isInStock ? 'View Product' : 'Out of Stock'}
            </Button>
          </Link>
        </div>
      </CardContent>

      {/* Decorative Corner Accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-brand-primary-100/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
};

export default ProductCard;
