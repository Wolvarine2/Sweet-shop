import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useSweets } from '@/contexts/SweetsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CartSidebar() {
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { purchaseSweet } = useSweets();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!user) return null;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Cart Empty',
        description: 'Add items to cart before checkout',
        variant: 'destructive',
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      const { ordersService } = await import('@/services/ordersService');
      
      // Convert cart items to order format
      const orderItems = cartItems.map(item => ({
        sweet_id: item.sweet.id,
        quantity: item.quantity,
      }));

      await ordersService.createOrder(orderItems);
      
      // Clear cart after successful order
      clearCart();
      setIsOpen(false);
      
      toast({
        title: 'Order Placed Successfully! 🎉',
        description: `Your order of ₹${getTotalPrice().toFixed(2)} has been placed`,
      });
      
      // Navigate to order history
      navigate('/orders');
    } catch (error: any) {
      toast({
        title: 'Checkout Failed',
        description: error.message || 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="default" className="relative gap-2 shadow-md hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-r from-secondary to-gold border-0 text-foreground font-medium">
          <ShoppingCart className="h-4 w-4" />
          Cart
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground border-2 border-background shadow-lg">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Shopping Cart</SheetTitle>
          <SheetDescription>
            {cartItems.length === 0 
              ? 'Your cart is empty' 
              : `${getTotalItems()} ${getTotalItems() === 1 ? 'item' : 'items'} in your cart`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">Your cart is empty</p>
              <p className="text-muted-foreground text-sm mt-1">
                Add some sweets to get started!
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {cartItems.map((item) => (
                  <div key={item.sweet.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {item.sweet.imageUrl ? (
                        <img
                          src={item.sweet.imageUrl}
                          alt={item.sweet.name}
                          className="w-16 h-16 object-cover rounded-md border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`text-3xl ${item.sweet.imageUrl ? 'hidden' : ''}`}>
                        {item.sweet.image}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.sweet.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.sweet.category}</p>
                      <p className="text-sm font-medium text-primary mt-1">
                        ₹{item.sweet.price} each
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.sweet.id, item.quantity - 1);
                              } else {
                                removeFromCart(item.sweet.id);
                              }
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              if (item.quantity < item.sweet.quantity) {
                                updateQuantity(item.sweet.id, item.quantity + 1);
                              }
                            }}
                            disabled={item.quantity >= item.sweet.quantity}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive"
                          onClick={() => removeFromCart(item.sweet.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-medium mt-1">
                        Total: ₹{(item.sweet.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || cartItems.length === 0}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      Checkout
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

