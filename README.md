# Mithai Bhandar - Online Indian Sweets Shop

A full-stack e-commerce application for selling authentic Indian sweets (mithai) online. Built with FastAPI backend and React frontend, featuring real-time inventory updates, shopping cart, and order management.

## 🍬 Features

### Customer Features
- **Browse Sweets**: View all available Indian sweets with categories (Laddu, Barfi, Halwa, Milk Sweets, Dry Sweets, Traditional)
- **Shopping Cart**: Add multiple items to cart, adjust quantities, and checkout
- **Order History**: View your past purchases with detailed order information
- **Real-time Updates**: See stock changes in real-time via WebSocket
- **Search & Filter**: Search sweets by name/category and filter by price range

### Admin Features
- **Inventory Management**: Add, edit, delete, and restock sweets
- **Image Upload**: Support for image URLs, file uploads (converted to base64), or emoji icons
- **Order Management**: View all customer orders with customer details
- **Real-time Notifications**: Get notified when new orders are placed
- **Stock Management**: Update quantities and track inventory

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database with Beanie ODM
- **Motor** - Async MongoDB driver
- **WebSockets** - Real-time communication
- **JWT** - Authentication and authorization
- **bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📁 Project Structure

```
.
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   └── v1/
│   │   │       └── endpoints/
│   │   │           ├── auth.py      # Authentication endpoints
│   │   │           ├── sweets.py    # Sweets CRUD endpoints
│   │   │           └── orders.py    # Order endpoints
│   │   ├── core/           # Core configuration
│   │   │   ├── config.py   # Settings and environment variables
│   │   │   └── security.py # JWT and password hashing
│   │   ├── db/             # Database connection
│   │   │   └── mongodb.py
│   │   ├── models/         # Database models
│   │   │   ├── user.py
│   │   │   ├── sweet.py
│   │   │   └── order.py
│   │   ├── services/       # Business logic
│   │   │   └── websocket_manager.py
│   │   └── main.py         # FastAPI app entry point
│   ├── create_users.py     # Script to create sample users
│   └── requirements.txt    # Python dependencies
│
└── sweet-stack/            # React frontend
    ├── src/
    │   ├── components/     # React components
    │   │   ├── cart/       # Shopping cart components
    │   │   ├── layout/     # Layout components (Header)
    │   │   ├── sweets/     # Sweet-related components
    │   │   └── ui/         # Shadcn UI components
    │   ├── contexts/       # React Context providers
    │   │   ├── AuthContext.tsx
    │   │   ├── CartContext.tsx
    │   │   └── SweetsContext.tsx
    │   ├── pages/          # Page components
    │   │   ├── Index.tsx    # Home page
    │   │   ├── Dashboard.tsx
    │   │   ├── Admin.tsx
    │   │   ├── OrderHistory.tsx
    │   │   ├── Login.tsx
    │   │   └── Register.tsx
    │   ├── services/       # API service functions
    │   │   ├── authService.ts
    │   │   ├── sweetsService.ts
    │   │   ├── ordersService.ts
    │   │   └── websocketService.ts
    │   └── lib/           # Utilities
    │       └── api.ts     # API configuration
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+** (for backend)
- **Node.js 18+** and **npm** (for frontend)
- **MongoDB Atlas** account or local MongoDB instance

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows (PowerShell):
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - Windows (CMD):
     ```cmd
     venv\Scripts\activate.bat
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure environment variables:**
   - Create a `.env` file in the `backend` directory:
     ```ini
     MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
     SECRET_KEY=your-secret-key-here-make-it-long-and-random
     ACCESS_TOKEN_EXPIRE_MINUTES=60
     ```
   - Replace `username`, `password`, and `cluster` with your MongoDB Atlas credentials
   - Generate a secure `SECRET_KEY` (you can use: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)

6. **Create sample users:**
   ```bash
   python create_users.py
   ```
   This creates:
   - Admin: `admin@gmail.com` / `admin@123`
   - User: `user@gmail.com` / `user@123`

7. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`
   API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd sweet-stack
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional):**
   - Create a `.env` file in the `sweet-stack` directory:
     ```env
     VITE_API_URL=http://localhost:8000
     VITE_WS_URL=ws://localhost:8000
     ```
   - If not set, defaults to `http://localhost:8000`

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:8080`

## 📝 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Sweets
- `GET /api/v1/sweets/` - Get all sweets
- `GET /api/v1/sweets/search?q={query}` - Search sweets
- `POST /api/v1/sweets/` - Create sweet (admin only)
- `PUT /api/v1/sweets/{id}` - Update sweet (admin only)
- `DELETE /api/v1/sweets/{id}` - Delete sweet (admin only)

### Orders
- `POST /api/v1/orders/` - Create order (authenticated)
- `GET /api/v1/orders/my-history` - Get user's orders
- `GET /api/v1/orders/all` - Get all orders (admin only)

### WebSockets
- `ws://localhost:8000/ws/stock` - Real-time stock updates
- `ws://localhost:8000/ws/admin` - Real-time order notifications (admin)

## 👥 User Roles

### Regular User
- Browse and search sweets
- Add items to cart
- Place orders
- View own order history

### Admin
- All user features
- Manage inventory (CRUD operations)
- View all customer orders
- Receive real-time order notifications
- Restock items

## 🎨 Indian Sweet Categories

- **Laddu** - Traditional round sweets (Motichoor, Besan, etc.)
- **Barfi** - Milk-based fudge-like sweets (Kaju, Pista, etc.)
- **Halwa** - Sweet pudding-like desserts (Gajar, Sooji, etc.)
- **Milk Sweets** - Milk-based sweets (Gulab Jamun, Rasgulla, Kheer, etc.)
- **Dry Sweets** - Non-perishable sweets (Soan Papdi, Mathri, etc.)
- **Traditional** - Classic Indian sweets (Jalebi, Imarti, etc.)

## 🔐 Authentication

- JWT-based authentication
- Tokens stored in localStorage
- Automatic session expiration handling
- Protected routes for authenticated users
- Admin-only routes for inventory management

## 🛒 Shopping Cart

- Add multiple items to cart
- Adjust quantities
- Real-time stock validation
- Cart persists in localStorage
- Checkout with multiple items at once

## 📦 Order Management

- Customers see only their own orders
- Admins see all customer orders with customer details
- Order history sorted by date (newest first)
- Order statistics (total orders, total spent/revenue, average order)

## 🎨 Theme

The application features an Indian-inspired color scheme:
- **Saffron** - Primary color (warm orange)
- **Gold** - Secondary color
- **Deep Red** - Accent color
- **Cream** - Background tones

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

## 📦 Building for Production

### Backend
```bash
cd backend
# Install production dependencies
pip install -r requirements.txt
# Run with production settings
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd sweet-stack
npm run build
# Output will be in sweet-stack/dist/
```

## 🔧 Environment Variables

### Backend (.env)
```ini
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure username and password are correct
- Verify network connectivity

### Backend Issues
- Ensure virtual environment is activated
- Check all dependencies are installed: `pip install -r requirements.txt`
- Verify `.env` file exists and has correct values

### Frontend Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check that backend is running on port 8000
- Verify environment variables are set correctly

## 📄 License

This project is private and proprietary.

## 👨‍💻 Development

### Code Structure
- **Backend**: Follows FastAPI best practices with async/await
- **Frontend**: React with TypeScript, Context API for state management
- **Styling**: Tailwind CSS with custom Indian theme colors
- **Components**: Reusable Shadcn UI components

### Key Features Implementation
- **Real-time Updates**: WebSocket connections for stock and order notifications
- **Session Management**: JWT tokens with automatic expiration handling
- **Image Handling**: Support for URLs, file uploads (base64), and emoji fallbacks
- **Cart Persistence**: LocalStorage for cart state across sessions

## 🎯 Future Enhancements

- Payment gateway integration
- Email notifications
- Order tracking
- User reviews and ratings
- Wishlist functionality
- Advanced search filters
- Multi-language support

---

**Made with 🍬 and love for authentic Indian sweets**

