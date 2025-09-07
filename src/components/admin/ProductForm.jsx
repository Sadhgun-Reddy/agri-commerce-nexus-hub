import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    originalPrice: 0,
    category: '',
    brand: '',
    image: '',
    sku: '',
    inStock: true,
    rating: 4.0,
    reviews: 0,
    discount: 0,
    badge: ''
  });

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

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', Number(e.target.value))}
            required
          />
        </div>
        <div>
          <Label htmlFor="originalPrice">Original Price (₹)</Label>
          <Input
            id="originalPrice"
            type="number"
            value={formData.originalPrice}
            onChange={(e) => handleChange('originalPrice', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Select value={formData.brand} onValueChange={(value) => handleChange('brand', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => handleChange('image', e.target.value)}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={(e) => handleChange('rating', Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="reviews">Reviews Count</Label>
          <Input
            id="reviews"
            type="number"
            value={formData.reviews}
            onChange={(e) => handleChange('reviews', Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            value={formData.discount}
            onChange={(e) => handleChange('discount', Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="badge">Badge</Label>
        <Input
          id="badge"
          value={formData.badge}
          onChange={(e) => handleChange('badge', e.target.value)}
          placeholder="e.g., Best Seller, New Arrival"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={formData.inStock}
          onCheckedChange={(checked) => handleChange('inStock', checked)}
        />
        <Label htmlFor="inStock">In Stock</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
