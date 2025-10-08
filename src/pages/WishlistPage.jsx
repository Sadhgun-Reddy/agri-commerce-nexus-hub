import React from 'react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import { useApp } from '@/contexts/AppContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Link } from 'react-router-dom';
import { URLS } from '@/Urls.jsx';
import ProductCard from '@/components/products/ProductCard.jsx';

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

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, addToCart } = useApp();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-grey-800 mb-8">My Wishlist</h1>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-grey-600 mb-6">Your wishlist is empty.</p>
              <Link to="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => {

              const computedInStock = (item.quantity || 0) > 0;
  const product = {
                  ...item,
                  inStock: computedInStock,  // Override with computation
                  images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
                  categories: Array.isArray(item.categories) ? item.categories : (item.category ? [item.category] : []),
                  reviewsCount: item.reviewsCount || item.reviews || 0,
                  rating: item.rating || 0,  // Fallback for card rendering
                };
                
                // Add direct add-to-cart from wishlist (optional enhancement)
                const handleQuickAdd = () => {
                  if (computedInStock) {
                    addToCart(product);
                  }
                }
                
                return (
                  <div key={item.sku || item._id} className="relative">
                    <ProductCard product={product} />
                    {computedInStock && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 z-10"
                        onClick={handleQuickAdd}
                      >
                        Add to Cart
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;


