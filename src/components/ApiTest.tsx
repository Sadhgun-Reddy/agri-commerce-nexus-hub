import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ApiTest: React.FC = () => {
  const { 
    products, 
    categories, 
    brands, 
    loading, 
    error, 
    user, 
    isLoggedIn, 
    cartItems, 
    cartCount 
  } = useApp();

  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    const results: string[] = [];
    
    results.push(`✅ API Context loaded successfully`);
    results.push(`📦 Products: ${products.length} loaded`);
    results.push(`🏷️ Categories: ${categories.length} loaded`);
    results.push(`🏢 Brands: ${brands.length} loaded`);
    results.push(`👤 User: ${isLoggedIn ? 'Logged in' : 'Not logged in'}`);
    results.push(`🛒 Cart: ${cartCount} items`);
    
    if (error) {
      results.push(`❌ Error: ${error}`);
    }
    
    if (loading) {
      results.push(`⏳ Loading...`);
    }

    setTestResults(results);
  }, [products, categories, brands, loading, error, user, isLoggedIn, cartCount]);

  return (
    <Card className="w-full max-w-2xl mx-auto m-4">
      <CardHeader>
        <CardTitle>🔌 API Integration Status</CardTitle>
        <CardDescription>
          Real-time status of backend API integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {testResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-sm">{result}</span>
            </div>
          ))}
        </div>

        {categories.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">📋 Available Categories:</h4>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 5).map((category) => (
                <Badge key={category.id} variant="outline">
                  {category.name}
                </Badge>
              ))}
              {categories.length > 5 && (
                <Badge variant="secondary">+{categories.length - 5} more</Badge>
              )}
            </div>
          </div>
        )}

        {brands.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">🏢 Available Brands:</h4>
            <div className="flex flex-wrap gap-2">
              {brands.slice(0, 5).map((brand) => (
                <Badge key={brand.id} variant="outline">
                  {brand.name}
                </Badge>
              ))}
              {brands.length > 5 && (
                <Badge variant="secondary">+{brands.length - 5} more</Badge>
              )}
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">📦 Sample Products:</h4>
            <div className="space-y-2">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="p-2 border rounded">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ₹{product.price} | {product.category} | {product.brand}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            🌐 Backend API: http://127.0.0.1:8000/api<br/>
            📊 All data is now loaded from the real Django backend
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiTest; 