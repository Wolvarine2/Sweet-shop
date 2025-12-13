import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Candy, LogOut, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-2xl">
            🍬
          </div>
          <span className="font-display text-2xl font-bold text-primary">
            Sweet Shop
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="font-medium">
                  <Candy className="mr-2 h-4 w-4" />
                  Browse Sweets
                </Button>
              </Link>

              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" className="font-medium">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover">
                  <DropdownMenuItem disabled className="text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    Role: {user.role}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="font-medium">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="font-medium">
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
