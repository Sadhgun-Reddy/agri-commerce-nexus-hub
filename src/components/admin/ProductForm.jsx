import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, X } from 'lucide-react';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    productName: '',
    name: '',
    price: 0,
    originalPrice: 0,
    category: '',
    brand: '',
    image: '',
    SKU: '',
    sku: '',
    inStock: true,
    rating: 4.0,
    reviews: 0,
    reviewCounts: 0,
    discount: 0,
    badge: '',
    quantity: 0,
    description: ''
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

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

  const brands = ['Honda', 'Mahindra', 'Kirloskar', 'Crompton', 'Bajaj', 'Fieldking', 'FreshFarms'];

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || product.name || '',
        name: product.name || product.productName || '',
        price: product.price || 0,
        originalPrice: product.originalPrice || product.price || 0,
        category: product.category || '',
        brand: product.brand || '',
        image: product.image || (product.images && product.images[0]) || '',
        SKU: product.SKU || product.sku || '',
        sku: product.sku || product.SKU || '',
        inStock: product.inStock !== undefined ? product.inStock : true,
        rating: product.rating || 4.0,
        reviews: product.reviews || product.reviewCounts || 0,
        reviewCounts: product.reviewCounts || product.reviews || 0,
        discount: product.discount || 0,
        badge: product.badge || '',
        quantity: product.quantity || 0,
        description: product.description || ''
      });

      // Set image previews from existing product images
      if (product.images && Array.isArray(product.images)) {
        setImagePreviews(product.images);
      } else if (product.image) {
        setImagePreviews([product.image]);
      }
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data with imageFiles
    const submitData = {
      ...formData,
      imageFiles: imageFiles.length > 0 ? imageFiles : undefined
    };
    
    onSave(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      setImageFiles(files);
      
      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  // ✅ Remove selected image
  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="productName">Product Name *</Label>
          <Input
            id="productName"
            value={formData.productName || formData.name}
            onChange={(e) => {
              handleChange('productName', e.target.value);
              handleChange('name', e.target.value);
            }}
            required
            placeholder="Enter product name"
          />
        </div>
        <div>
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            value={formData.SKU || formData.sku}
            onChange={(e) => {
              handleChange('SKU', e.target.value);
              handleChange('sku', e.target.value);
            }}
            required
            placeholder="e.g., APL-001"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', Number(e.target.value))}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="originalPrice">Original Price (₹)</Label>
          <Input
            id="originalPrice"
            type="number"
            value={formData.originalPrice}
            onChange={(e) => handleChange('originalPrice', Number(e.target.value))}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', Number(e.target.value))}
            required
            min="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category *</Label>
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter product description"
          rows={3}
        />
      </div>

      {/* ✅ Image Upload Section */}
      <div>
        <Label htmlFor="images">Product Images</Label>
        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-4">
            <label 
              htmlFor="images" 
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary-50 text-brand-primary-600 rounded-lg cursor-pointer hover:bg-brand-primary-100 transition-colors border border-brand-primary-200"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Choose Images</span>
            </label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <span className="text-sm text-grey-500">
              {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : 'No files chosen'}
            </span>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-grey-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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
            min="0"
            value={formData.reviewCounts || formData.reviews}
            onChange={(e) => {
              handleChange('reviews', Number(e.target.value));
              handleChange('reviewCounts', Number(e.target.value));
            }}
          />
        </div>
        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
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
        <Label htmlFor="inStock" className="cursor-pointer">In Stock</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-brand-primary-500 hover:bg-brand-primary-600">
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
