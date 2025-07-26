import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Minus, Plus, ArrowLeft, Share2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const ProductDetailPage = () => {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { products, cartItems, addToCart, updateQuantity, removeFromCart } = useApp();
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product = products.find(p => p.sku === sku);
  const cartItem = cartItems.find(item => item.id === product?.id);
  const quantity = cartItem?.quantity || 0;

  useEffect(() => {
    if (!product) {
      navigate('/products');
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  const formatPrice = (price: number) => {
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

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(product.id);
      toast({
        title: "Removed from cart",
        description: `${product.name} has been removed from your cart.`,
      });
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  // Mock additional images for carousel
  const productImages = [
    product.image,
    product.image, // In a real app, these would be different images
    product.image,
    product.image
  ];

  const specifications = [
    { label: 'SKU', value: product.sku },
    { label: 'Category', value: product.category },
    { label: 'Availability', value: product.inStock ? 'In Stock' : 'Out of Stock' },
    { label: 'Brand', value: 'AgriPro' },
    { label: 'Warranty', value: '2 Years' },
    { label: 'Model', value: product.sku.toUpperCase() }
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
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-[500px] object-cover rounded-lg"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>

                {/* Badges */}
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-brand-primary-500 text-white">
                      {product.badge}
                    </Badge>
                  </div>
                )}
                
                {product.discount && product.discount > 0 && (
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
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-grey-600 mb-2">{product.category}</p>
                <h1 className="text-3xl font-bold text-grey-800 mb-4">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-grey-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-grey-600">({product.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl font-bold text-grey-800">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xl text-grey-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.discount && product.discount > 0 && (
                    <Badge variant="destructive" className="bg-green-500">
                      Save {product.discount}%
                    </Badge>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.inStock ? (
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
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUpdateQuantity(quantity - 1)}
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
                      Total: {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button variant="outline" size="lg" className="flex-1">
                    <Heart className="w-5 h-5 mr-2" />
                    Add to Wishlist
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1">
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
                    This high-quality {product.category.toLowerCase()} is designed for professional agricultural use. 
                    Built with durable materials and precision engineering, it offers reliable performance for all your farming needs.
                  </p>
                  <p>
                    Key features include advanced functionality, easy operation, and exceptional durability. 
                    Perfect for both small-scale and commercial agricultural operations.
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