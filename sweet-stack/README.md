# Mithai Bhandar - Frontend

React + TypeScript frontend for the Mithai Bhandar online sweets shop.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Shadcn UI
- Tailwind CSS

## Environment Variables

Create a `.env` file in the `sweet-stack` directory:

### For Production (Render Backend):
```env
VITE_API_URL=https://sweet-shop-ieek.onrender.com
VITE_WS_URL=wss://sweet-shop-ieek.onrender.com
```

### For Local Development:
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

**Note:** If `VITE_WS_URL` is not provided, it will automatically be derived from `VITE_API_URL` (converting `https://` to `wss://` and `http://` to `ws://`).

## Project Structure

- `src/components/` - React components
- `src/pages/` - Page components
- `src/contexts/` - React Context providers
- `src/services/` - API service functions
- `src/lib/` - Utilities and helpers

For full documentation, see the main [README.md](../README.md) in the project root.
