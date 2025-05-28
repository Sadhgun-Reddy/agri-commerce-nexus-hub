
import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Mahindra 575 DI Tractor",
      price: 850000,
      originalPrice: 950000,
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Tractors",
      sku: "MAH-575-DI",
      discount: 11,
      inStock: true,
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Professional Sprayer 200L",
      price: 45000,
      originalPrice: 52000,
      rating: 4.6,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Equipment",
      sku: "SPR-200L",
      discount: 13,
      inStock: true,
      badge: "New Arrival"
    },
    {
      id: 3,
      name: "Drip Irrigation Kit",
      price: 25000,
      originalPrice: 28000,
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Irrigation",
      sku: "DIP-KIT-500",
      discount: 11,
      inStock: true,
      badge: "Eco-Friendly"
    },
    {
      id: 4,
      name: "Organic Fertilizer 50kg",
      price: 1200,
      originalPrice: 1400,
      rating: 4.5,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Fertilizers",
      sku: "ORG-FERT-50",
      discount: 14,
      inStock: true,
      badge: "Organic"
    },
  ];

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
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-0 shadow-level-1 hover:shadow-level-2 transition-all duration-200">
              <div className="relative">
                <Link to={`/product/${product.sku}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </Link>
                
                {/* Badges */}
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-brand-primary-500 text-white">
                    {product.badge}
                  </Badge>
                </div>
                
                {product.discount > 0 && (
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
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-grey-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Button className="w-full" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
