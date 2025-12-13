import { apiRequest } from '@/lib/api';

export interface OrderItem {
  sweet_id: string;
  sweet_name: string;
  quantity: number;
  price_at_purchase: number;
}

export interface Order {
  _id?: string;
  id?: string;
  user_id: string;
  user_email: string;
  items: OrderItem[];
  total_amount: number;
  created_at: string;
}

export interface PurchaseItem {
  sweet_id: string;
  quantity: number;
}

export interface PurchaseRequest {
  items: PurchaseItem[];
}

export const ordersService = {
  async createOrder(items: PurchaseItem[]): Promise<Order> {
    const order = await apiRequest<Order>('/api/v1/orders/', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    return {
      ...order,
      id: order._id || order.id,
    };
  },

  async getMyOrders(): Promise<Order[]> {
    const orders = await apiRequest<Order[]>('/api/v1/orders/my-history');
    return orders.map(order => ({
      ...order,
      id: order._id || order.id,
    }));
  },

  async getAllOrders(): Promise<Order[]> {
    const orders = await apiRequest<Order[]>('/api/v1/orders/all');
    return orders.map(order => ({
      ...order,
      id: order._id || order.id,
    }));
  },
};

