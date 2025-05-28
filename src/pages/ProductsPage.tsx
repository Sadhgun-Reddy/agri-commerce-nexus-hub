
import React, { useState } from 'react';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 1000000]);

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
    // Add more products...
  ];

  const categories = ['Tractors', 'Equipment', 'Irrigation', 'Fertilizers', 'Seeds', 'Tools'];
  const brands = ['Mahindra', 'John Deere', 'Sonalika', 'Swaraj', 'New Holland'];

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-grey-800 mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-grey-600">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-grey-800 mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={category} />
              <label htmlFor={category} className="text-sm text-grey-600 cursor-pointer">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-grey-800 mb-4">Brands</h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox id={brand} />
              <label htmlFor={brand} className="text-sm text-grey-600 cursor-pointer">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-grey-800 mb-4">Availability</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="in-stock" />
            <label htmlFor="in-stock" className="text-sm text-grey-600 cursor-pointer">
              In Stock
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="out-of-stock" />
            <label htmlFor="out-of-stock" className="text-sm text-grey-600 cursor-pointer">
              Out of Stock
            </label>
          </div>
        </div>
      </div>

      <Button className="w-full" variant="outline">
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-grey-800 mb-2">All Products</h1>
            <p className="text-grey-600">Discover our complete range of farming equipment and supplies</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <Card className="p-6 sticky top-24">
                <h2 className="font-semibold text-grey-800 mb-6">Filters</h2>
                <FilterPanel />
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Filter Bar */}
              <div className="flex items-center justify-between mb-6 bg-grey-50 p-4 rounded-12">
                <div className="flex items-center space-x-4">
                  {/* Mobile Filter */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterPanel />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <span className="text-sm text-grey-600">
                    Showing {products.length} of 124 products
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort */}
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Customer Rating</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="hidden md:flex border rounded-6 p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                      className="w-8 h-8"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                      className="w-8 h-8"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
