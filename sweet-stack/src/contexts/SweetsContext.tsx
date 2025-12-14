import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Sweet } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { sweetsService, Sweet as ApiSweet } from '@/services/sweetsService';
import { websocketService, WebSocketMessage } from '@/services/websocketService';
import { useAuth } from './AuthContext';

interface SweetsContextType {
  sweets: Sweet[];
  addSweet: (sweet: Omit<Sweet, 'id'>) => Promise<void>;
  updateSweet: (id: string, sweet: Partial<Sweet>) => Promise<void>;
  deleteSweet: (id: string) => Promise<void>;
  purchaseSweet: (id: string, quantity?: number) => Promise<boolean>;
  restockSweet: (id: string, amount: number) => Promise<void>;
  refreshSweets: () => Promise<void>;
  isLoading: boolean;
}

const SweetsContext = createContext<SweetsContextType | undefined>(undefined);

// Helper to convert API Sweet to frontend Sweet
const convertApiSweetToSweet = (apiSweet: ApiSweet): Sweet => {
  const imageUrl = apiSweet.image_url || '';
  // Check if it's a URL (http/https) or base64 data URL
  const isUrl = imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://') ||
    imageUrl.startsWith('data:image/');

  return {
    id: apiSweet.id || apiSweet._id || '',
    name: apiSweet.name,
    category: apiSweet.category,
    price: apiSweet.price,
    quantity: apiSweet.quantity,
    description: apiSweet.description || '',
    image: isUrl ? '🖼️' : (imageUrl || '🍬'), // Use emoji placeholder if URL/data, otherwise use the emoji/icon
    imageUrl: isUrl ? imageUrl : undefined, // Store URL/data URL separately if it's a URL or base64
  };
};

export function SweetsProvider({ children }: { children: ReactNode }) {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const refreshSweets = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiSweets = await sweetsService.getAllSweets();
      const convertedSweets = apiSweets.map(convertApiSweetToSweet);
      setSweets(convertedSweets);
    } catch (error) {
      console.error('Error fetching sweets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sweets. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load sweets on mount
  useEffect(() => {
    refreshSweets();
  }, [refreshSweets]);

  // Set up WebSocket for real-time stock updates
  useEffect(() => {
    const handleStockUpdate = (message: WebSocketMessage) => {
      if (message.type === 'STOCK_UPDATE') {
        const updatedSweet = message.data;

        // Handle deletion
        if (updatedSweet.deleted) {
          setSweets(prev => prev.filter(s => s.id !== updatedSweet._id));
          return;
        }

        // Update or add sweet
        setSweets(prev => {
          const existingIndex = prev.findIndex(s => s.id === updatedSweet._id);
          const convertedSweet = convertApiSweetToSweet(updatedSweet);

          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = convertedSweet;
            return updated;
          } else {
            return [...prev, convertedSweet];
          }
        });
      }
    };

    const disconnect = websocketService.connectStock(handleStockUpdate);
    return disconnect;
  }, []);

  const addSweet = async (sweet: Omit<Sweet, 'id'> & { imageUrl?: string }) => {
    try {
      const apiSweet: Omit<ApiSweet, 'id' | '_id'> = {
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
        image_url: sweet.imageUrl || sweet.image || 'https://placehold.co/200x200?text=Sweet',
      };

      await sweetsService.createSweet(apiSweet);
      await refreshSweets();

      toast({
        title: 'Sweet Added!',
        description: `${sweet.name} has been added to the inventory.`,
      });
    } catch (error: any) {
      let errorMessage = 'Failed to add sweet.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.detail) {
        errorMessage = typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail);
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateSweet = async (id: string, updates: Partial<Sweet> & { imageUrl?: string }) => {
    try {
      const updateData: any = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.category) updateData.category = updates.category;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
      if (updates.imageUrl !== undefined) {
        updateData.image_url = updates.imageUrl || 'https://placehold.co/200x200?text=Sweet';
      } else if (updates.image) {
        updateData.image_url = updates.image;
      }

      await sweetsService.updateSweet(id, updateData);
      await refreshSweets();

      toast({
        title: 'Sweet Updated!',
        description: 'The sweet has been updated successfully.',
      });
    } catch (error: any) {
      let errorMessage = 'Failed to update sweet.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.detail) {
        errorMessage = typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail);
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteSweet = async (id: string) => {
    try {
      const sweet = sweets.find(s => s.id === id);
      await sweetsService.deleteSweet(id);
      await refreshSweets();

      toast({
        title: 'Sweet Deleted',
        description: `${sweet?.name} has been removed from inventory.`,
        variant: 'destructive',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete sweet.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const purchaseSweet = async (id: string, quantity: number = 1): Promise<boolean> => {
    try {
      const { ordersService } = await import('@/services/ordersService');
      await ordersService.createOrder([{ sweet_id: id, quantity }]);

      // Stock will be updated via WebSocket
      await refreshSweets();

      const sweet = sweets.find(s => s.id === id);
      toast({
        title: 'Purchase Successful! 🎉',
        description: `You purchased ${quantity}x ${sweet?.name} for ₹${(sweet?.price || 0) * quantity}`,
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Purchase Failed',
        description: error.message || 'Failed to complete purchase.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const restockSweet = async (id: string, newQuantity: number) => {
    try {
      const sweet = sweets.find(s => s.id === id);

      // Backend expects the new total quantity, not amount to add
      await sweetsService.restockSweet(id, newQuantity);
      // Stock will be updated via WebSocket, but refresh to be sure
      await refreshSweets();

      const amountAdded = newQuantity - (sweet?.quantity || 0);
      toast({
        title: 'Restocked!',
        description: `Set stock to ${newQuantity} units for ${sweet?.name}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to restock sweet.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <SweetsContext.Provider value={{
      sweets,
      addSweet,
      updateSweet,
      deleteSweet,
      purchaseSweet,
      restockSweet,
      refreshSweets,
      isLoading
    }}>
      {children}
    </SweetsContext.Provider>
  );
}

export function useSweets() {
  const context = useContext(SweetsContext);
  if (!context) {
    throw new Error('useSweets must be used within a SweetsProvider');
  }
  return context;
}
