
import React, { useState, useMemo, useEffect } from 'react';
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
import { useApp } from '@/contexts/AppContext';
import { useSearchParams } from 'react-router-dom';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;
  
  const { searchQuery, products, categories: apiCategories, brands: apiBrands, loading, loadProducts } = useApp();
  const [searchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';
  const categoryFromUrl = searchParams.get('category') || '';

  // Set category filter from URL on component mount
  useEffect(() => {
    if (categoryFromUrl && !selectedCategories.includes(categoryFromUrl)) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  // Extract category names for UI - ensure apiCategories is always an array
  const categoryNames = Array.isArray(apiCategories) ? apiCategories.map(cat => cat?.name || 'Unknown') : [];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
      
      // Stock filter
      if (inStockOnly && !product.inStock) return false;
      
      // Search filter
      const searchTerm = searchFromUrl || searchQuery;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search)
        );
      }
      
      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        // featured - keep original order
        break;
    }

    return filtered;
  }, [products, priceRange, selectedCategories, inStockOnly, sortBy, searchQuery, searchFromUrl]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    }
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setPriceRange([0, 100000]);
    setSelectedCategories([]);
    setInStockOnly(false);
    setCurrentPage(1);
  };

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
          {categoryNames.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <label htmlFor={category} className="text-sm text-grey-600 cursor-pointer">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-grey-800 mb-4">Availability</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="in-stock"
              checked={inStockOnly}
              onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
            />
            <label htmlFor="in-stock" className="text-sm text-grey-600 cursor-pointer">
              In Stock Only
            </label>
          </div>
        </div>
      </div>

      <Button className="w-full" variant="outline" onClick={resetFilters}>
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
            <h1 className="text-3xl font-bold text-grey-800 mb-2">
              {searchFromUrl || searchQuery ? `Search Results for "${searchFromUrl || searchQuery}"` : 
               categoryFromUrl ? `${categoryFromUrl} Products` : 'All Products'}
            </h1>
            <p className="text-grey-600">
              {searchFromUrl || searchQuery 
                ? `Found ${filteredProducts.length} products matching your search`
                : `Showing ${filteredProducts.length} products`
              }
            </p>
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
                    Showing {paginatedProducts.length} of {filteredProducts.length} products
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
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
              {paginatedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-2xl font-bold text-grey-800 mb-2">No products found</h3>
                  <p className="text-grey-600 mb-4">
                    {searchFromUrl || searchQuery 
                      ? 'Try adjusting your search terms or filters'
                      : 'Try adjusting your filters'
                    }
                  </p>
                  <Button onClick={resetFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="cursor-pointer"
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
