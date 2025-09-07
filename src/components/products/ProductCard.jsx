import React from 'react';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext.jsx';
import { useToast } from '@/hooks/use-toast.js';

const ProductCard = ({ product }) => {
  const { addToCart } = useApp();
  const { toast } = useToast();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product.inStock) {
      addToCart(product);
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-level-1 hover:shadow-level-2 transition-all duration-200 animate-card-hover">
      <div className="relative">
        <Link to={`/product/${product.sku}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </Link>
        
        {/* Badges */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-brand-primary-500 text-white">
              {product.badge}
            </Badge>
          </div>
        )}
        
        {product.discount && product.discount > 0 && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive" className="bg-accent-orange-500">
              {product.discount}% OFF
            </Badge>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/90 hover:bg-white">
            <Heart className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/90 hover:bg-white">
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        {/* Stock indicator */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-12 font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-grey-600 mb-1">{product.category}</p>
            <Link to={`/product/${product.sku}`}>
              <h3 className="font-semibold text-grey-800 hover:text-brand-primary-500 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-grey-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-grey-600">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-grey-800">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-grey-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* View Product Button */}
          <Link to={`/product/${product.sku}`}>
            <Button 
              className="w-full" 
              size="sm"
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.inStock ? 'View Product' : 'Out of Stock'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
