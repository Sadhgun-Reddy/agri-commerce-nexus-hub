import api from '@/lib/api';
import type {
  Category,
  Brand,
  Product,
  ProductReview,
  WishlistItem,
  PaginatedResponse,
  CreateCategoryRequest,
  CreateBrandRequest,
  CreateProductRequest,
  UpdateProductRequest,
  CreateReviewRequest,
} from '@/types/api';

class ProductsService {
  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<Category[]>('/products/categories/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }

  async getCategory(id: string): Promise<Category> {
    try {
      const response = await api.get<Category>(`/products/categories/${id}/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category');
    }
  }

  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    try {
      const response = await api.post<Category>('/products/categories/', categoryData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create category';
      const fieldErrors = error.response?.data?.details;
      
      if (fieldErrors) {
        const firstError = Object.values(fieldErrors)[0] as string[];
        throw new Error(firstError[0] || errorMessage);
      }
      
      throw new Error(errorMessage);
    }
  }

  async updateCategory(id: string, categoryData: Partial<CreateCategoryRequest>): Promise<Category> {
    try {
      const response = await api.patch<Category>(`/products/categories/${id}/`, categoryData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await api.delete(`/products/categories/${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    try {
      const response = await api.get<Brand[]>('/products/brands/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch brands');
    }
  }

  async getBrand(id: string): Promise<Brand> {
    try {
      const response = await api.get<Brand>(`/products/brands/${id}/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch brand');
    }
  }

  async createBrand(brandData: CreateBrandRequest): Promise<Brand> {
    try {
      const response = await api.post<Brand>('/products/brands/', brandData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create brand';
      const fieldErrors = error.response?.data?.details;
      
      if (fieldErrors) {
        const firstError = Object.values(fieldErrors)[0] as string[];
        throw new Error(firstError[0] || errorMessage);
      }
      
      throw new Error(errorMessage);
    }
  }

  async updateBrand(id: string, brandData: Partial<CreateBrandRequest>): Promise<Brand> {
    try {
      const response = await api.patch<Brand>(`/products/brands/${id}/`, brandData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update brand');
    }
  }

  async deleteBrand(id: string): Promise<void> {
    try {
      await api.delete(`/products/brands/${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete brand');
    }
  }

  // Products
  async getProducts(params?: {
    category?: string;
    brand?: string;
    search?: string;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    is_featured?: boolean;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Product>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await api.get<PaginatedResponse<Product>>(
        `/products/?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  }

  async getProduct(id: string): Promise<Product> {
    try {
      const response = await api.get<Product>(`/products/${id}/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  }

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    try {
      const response = await api.post<Product>('/products/', productData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create product';
      const fieldErrors = error.response?.data?.details;
      
      if (fieldErrors) {
        const firstError = Object.values(fieldErrors)[0] as string[];
        throw new Error(firstError[0] || errorMessage);
      }
      
      throw new Error(errorMessage);
    }
  }

  async updateProduct(id: string, productData: Partial<CreateProductRequest>): Promise<Product> {
    try {
      const response = await api.patch<Product>(`/products/${id}/`, productData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  }

  // Product Reviews
  async getProductReviews(productId: string): Promise<ProductReview[]> {
    try {
      const response = await api.get<ProductReview[]>(`/products/${productId}/reviews/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }

  async createReview(reviewData: CreateReviewRequest): Promise<ProductReview> {
    try {
      const response = await api.post<ProductReview>('/products/reviews/', reviewData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create review';
      const fieldErrors = error.response?.data?.details;
      
      if (fieldErrors) {
        const firstError = Object.values(fieldErrors)[0] as string[];
        throw new Error(firstError[0] || errorMessage);
      }
      
      throw new Error(errorMessage);
    }
  }

  async updateReview(id: string, reviewData: Partial<CreateReviewRequest>): Promise<ProductReview> {
    try {
      const response = await api.patch<ProductReview>(`/products/reviews/${id}/`, reviewData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update review');
    }
  }

  async deleteReview(id: string): Promise<void> {
    try {
      await api.delete(`/products/reviews/${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete review');
    }
  }

  // Wishlist
  async getWishlist(): Promise<WishlistItem[]> {
    try {
      const response = await api.get<WishlistItem[]>('/products/wishlist/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }

  async addToWishlist(productId: string): Promise<WishlistItem> {
    try {
      const response = await api.post<WishlistItem>('/products/wishlist/', {
        product: productId,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }

  async removeFromWishlist(id: string): Promise<void> {
    try {
      await api.delete(`/products/wishlist/${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }

  // Search products
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await api.get<PaginatedResponse<Product>>(`/products/?search=${encodeURIComponent(query)}`);
      return response.data.results;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  }

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await api.get<PaginatedResponse<Product>>('/products/?is_featured=true');
      return response.data.results;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
}

export const productsService = new ProductsService();
export default productsService; 