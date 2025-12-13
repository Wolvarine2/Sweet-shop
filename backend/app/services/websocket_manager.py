from fastapi import WebSocket
from typing import List, Dict

class ConnectionManager:
    def __init__(self):
        # Two channels: 'stock' for customers, 'admin' for shop owners
        self.active_connections: Dict[str, List[WebSocket]] = {
            "stock": [],
            "admin": []
        }

    async def connect(self, websocket: WebSocket, channel: str):
        await websocket.accept()
        if channel in self.active_connections:
            self.active_connections[channel].append(websocket)

    def disconnect(self, websocket: WebSocket, channel: str):
        if channel in self.active_connections:
            if websocket in self.active_connections[channel]:
                self.active_connections[channel].remove(websocket)

    async def broadcast_stock_update(self, sweet_data: dict):
        """Notify all users about stock changes"""
        # Ensure ObjectId is stringified for JSON
        if "_id" in sweet_data:
            sweet_data["_id"] = str(sweet_data["_id"])
            
        message = {"type": "STOCK_UPDATE", "data": sweet_data}
        # Iterate copy of list to avoid modification errors during loop
        for connection in self.active_connections["stock"][:]:
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection, "stock")

    async def broadcast_new_order(self, order_data: dict):
        """Notify admins about new orders"""
        if "_id" in order_data:
            order_data["_id"] = str(order_data["_id"])
        if "user_id" in order_data:
            order_data["user_id"] = str(order_data["user_id"])
            
        message = {"type": "NEW_ORDER", "data": order_data}
        for connection in self.active_connections["admin"][:]:
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection, "admin")

manager = ConnectionManager()

