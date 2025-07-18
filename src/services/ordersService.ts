import api from '@/lib/api';
import type {
  Order,
  ShippingAddress,
  CreateOrderRequest,
  PaginatedResponse,
} from '@/types/api';

class OrdersService {
  async getOrders(params?: {
    status?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Order>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await api.get<PaginatedResponse<Order>>(
        `/orders/?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  }

  async getOrder(id: string): Promise<Order> {
    try {
      const response = await api.get<Order>(`/orders/${id}/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      const response = await api.post<Order>('/orders/', orderData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create order';
      const fieldErrors = error.response?.data?.details;
      
      if (fieldErrors) {
        const firstError = Object.values(fieldErrors)[0] as string[];
        throw new Error(firstError[0] || errorMessage);
      }
      
      throw new Error(errorMessage);
    }
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    try {
      const response = await api.patch<Order>(`/orders/${id}/`, { status });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  }

  async cancelOrder(id: string): Promise<Order> {
    try {
      const response = await api.post<Order>(`/orders/${id}/cancel/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to cancel order');
    }
  }

  // Shipping Addresses
  async getShippingAddresses(): Promise<ShippingAddress[]> {
    try {
      const response = await api.get<ShippingAddress[]>('/orders/shipping-addresses/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch shipping addresses');
    }
  }

  async getShippingAddress(id: string): Promise<ShippingAddress> {
    try {
      const response = await api.get<ShippingAddress>(`/orders/shipping-addresses/${id}/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch shipping address');
    }
  }

  async createShippingAddress(addressData: Omit<ShippingAddress, 'id' | 'is_default'>): Promise<ShippingAddress> {
    try {
      const response = await api.post<ShippingAddress>('/orders/shipping-addresses/', addressData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create shipping address';
      const fieldErrors = error.response?.data?.details;
      
      if (fieldErrors) {
        const firstError = Object.values(fieldErrors)[0] as string[];
        throw new Error(firstError[0] || errorMessage);
      }
      
      throw new Error(errorMessage);
    }
  }

  async updateShippingAddress(id: string, addressData: Partial<ShippingAddress>): Promise<ShippingAddress> {
    try {
      const response = await api.patch<ShippingAddress>(`/orders/shipping-addresses/${id}/`, addressData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update shipping address');
    }
  }

  async deleteShippingAddress(id: string): Promise<void> {
    try {
      await api.delete(`/orders/shipping-addresses/${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete shipping address');
    }
  }

  async setDefaultShippingAddress(id: string): Promise<ShippingAddress> {
    try {
      const response = await api.post<ShippingAddress>(`/orders/shipping-addresses/${id}/set-default/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to set default shipping address');
    }
  }

  // Order tracking
  async trackOrder(id: string): Promise<{
    order: Order;
    tracking_info: Array<{
      status: string;
      description: string;
      timestamp: string;
    }>;
  }> {
    try {
      const response = await api.get(`/orders/${id}/track/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to track order');
    }
  }

  // Order statistics (for admin)
  async getOrderStats(): Promise<{
    total_orders: number;
    pending_orders: number;
    completed_orders: number;
    cancelled_orders: number;
    total_revenue: number;
  }> {
    try {
      const response = await api.get('/orders/stats/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order statistics');
    }
  }

  // Admin functions
  async getAllOrders(params?: {
    status?: string;
    user?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Order>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await api.get<PaginatedResponse<Order>>(
        `/orders/admin/?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch all orders');
    }
  }
}

export const ordersService = new OrdersService();
export default ordersService; 