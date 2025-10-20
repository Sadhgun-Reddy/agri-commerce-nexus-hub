import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useApp } from '@/contexts/AppContext.jsx';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const navigate = useNavigate();

  // ✅ Safe property access with fallbacks
  const productId = product._id || product.id;
  const productName = product.name || product.productName || 'Unnamed Product';
  const productImage = product.images?.[0] || product.image || '/placeholder.jpg';
  const productPrice = product.price || 0;
  const productOriginalPrice = product.originalPrice || product.price || 0;
  const productRating = product.rating || 0;
  const productReviewCount = product.reviewCounts || product.reviewsCount || 0;
  const productDiscount = product.discount || 0;
  const productBadge = product.badge || '';
  const productInStock = product.inStock !== undefined ? product.inStock : (product.quantity || 0) > 0;
  const productSKU = product.sku || product.SKU || '';

  const handleProductClick = () => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isWishlisted = isInWishlist(productId) || isInWishlist(productSKU);

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-grey-200 hover:border-brand-primary-300">
      <div className="relative overflow-hidden bg-grey-50" onClick={handleProductClick}>
        {/* Product Image */}
        <img
          src={productImage}
          alt={productName}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {productBadge && (
            <Badge className="bg-brand-primary-500 text-white shadow-lg">
              {productBadge}
            </Badge>
          )}
          {productDiscount > 0 && (
            <Badge variant="destructive" className="shadow-lg">
              {productDiscount}% OFF
            </Badge>
          )}
          {!productInStock && (
            <Badge variant="secondary" className="bg-grey-600 text-white shadow-lg">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-3 right-3 bg-white/90 hover:bg-white shadow-lg transition-all duration-300 ${
            isWishlisted ? 'text-red-500' : 'text-grey-600'
          }`}
          onClick={handleToggleWishlist}
        >
          <Heart
            className={`w-5 h-5 transition-all ${isWishlisted ? 'fill-red-500' : ''}`}
          />
        </Button>
      </div>

      <CardContent className="p-5">
        {/* Product Name */}
        <h3
          className="font-bold text-lg text-grey-900 mb-2 line-clamp-2 group-hover:text-brand-primary-600 transition-colors"
          onClick={handleProductClick}
        >
          {productName}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-grey-700">
              {productRating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-grey-500">
            ({productReviewCount} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-brand-primary-600">
            ₹{productPrice.toLocaleString()}
          </span>
          {productOriginalPrice > productPrice && (
            <span className="text-sm text-grey-500 line-through">
              ₹{productOriginalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full bg-brand-primary-500 hover:bg-brand-primary-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={handleAddToCart}
          disabled={!productInStock}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {productInStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
