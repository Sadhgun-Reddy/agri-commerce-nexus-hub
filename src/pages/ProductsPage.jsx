import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Grid, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import ProductCard from '@/components/products/ProductCard.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { useApp } from '@/contexts/AppContext.jsx';
import { useSearchParams } from 'react-router-dom';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination.jsx';
import { Badge } from '@/components/ui/badge.jsx';

const ProductsPage = () => {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const { searchQuery, products, isProductsLoading, productsError } = useApp();
  const [searchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';
  const categoryFromUrl = searchParams.get('category') || '';

<<<<<<< HEAD
  // ✅ Debug logging to verify products structure
  useEffect(() => {
    console.log('📦 Products Data:', products);
    console.log('✅ Is Array:', Array.isArray(products));
    console.log('📊 Products Count:', products?.length || 0);
  }, [products]);
=======
  console.log("Products data from context:", products);
>>>>>>> f3d42859740c6a7a8535a6896ad8f729998c61e5

  useEffect(() => {
    if (categoryFromUrl && !selectedCategories.includes(categoryFromUrl)) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  const categories = [
    'Fruits',
    'Vegetables',
    'Seeds',
    'Fertilizers',
    'Tools',
    'Machinery',
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

<<<<<<< HEAD
  // ✅ FIXED: Enhanced filtering with array validation and safety checks
  const filteredProducts = useMemo(() => {
    // ✅ Validate products is an array
    if (!products || !Array.isArray(products) || products.length === 0) {
      console.warn('⚠️ Products is not a valid array:', products);
      return [];
    }

    let filtered = products.filter(product => {
      // ✅ Safe property access with fallbacks
      const productName = (product.name || product.productName || '').toLowerCase();
      const productCategory = product.category || '';
      const productCategories = Array.isArray(product.categories) 
        ? product.categories 
        : (productCategory ? [productCategory] : []);
      const productPrice = Number(product.price) || 0;
=======
const productsData = products?.data || []; // ensures array exists

console.log("Products data array:", productsData);
>>>>>>> f3d42859740c6a7a8535a6896ad8f729998c61e5

const filteredProducts = useMemo(() => {
  if (!productsData || productsData.length === 0) return [];

<<<<<<< HEAD
      // Category filter
      if (selectedCategories.length > 0) {
        const hasMatchingCategory = productCategories.some(cat => 
          selectedCategories.includes(cat)
        );
        if (!hasMatchingCategory) return false;
      }

      // Stock filter
      if (inStockOnly) {
        const isInStock = product.inStock !== undefined 
          ? product.inStock 
          : (product.quantity || 0) > 0;
        if (!isInStock) return false;
      }

      // Search filter
      const searchTerm = (searchFromUrl || searchQuery).toLowerCase().trim();
      if (searchTerm) {
        const matchesName = productName.includes(searchTerm);
        const matchesCategory = productCategories.some(cat => 
          cat.toLowerCase().includes(searchTerm)
        );
        const matchesBrand = (product.brand || '').toLowerCase().includes(searchTerm);
        const matchesSKU = (product.sku || product.SKU || '').toLowerCase().includes(searchTerm);
        
        return matchesName || matchesCategory || matchesBrand || matchesSKU;
      }
=======
  return productsData.filter(product => {
    const productName = (product.productName || '').toLowerCase();
    const productCategory = product.category || '';
    const productCategories = [productCategory];
    const productPrice = product.price || 0;

    // Price filter
    if (productPrice < priceRange[0] || productPrice > priceRange[1]) return false;

    // Category filter
    if (selectedCategories.length > 0 && !productCategories.some(cat => selectedCategories.includes(cat))) return false;
>>>>>>> f3d42859740c6a7a8535a6896ad8f729998c61e5

    // Stock filter
    if (inStockOnly && (!product.inStock || (product.quantity || 0) <= 0)) return false;
    const searchTerm = (searchQuery || searchFromUrl || '').toLowerCase().trim();
    
    // Search filter
   if (searchTerm) {
  if (
    !productName.includes(searchTerm) &&
    !productCategories.some(cat => cat.toLowerCase().includes(searchTerm))
  ) return false;
}

<<<<<<< HEAD
    // ✅ Sorting with proper error handling
    try {
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
          break;
        case 'price-high':
          filtered.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
          break;
        case 'rating':
          filtered.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
          break;
        case 'newest':
          filtered.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
          break;
        case 'featured':
        default:
          // Keep original order for featured
          break;
      }
    } catch (sortError) {
      console.error('❌ Error sorting products:', sortError);
=======


    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return (a.price || 0) - (b.price || 0);
      case 'price-high': return (b.price || 0) - (a.price || 0);
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
      default: return 0;
>>>>>>> f3d42859740c6a7a8535a6896ad8f729998c61e5
    }
  });
}, [productsData, priceRange, selectedCategories, inStockOnly, sortBy, searchQuery, searchFromUrl]);

<<<<<<< HEAD
    console.log(`✅ Filtered ${filtered.length} products from ${products.length} total`);
    return filtered;
  }, [products, priceRange, selectedCategories, inStockOnly, sortBy, searchQuery, searchFromUrl]);
=======
>>>>>>> f3d42859740c6a7a8535a6896ad8f729998c61e5

  // ✅ Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setPriceRange([0, 100000]);
    setSelectedCategories([]);
    setInStockOnly(false);
    setSortBy('featured');
    setCurrentPage(1);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="pb-6 border-b border-grey-200">
        <h3 className="font-bold text-grey-900 mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-primary-500" />
          Price Range
        </h3>
        <div className="space-y-4">
          <Slider 
            value={priceRange} 
            onValueChange={setPriceRange} 
            max={100000} 
            step={1000} 
            className="w-full" 
          />
          <div className="flex justify-between items-center">
            <div className="bg-brand-primary-50 px-3 py-2 rounded-lg">
              <span className="text-sm font-semibold text-brand-primary-700">
                ₹{priceRange[0].toLocaleString()}
              </span>
            </div>
            <span className="text-grey-400">—</span>
            <div className="bg-brand-primary-50 px-3 py-2 rounded-lg">
              <span className="text-sm font-semibold text-brand-primary-700">
                ₹{priceRange[1].toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="pb-6 border-b border-grey-200">
        <h3 className="font-bold text-grey-900 mb-4 flex items-center gap-2">
          <Grid className="w-4 h-4 text-brand-primary-500" />
          Categories
        </h3>
        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
          {categories.map(category => (
            <div 
              key={category} 
              className="flex items-center space-x-3 group hover:bg-brand-primary-50 p-2 rounded-lg transition-colors"
            >
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={checked => handleCategoryChange(category, checked)}
                className="border-grey-300"
              />
              <label 
                htmlFor={category} 
                className="text-sm text-grey-700 cursor-pointer group-hover:text-brand-primary-600 transition-colors flex-1"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="pb-6">
        <h3 className="font-bold text-grey-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-primary-500" />
          Availability
        </h3>
        <div className="flex items-center space-x-3 hover:bg-brand-primary-50 p-2 rounded-lg transition-colors">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={checked => setInStockOnly(checked)}
            className="border-grey-300"
          />
          <label htmlFor="in-stock" className="text-sm text-grey-700 cursor-pointer flex-1">
            Show In Stock Only
          </label>
        </div>
      </div>

      {/* Reset Button */}
      <Button 
        className="w-full bg-grey-100 hover:bg-grey-200 text-grey-700 border border-grey-300" 
        onClick={resetFilters}
      >
        <X className="w-4 h-4 mr-2" />
        Reset All Filters
      </Button>
    </div>
  );

  // ✅ Loading State
  if (isProductsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-brand-primary-50 to-white">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-primary-200 border-t-brand-primary-600 rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-brand-primary-400 rounded-full animate-spin animation-delay-150" style={{ animationDirection: 'reverse' }} />
        </div>
        <p className="mt-6 text-grey-600 font-medium">Loading amazing products...</p>
      </div>
    );
  }

  // ✅ Error State
  if (productsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-grey-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-grey-600 mb-6">{productsError}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-grey-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-brand-primary-600 to-brand-primary-500 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {searchFromUrl || searchQuery
                  ? `Results for "${searchFromUrl || searchQuery}"`
                  : categoryFromUrl
                  ? `${categoryFromUrl} Collection`
                  : 'Discover Our Products'}
              </h1>
              <p className="text-brand-primary-100 text-lg">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <Card className="p-6 shadow-lg border-grey-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-xl text-grey-900">Filters</h2>
                    {(selectedCategories.length > 0 || inStockOnly || priceRange[0] > 0 || priceRange[1] < 100000) && (
                      <Badge variant="secondary" className="bg-brand-primary-100 text-brand-primary-700">
                        Active
                      </Badge>
                    )}
                  </div>
                  <FilterPanel />
                </Card>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-grey-200">
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Mobile Filter */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                        {(selectedCategories.length > 0 || inStockOnly) && (
                          <Badge variant="secondary" className="ml-2 bg-brand-primary-100 text-brand-primary-700">
                            {selectedCategories.length + (inStockOnly ? 1 : 0)}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterPanel />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <span className="text-sm text-grey-600 font-medium">
                    Showing <span className="text-brand-primary-600 font-bold">{paginatedProducts.length}</span> of {filteredProducts.length}
                  </span>
                </div>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-56 border-grey-300">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">✨ Featured</SelectItem>
                    <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
                    <SelectItem value="price-high">💎 Price: High to Low</SelectItem>
                    <SelectItem value="rating">⭐ Customer Rating</SelectItem>
                    <SelectItem value="newest">🆕 Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Products Grid */}
              {paginatedProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-grey-200">
                  <div className="w-20 h-20 bg-grey-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Filter className="w-10 h-10 text-grey-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-grey-900 mb-3">No products found</h3>
                  <p className="text-grey-600 mb-6">Try adjusting your filters to see more results</p>
                  <Button onClick={resetFilters} size="lg" className="bg-brand-primary-500 hover:bg-brand-primary-600">
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {paginatedProducts.map((product, index) => (
                      <div
                        key={product._id || product.id || `product-${index}`}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                      <Pagination>
                        <PaginationContent className="gap-2">
                          {currentPage > 1 && (
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() => {
                                  setCurrentPage(currentPage - 1);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="cursor-pointer hover:bg-brand-primary-50 transition-colors"
                              />
                            </PaginationItem>
                          )}

                          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 7) {
                              pageNum = i + 1;
                            } else if (currentPage <= 4) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 3) {
                              pageNum = totalPages - 6 + i;
                            } else {
                              pageNum = currentPage - 3 + i;
                            }
                            
                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationLink
                                  onClick={() => {
                                    setCurrentPage(pageNum);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  isActive={currentPage === pageNum}
                                  className={`cursor-pointer transition-all ${
                                    currentPage === pageNum
                                      ? 'bg-brand-primary-500 text-white hover:bg-brand-primary-600'
                                      : 'hover:bg-brand-primary-50'
                                  }`}
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}

                          {currentPage < totalPages && (
                            <PaginationItem>
                              <PaginationNext
                                onClick={() => {
                                  setCurrentPage(currentPage + 1);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="cursor-pointer hover:bg-brand-primary-50 transition-colors"
                              />
                            </PaginationItem>
                          )}
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
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
