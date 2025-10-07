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
                const product = {
                  ...item,
                  inStock: item.inStock !== undefined ? item.inStock : true,
                  images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
                  categories: Array.isArray(item.categories) ? item.categories : (item.category ? [item.category] : []),
                  reviewsCount: item.reviewsCount || item.reviews || 0,
                };
                return (
                  <ProductCard key={item.sku || item.id} product={product} />
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


