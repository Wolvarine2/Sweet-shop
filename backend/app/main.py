from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.db.mongodb import init_db
from app.api.v1.endpoints import auth, sweets, orders
from app.services.websocket_manager import manager

app = FastAPI(title="Sweet Shop Realtime API")

# Allow frontend to access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def start_db():
    await init_db()

# --- Routes ---
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(sweets.router, prefix="/api/v1/sweets", tags=["Sweets"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])

# --- Realtime Channels ---
@app.websocket("/ws/stock")
async def ws_stock(websocket: WebSocket):
    """Channel for Customers: Receives stock updates"""
    await manager.connect(websocket, "stock")
    try:
        while True:
            await websocket.receive_text()  # Keep alive
    except WebSocketDisconnect:
        manager.disconnect(websocket, "stock")

@app.websocket("/ws/admin")
async def ws_admin(websocket: WebSocket):
    """Channel for Admins: Receives new order alerts"""
    # In a real app, you would validate the admin token in the Query Param here!
    await manager.connect(websocket, "admin")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, "admin")

