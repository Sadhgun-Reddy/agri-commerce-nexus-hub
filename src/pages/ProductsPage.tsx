
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
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const products = [
    {
      id: 1,
      name: "Honda Power Weeder GX25",
      price: 28000,
      originalPrice: 32000,
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Intercultivators/Power weeders",
      sku: "HON-PW-GX25",
      discount: 12,
      inStock: true,
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Professional Earth Auger 52cc",
      price: 15000,
      originalPrice: 18000,
      rating: 4.6,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Earth Augers",
      sku: "PRO-EA-52CC",
      discount: 17,
      inStock: true,
      badge: "New Arrival"
    },
    {
      id: 3,
      name: "Automatic Seed Planter SP200",
      price: 45000,
      originalPrice: 52000,
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Seeders/planters",
      sku: "AUTO-SP-200",
      discount: 13,
      inStock: true,
      badge: "Eco-Friendly"
    },
    {
      id: 4,
      name: "Diesel Water Pump 3HP",
      price: 35000,
      originalPrice: 40000,
      rating: 4.5,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Waterpumps & Engines",
      sku: "DIES-WP-3HP",
      discount: 12,
      inStock: true,
      badge: "Heavy Duty"
    },
    {
      id: 5,
      name: "Battery Sprayer 16L",
      price: 8500,
      originalPrice: 10000,
      rating: 4.4,
      reviews: 167,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Sprayers",
      sku: "BATT-SPR-16L",
      discount: 15,
      inStock: true,
      badge: "Portable"
    },
    {
      id: 6,
      name: "Professional Brush Cutter BC430",
      price: 12000,
      originalPrice: 14500,
      rating: 4.6,
      reviews: 134,
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Brush cutters",
      sku: "PRO-BC-430",
      discount: 17,
      inStock: true,
      badge: "Popular"
    },
    {
      id: 7,
      name: "Electric Chaff Cutter 3HP",
      price: 25000,
      originalPrice: 28000,
      rating: 4.7,
      reviews: 98,
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Chaff cutters",
      sku: "ELEC-CC-3HP",
      discount: 11,
      inStock: true,
      badge: "Energy Efficient"
    },
    {
      id: 8,
      name: "Automatic Milking Machine MM250",
      price: 85000,
      originalPrice: 95000,
      rating: 4.8,
      reviews: 76,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Milking machines",
      sku: "AUTO-MM-250",
      discount: 11,
      inStock: true,
      badge: "Premium"
    },
    {
      id: 9,
      name: "Rubber Cow Mat 6x4 ft",
      price: 2500,
      originalPrice: 3000,
      rating: 4.3,
      reviews: 145,
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Cow mats",
      sku: "RUB-CM-6X4",
      discount: 17,
      inStock: true,
      badge: "Comfort"
    },
    {
      id: 10,
      name: "Electric Fogger 1000W",
      price: 18000,
      originalPrice: 21000,
      rating: 4.5,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Foggers",
      sku: "ELEC-FOG-1KW",
      discount: 14,
      inStock: true,
      badge: "Efficient"
    },
    {
      id: 11,
      name: "Cordless Drill Set 18V",
      price: 6500,
      originalPrice: 7500,
      rating: 4.4,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Power tools",
      sku: "CORD-DR-18V",
      discount: 13,
      inStock: true,
      badge: "Versatile"
    },
    {
      id: 12,
      name: "Professional Chain Saw 20 inch",
      price: 22000,
      originalPrice: 26000,
      rating: 4.7,
      reviews: 167,
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Chain Saw",
      sku: "PRO-CS-20IN",
      discount: 15,
      inStock: true,
      badge: "Professional"
    }
  ];

  const categories = [
    'Intercultivators/Power weeders',
    'Earth Augers', 
    'Seeders/planters',
    'Waterpumps & Engines',
    'Sprayers',
    'Brush cutters',
    'Chaff cutters',
    'Milking machines',
    'Cow mats',
    'Foggers',
    'Power tools',
    'Chain Saw',
    'Agriculture Shredders',
    'Harvesting Machines',
    'Threashers',
    'Pillet making machines',
    'Pulverizers',
    'Lawn/Stubble Movers'
  ];
  
  const brands = ['Honda', 'Mahindra', 'Kirloskar', 'Crompton', 'Bajaj', 'Fieldking'];

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-grey-800 mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={100000}
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
        <div className="space-y-3 max-h-64 overflow-y-auto">
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
            <p className="text-grey-600">Discover our complete range of farming equipment and agricultural supplies</p>
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
                    Showing {products.length} of {products.length + 52} products
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
