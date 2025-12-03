import React, { useEffect, useMemo, useState } from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext.jsx';
import { useToast } from '@/hooks/use-toast.js';
import axios from 'axios';
import { URLS } from '@/Urls.jsx';

const normalizeImageUrl = (src) => {
  if (!src) return '/placeholder.svg';
  if (/^https?:\/\//i.test(src)) return src;
  try {
    const base = URLS.Products.split('/api/')[0].replace(/\/$/, '');
    const path = src.toString().replace(/^\//, '');
    return `${base}/${path}`;
  } catch {
    return src;
  }
};

const FeaturedProducts = () => {
  const { addToCart, toggleWishlist, isInWishlist, user } = useApp();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Optimized product filtering and sorting
  const { bestSellers, newArrivals } = useMemo(() => {
    if (!products.length) return { bestSellers: [], newArrivals: [] };

    const allProducts = [...products];

    // Sort by multiple criteria: rating, reviews, and discount
    const sortByPopularity = (a, b) => {
      const scoreA = (a.rating || 0) * 10 + (a.reviews || 0) / 100 + (a.discount || 0);
      const scoreB = (b.rating || 0) * 10 + (b.reviews || 0) / 100 + (b.discount || 0);
      return scoreB - scoreA;
    };

    // Get best sellers (prioritize high rating, reviews, and discount)
    const bestSellers = allProducts
      .filter(product => 
        product.badge && product.badge.toLowerCase().includes('best seller')
      )
      .sort(sortByPopularity)
      .slice(0, 4); // Only take top 4 for single row

    // Get new arrivals (exclude best sellers, prioritize new badge and popularity)
    const newArrivals = allProducts
      .filter(product => 
        product.badge && 
        product.badge.toLowerCase().includes('new') && 
        !bestSellers.includes(product)
      )
      .sort(sortByPopularity)
      .slice(0, 4); // Only take top 4 for single row

    return { bestSellers, newArrivals };
  }, [products]);

  useEffect(() => {
    let isMounted = true;

    const fetchFeatured = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(URLS.Products);
        const allProducts = Array.isArray(res.data) ? res.data : res.data?.data || [];
        
        if (isMounted) {
          setProducts(allProducts);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load products');
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeatured();
    return () => { isMounted = false; };
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      toast({
        title: "Please login first",
        description: "You must sign in before adding items to cart.",
        variant: "destructive",
      });
      return;
    }

    if (product?.inStock) {
      addToCart(product);
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
        variant: "success",
      });
    }
  };

  // Product card component to avoid code duplication
  const ProductCard = ({ product, badgeText = 'Featured' }) => (
    <Card key={product.id} className="group overflow-hidden border-0 shadow-level-1 hover:shadow-level-2 transition-all duration-200">
      <div className="relative">
        <Link to={`/product/${product.sku}`}>
          <img
            src={normalizeImageUrl((product.images && product.images[0]) || product.image)}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.svg'; }}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-brand-primary-500 text-white">
            {product.badge || badgeText}
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
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 bg-white/90 hover:bg-white"
            onClick={() => toggleWishlist(product)}
            aria-label={isInWishlist(product.sku || product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`w-4 h-4 ${isInWishlist(product.sku || product.id) ? 'text-red-500' : ''}`}
              {...(isInWishlist(product.sku || product.id) ? { fill: 'currentColor' } : {})}
            />
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
                    i < Math.floor(product.rating || 4)
                      ? 'text-yellow-400 fill-current'
                      : 'text-grey-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating || 4.5}</span>
            <span className="text-sm text-grey-600">({product.reviews || 0})</span>
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
          <Button className="w-full" size="sm" onClick={() => handleAddToCart(product)}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <section className="py-16 bg-grey-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading featured products...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-grey-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">Error: {error}</div>
        </div>
      </section>
    );
  }

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

        {/* Best Sellers - Single Row */}
        {bestSellers.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-grey-800">Best Sellers</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} badgeText="Best Seller" />
              ))}
            </div>
          </>
        )}

        {/* New Arrivals - Single Row */}
        {newArrivals.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-grey-800">New Arrivals</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} badgeText="New Arrival" />
              ))}
            </div>
          </>
        )}

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