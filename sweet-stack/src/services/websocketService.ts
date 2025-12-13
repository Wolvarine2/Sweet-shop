import { getWebSocketUrl } from '@/lib/api';

export type WebSocketMessage = {
  type: 'STOCK_UPDATE' | 'NEW_ORDER';
  data: any;
};

export type WebSocketCallback = (message: WebSocketMessage) => void;

class WebSocketService {
  private stockConnection: WebSocket | null = null;
  private adminConnection: WebSocket | null = null;
  private stockCallbacks: Set<WebSocketCallback> = new Set();
  private adminCallbacks: Set<WebSocketCallback> = new Set();

  connectStock(onMessage: WebSocketCallback): () => void {
    if (this.stockConnection?.readyState === WebSocket.OPEN) {
      this.stockCallbacks.add(onMessage);
      return () => this.stockCallbacks.delete(onMessage);
    }

    const ws = new WebSocket(getWebSocketUrl('stock'));
    this.stockConnection = ws;

    ws.onopen = () => {
      console.log('📡 Connected to stock updates');
      this.stockCallbacks.add(onMessage);
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.stockCallbacks.forEach(callback => callback(message));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('📡 Disconnected from stock updates');
      this.stockConnection = null;
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (this.stockCallbacks.size > 0) {
          this.connectStock(onMessage);
        }
      }, 3000);
    };

    return () => {
      this.stockCallbacks.delete(onMessage);
      if (this.stockCallbacks.size === 0 && ws.readyState === WebSocket.OPEN) {
        ws.close();
        this.stockConnection = null;
      }
    };
  }

  connectAdmin(onMessage: WebSocketCallback): () => void {
    if (this.adminConnection?.readyState === WebSocket.OPEN) {
      this.adminCallbacks.add(onMessage);
      return () => this.adminCallbacks.delete(onMessage);
    }

    const ws = new WebSocket(getWebSocketUrl('admin'));
    this.adminConnection = ws;

    ws.onopen = () => {
      console.log('📡 Connected to admin updates');
      this.adminCallbacks.add(onMessage);
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.adminCallbacks.forEach(callback => callback(message));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('📡 Disconnected from admin updates');
      this.adminConnection = null;
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (this.adminCallbacks.size > 0) {
          this.connectAdmin(onMessage);
        }
      }, 3000);
    };

    return () => {
      this.adminCallbacks.delete(onMessage);
      if (this.adminCallbacks.size === 0 && ws.readyState === WebSocket.OPEN) {
        ws.close();
        this.adminConnection = null;
      }
    };
  }

  disconnectAll(): void {
    if (this.stockConnection) {
      this.stockConnection.close();
      this.stockConnection = null;
    }
    if (this.adminConnection) {
      this.adminConnection.close();
      this.adminConnection = null;
    }
    this.stockCallbacks.clear();
    this.adminCallbacks.clear();
  }
}

export const websocketService = new WebSocketService();

