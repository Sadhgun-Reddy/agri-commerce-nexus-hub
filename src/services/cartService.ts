import api from '@/lib/api';
import type {
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
} from '@/types/api';

class CartService {
  async getCart(): Promise<Cart> {
    try {
      const response = await api.get<Cart>('/cart/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cart');
    }
  }

  async addToCart(productData: AddToCartRequest): Promise<CartItem> {
    try {
      const response = await api.post<CartItem>('/cart/add/', productData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add to cart';
      const fieldErrors = error.response?.data?.details;
      
      if (fieldErrors) {
        const firstError = Object.values(fieldErrors)[0] as string[];
        throw new Error(firstError[0] || errorMessage);
      }
      
      throw new Error(errorMessage);
    }
  }

  async updateCartItem(itemId: string, updateData: UpdateCartItemRequest): Promise<CartItem> {
    try {
      const response = await api.patch<CartItem>(`/cart/items/${itemId}/`, updateData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update cart item');
    }
  }

  async removeFromCart(itemId: string): Promise<void> {
    try {
      await api.delete(`/cart/items/${itemId}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove from cart');
    }
  }

  async clearCart(): Promise<void> {
    try {
      await api.delete('/cart/clear/');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    }
  }

  async getCartItemCount(): Promise<number> {
    try {
      const response = await api.get<{ count: number }>('/cart/count/');
      return response.data.count;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cart count');
    }
  }

  async syncCart(items: Array<{ product: string; quantity: number }>): Promise<Cart> {
    try {
      const response = await api.post<Cart>('/cart/sync/', { items });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to sync cart');
    }
  }

  // For guest users - local storage based cart management
  getLocalCart(): CartItem[] {
    try {
      const cartData = localStorage.getItem('guest_cart');
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error parsing local cart:', error);
      return [];
    }
  }

  setLocalCart(items: CartItem[]): void {
    try {
      localStorage.setItem('guest_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  }

  clearLocalCart(): void {
    localStorage.removeItem('guest_cart');
  }

  addToLocalCart(product: any, quantity: number = 1): void {
    const cart = this.getLocalCart();
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: `local_${Date.now()}`,
        product,
        quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    this.setLocalCart(cart);
  }

  updateLocalCartItem(productId: string, quantity: number): void {
    const cart = this.getLocalCart();
    const itemIndex = cart.findIndex((item) => item.product.id === productId);

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
        cart[itemIndex].updated_at = new Date().toISOString();
      }
      this.setLocalCart(cart);
    }
  }

  removeFromLocalCart(productId: string): void {
    const cart = this.getLocalCart();
    const filteredCart = cart.filter((item) => item.product.id !== productId);
    this.setLocalCart(filteredCart);
  }

  getLocalCartTotal(): number {
    const cart = this.getLocalCart();
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getLocalCartCount(): number {
    const cart = this.getLocalCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }
}

export const cartService = new CartService();
export default cartService; 