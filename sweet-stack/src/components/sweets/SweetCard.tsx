import React from 'react';
import { Sweet } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SweetCardProps {
  sweet: Sweet;
}

export function SweetCard({ sweet }: SweetCardProps) {
  const { user } = useAuth();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { toast } = useToast();
  const isOutOfStock = sweet.quantity <= 0;
  
  const cartItem = cartItems.find(item => item.sweet.id === sweet.id);
  const inCart = cartItem !== undefined;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast({
        title: 'Out of Stock',
        description: 'This sweet is currently out of stock.',
        variant: 'destructive',
      });
      return;
    }

    if (inCart) {
      if (cartItem.quantity < sweet.quantity) {
        updateQuantity(sweet.id, cartItem.quantity + 1);
        toast({
          title: 'Updated Cart',
          description: `Added one more ${sweet.name} to cart`,
        });
      } else {
        toast({
          title: 'Stock Limit',
          description: `Cannot add more. Only ${sweet.quantity} available.`,
          variant: 'destructive',
        });
      }
    } else {
      addToCart(sweet, 1);
      toast({
        title: 'Added to Cart! 🛒',
        description: `${sweet.name} has been added to your cart`,
      });
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-gradient-to-br from-card to-card/80 shadow-md">
      <CardHeader className="pb-3 relative">
        <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl" />
        <div className="flex items-start justify-between relative">
          <div className="mb-3 group-hover:animate-wiggle drop-shadow-lg transition-transform group-hover:scale-110">
            {sweet.imageUrl ? (
              <img 
                src={sweet.imageUrl} 
                alt={sweet.name}
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border-2 border-border/50 shadow-md"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.classList.remove('hidden');
                }}
                loading="lazy"
              />
            ) : null}
            <div className={`text-7xl md:text-8xl ${sweet.imageUrl ? 'hidden' : ''}`}>
              {sweet.image}
            </div>
          </div>
          <Badge 
            variant={isOutOfStock ? "destructive" : "secondary"}
            className="font-semibold shadow-sm"
          >
            {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} in stock`}
          </Badge>
        </div>
        <h3 className="font-display text-xl font-bold text-foreground line-clamp-1 mt-1">
          {sweet.name}
        </h3>
        <Badge variant="outline" className="w-fit text-xs bg-muted/50">
          {sweet.category}
        </Badge>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem] leading-relaxed">
          {sweet.description}
        </p>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Price</span>
          <span className="font-display text-2xl font-bold text-primary">
            ₹{sweet.price}
          </span>
        </div>
        
        {user && (
          <div className="flex items-center gap-2">
            {inCart ? (
              <div className="flex items-center gap-2 border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    if (cartItem.quantity > 1) {
                      updateQuantity(sweet.id, cartItem.quantity - 1);
                    } else {
                      updateQuantity(sweet.id, 0);
                    }
                  }}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium w-8 text-center">{cartItem.quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    if (cartItem.quantity < sweet.quantity) {
                      updateQuantity(sweet.id, cartItem.quantity + 1);
                    }
                  }}
                  disabled={cartItem.quantity >= sweet.quantity}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                size="sm"
                className="gap-2 shadow-md hover:shadow-lg transition-shadow"
              >
                <ShoppingCart className="h-4 w-4" />
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
