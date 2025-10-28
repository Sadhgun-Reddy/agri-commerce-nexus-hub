import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    sku: '',
    inStock: true,
    rating: 4.0,
    reviewCount: 0,
    discount: 0,
    badge: '',
    quantity: '',
    description: '',
    youtubeUrl: ''
  });

  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

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

  // Cleanup object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.isNew && img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  useEffect(() => {
    if (product) {
      // Normalize product data and handle all field variations
      setFormData({
        name: product.name || product.productName || '',
        price: product.price?.toString() || '',
        originalPrice: (product.originalPrice || product.price)?.toString() || '',
        category: product.category || '',
        brand: product.brand || '',
        sku: product.sku || product.SKU || '',
        inStock: product.inStock !== undefined ? product.inStock : true,
        rating: product.rating || 4.0,
        reviewCount: product.reviewCount || product.reviewCounts || product.reviews || 0,
        discount: product.discount || 0,
        badge: product.badge || '',
        quantity: product.quantity?.toString() || '',
        description: product.description || '',
        youtubeUrl: product.youtubeUrl || ''
      });

      // Handle existing images
      const existingImages = [];
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        product.images.forEach((url, index) => {
          existingImages.push({
            id: `existing-${index}`,
            url: url,
            preview: url,
            isNew: false
          });
        });
      } else if (product.image) {
        existingImages.push({
          id: 'existing-0',
          url: product.image,
          preview: product.image,
          isNew: false
        });
      }
      setImages(existingImages);
    } else {
      // Reset form for new product
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: '',
      brand: '',
      sku: '',
      inStock: true,
      rating: 4.0,
      reviewCount: 0,
      discount: 0,
      badge: '',
      quantity: '',
      description: '',
      youtubeUrl: ''
    });
    setImages([]);
    setErrors({});
    setIsSubmitting(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.youtubeUrl && !isValidYouTubeUrl(formData.youtubeUrl)) {
      newErrors.youtubeUrl = 'Please enter a valid YouTube URL';
    }

    if (images.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidYouTubeUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return pattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare submission data with proper number types and field names
      const submitData = {
        // Primary fields
        name: formData.name.trim(),
        productName: formData.name.trim(), // Legacy field
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
        category: formData.category,
        brand: formData.brand.trim(),
        sku: formData.sku.trim(),
        SKU: formData.sku.trim(), // Legacy field
        inStock: Boolean(formData.inStock),
        rating: parseFloat(formData.rating) || 0,
        reviewCount: parseInt(formData.reviewCount) || 0,
        reviewCounts: parseInt(formData.reviewCount) || 0, // Legacy field
        reviews: parseInt(formData.reviewCount) || 0, // Legacy field
        discount: parseFloat(formData.discount) || 0,
        badge: formData.badge.trim(),
        quantity: parseInt(formData.quantity) || 0,
        description: formData.description.trim(),
        youtubeUrl: formData.youtubeUrl.trim(),
        
        // Image handling - ensure we have at least the existing images
        images: images.filter(img => !img.isNew).map(img => img.url),
        image: images.filter(img => !img.isNew).map(img => img.url)[0] || '', // Legacy single image field
      };

      // If there are new images, include them separately for upload
      const newImageFiles = images.filter(img => img.isNew).map(img => img.file);
      if (newImageFiles.length > 0) {
        submitData.newImages = newImageFiles;
      }

      await onSave(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message || 'Failed to save product. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    handleChange(name, type === 'checkbox' ? checked : value);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        console.warn(`${file.name} is not a valid image file`);
      }
      if (!isValidSize) {
        console.warn(`${file.name} exceeds 5MB size limit`);
      }
      
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) {
      setErrors(prev => ({ ...prev, images: 'Please select valid image files (max 5MB each)' }));
      return;
    }

    // Create new image objects
    const newImages = validFiles.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      file: file,
      preview: URL.createObjectURL(file),
      isNew: true
    }));

    setImages(prev => [...prev, ...newImages]);
    
    // Clear images error
    if (errors.images) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (imageId) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      
      // Revoke object URL if it's a new image
      if (imageToRemove?.isNew && imageToRemove.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      
      return prev.filter(img => img.id !== imageId);
    });
  };

  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
      {errors.submit && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <Label htmlFor="sku">
            SKU <span className="text-red-500">*</span>
          </Label>
          <Input
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            placeholder="e.g., APL-001"
            aria-invalid={!!errors.sku}
            aria-describedby={errors.sku ? 'sku-error' : undefined}
          />
          {errors.sku && (
            <p id="sku-error" className="text-sm text-red-500 mt-1">{errors.sku}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">
            Price (₹) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            placeholder="0.00"
            aria-invalid={!!errors.price}
            aria-describedby={errors.price ? 'price-error' : undefined}
          />
          {errors.price && (
            <p id="price-error" className="text-sm text-red-500 mt-1">{errors.price}</p>
          )}
        </div>
        <div>
          <Label htmlFor="originalPrice">Original Price (₹)</Label>
          <Input
            id="originalPrice"
            name="originalPrice"
            type="number"
            value={formData.originalPrice}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="quantity">
            Quantity <span className="text-red-500">*</span>
          </Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            min="0"
            placeholder="0"
            aria-invalid={!!errors.quantity}
            aria-describedby={errors.quantity ? 'quantity-error' : undefined}
          />
          {errors.quantity && (
            <p id="quantity-error" className="text-sm text-red-500 mt-1">{errors.quantity}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger aria-invalid={!!errors.category}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500 mt-1">{errors.category}</p>
          )}
        </div>
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            placeholder="Enter brand name"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="youtubeUrl">YouTube URL</Label>
        <Input
          id="youtubeUrl"
          name="youtubeUrl"
          type="url"
          value={formData.youtubeUrl}
          onChange={handleInputChange}
          placeholder="https://www.youtube.com/watch?v=..."
          aria-invalid={!!errors.youtubeUrl}
          aria-describedby={errors.youtubeUrl ? 'youtube-error' : undefined}
        />
        {errors.youtubeUrl && (
          <p id="youtube-error" className="text-sm text-red-500 mt-1">{errors.youtubeUrl}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter product description"
          rows={3}
        />
      </div>

      {/* Image Upload Section */}
      <div>
        <Label htmlFor="images">
          Product Images <span className="text-red-500">*</span>
        </Label>
        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-4">
            <label 
              htmlFor="images" 
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg cursor-pointer hover:bg-green-100 transition-colors border border-green-200"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Add Images</span>
            </label>
            <Input
              ref={fileInputRef}
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              aria-label="Upload product images"
            />
            <span className="text-sm text-gray-600">
              {images.length > 0 
                ? `${images.length} image(s) selected`
                : 'No images selected'}
            </span>
          </div>
          {errors.images && (
            <p className="text-sm text-red-500">{errors.images}</p>
          )}

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.preview}
                    alt={`Product ${image.isNew ? 'new' : 'existing'}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    onError={handleImageError}
                  />
                  <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded">
                    {image.isNew ? 'New' : 'Existing'}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    aria-label={`Remove image ${image.id}`}
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
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="reviewCount">Reviews Count</Label>
          <Input
            id="reviewCount"
            name="reviewCount"
            type="number"
            min="0"
            value={formData.reviewCount}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            name="discount"
            type="number"
            min="0"
            max="100"
            value={formData.discount}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="badge">Badge</Label>
        <Input
          id="badge"
          name="badge"
          value={formData.badge}
          onChange={handleInputChange}
          placeholder="e.g., Best Seller, New Arrival"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={formData.inStock}
          onCheckedChange={(checked) => handleChange('inStock', checked)}
        />
        <Label htmlFor="inStock" className="cursor-pointer">
          In Stock
        </Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t sticky bottom-0 bg-white">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-green-600 hover:bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;