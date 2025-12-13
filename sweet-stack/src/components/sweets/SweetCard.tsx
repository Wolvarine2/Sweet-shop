import React from 'react';
import { Sweet } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSweets } from '@/contexts/SweetsContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart } from 'lucide-react';

interface SweetCardProps {
  sweet: Sweet;
}

export function SweetCard({ sweet }: SweetCardProps) {
  const { purchaseSweet } = useSweets();
  const { user } = useAuth();
  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const isOutOfStock = sweet.quantity <= 0;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      await purchaseSweet(sweet.id, 1);
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setIsPurchasing(false);
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
                className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg border-2 border-border/50"
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
          <Button
            onClick={handlePurchase}
            disabled={isOutOfStock || isPurchasing}
            size="sm"
            className="gap-2 shadow-md hover:shadow-lg transition-shadow"
          >
            <ShoppingCart className="h-4 w-4" />
            {isPurchasing ? 'Processing...' : isOutOfStock ? 'Sold Out' : 'Buy Now'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
