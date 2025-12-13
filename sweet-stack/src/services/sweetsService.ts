import { apiRequest } from '@/lib/api';

export interface Sweet {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image_url?: string;
  description?: string;
}

export interface SweetUpdate {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  image_url?: string;
}

export const sweetsService = {
  async getAllSweets(): Promise<Sweet[]> {
    const sweets = await apiRequest<Sweet[]>('/api/v1/sweets/');
    // Map _id to id for frontend compatibility
    return sweets.map(sweet => ({
      ...sweet,
      id: sweet._id || sweet.id,
    }));
  },

  async searchSweets(query: string): Promise<Sweet[]> {
    const sweets = await apiRequest<Sweet[]>(`/api/v1/sweets/search?q=${encodeURIComponent(query)}`);
    return sweets.map(sweet => ({
      ...sweet,
      id: sweet._id || sweet.id,
    }));
  },

  async createSweet(sweet: Omit<Sweet, 'id' | '_id'>): Promise<Sweet> {
    const created = await apiRequest<Sweet>('/api/v1/sweets/', {
      method: 'POST',
      body: JSON.stringify(sweet),
    });
    return {
      ...created,
      id: created._id || created.id,
    };
  },

  async updateSweet(id: string, updates: SweetUpdate): Promise<Sweet> {
    const updated = await apiRequest<Sweet>(`/api/v1/sweets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return {
      ...updated,
      id: updated._id || updated.id,
    };
  },

  async deleteSweet(id: string): Promise<void> {
    await apiRequest(`/api/v1/sweets/${id}`, {
      method: 'DELETE',
    });
  },

  async restockSweet(id: string, quantity: number): Promise<Sweet> {
    // Use PUT endpoint to update quantity
    const updated = await apiRequest<Sweet>(`/api/v1/sweets/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
    return {
      ...updated,
      id: updated._id || updated.id,
    };
  },
};

