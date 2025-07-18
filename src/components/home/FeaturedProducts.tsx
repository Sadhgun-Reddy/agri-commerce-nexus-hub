import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

const FeaturedProducts = () => {
  const { products = [], loading, addToCart } = useApp();

  // Filter for featured products or get first 8 products
  const featuredProducts = Array.isArray(products) ? products.filter(product => product.badge === "Featured").slice(0, 8) : [];
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : (Array.isArray(products) ? products.slice(0, 8) : []);

  if (loading) {
    return (
      <section className="py-16 bg-grey-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-grey-800 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-grey-600 max-w-2xl mx-auto">
              Loading products...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!displayProducts || displayProducts.length === 0) {
    return (
      <section className="py-16 bg-grey-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-grey-800 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-grey-600 max-w-2xl mx-auto">
              No products available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-16 bg-grey-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-grey-800 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-grey-600 max-w-2xl mx-auto">
            Top-rated farming equipment trusted by thousands of farmers across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => {
            const handleAddToCart = async () => {
              if (product.inStock) {
                await addToCart(product);
              }
            };

            return (
              <Card key={product.id} className="group overflow-hidden border-0 shadow-level-1 hover:shadow-level-2 transition-all duration-200">
                <div className="relative">
                  <Link to={`/product/${product?.id || ''}`}>
                    <img
                      src={product?.image || "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                      alt={product?.name || 'Product'}
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
                    <Button size="icon" variant="secondary" className="w-8 h-8">
                      <Heart className="w-4 h-4" />
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
                      <p className="text-sm text-grey-600 mb-1">{product?.category || 'Unknown Category'}</p>
                      <Link to={`/product/${product?.id || ''}`}>
                        <h3 className="font-semibold text-grey-800 hover:text-brand-primary-500 transition-colors line-clamp-2">
                          {product?.name || 'Unknown Product'}
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

                    {/* Add to Cart Button */}
                    <Button 
                      className="w-full" 
                      size="sm"
                      disabled={!product.inStock}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/products">
            <Button variant="outline" size="lg" className="px-8">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
