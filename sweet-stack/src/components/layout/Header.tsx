import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Candy, LogOut, Settings, ShoppingBag } from 'lucide-react';
import { CartSidebar } from '@/components/cart/CartSidebar';

export function Header() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-primary/20 bg-gradient-to-r from-background via-[hsl(var(--cream))] to-background shadow-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary via-[hsl(var(--warm-orange))] to-[hsl(var(--deep-red))] shadow-lg group-hover:scale-110 transition-transform overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/30 to-transparent"></div>
            <div className="relative z-10 w-8 h-8 rounded-full bg-gradient-to-br from-white/90 to-gold/50 shadow-inner"></div>
          </div>
          <span className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--deep-red))] bg-clip-text text-transparent">
            Mithai Bhandar
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="default" className="font-medium shadow-md hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-r from-primary to-[hsl(var(--warm-orange))] border-0">
                  <Candy className="mr-2 h-4 w-4" />
                  Browse Sweets
                </Button>
              </Link>

              <Link to="/orders">
                <Button variant="default" className="font-medium shadow-md hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-r from-secondary to-gold border-0 text-foreground">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  My Orders
                </Button>
              </Link>

              <div className="[&_button]:shadow-md [&_button]:hover:shadow-lg [&_button]:transition-all [&_button]:hover:scale-105">
                <CartSidebar />
              </div>

              {isAdmin && (
                <Link to="/admin">
                  <Button variant="default" className="font-medium shadow-md hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-r from-accent to-[hsl(var(--deep-red))] border-0">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}

              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="gap-2 shadow-md hover:shadow-lg transition-all hover:scale-105 border-2 border-primary/30 bg-background/80 backdrop-blur-sm"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="font-medium shadow-md hover:shadow-lg transition-all hover:scale-105 border-2 border-primary/30">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="font-medium shadow-md hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-r from-primary to-warm-orange border-0">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
