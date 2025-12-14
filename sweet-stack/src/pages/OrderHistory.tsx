import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { ordersService, Order } from '@/services/ordersService';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrderHistory() {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      // If admin, show all orders. Otherwise, show only user's orders
      const fetchedOrders = isAdmin 
        ? await ordersService.getAllOrders()
        : await ordersService.getMyOrders();
      
      // Sort by date, most recent first
      const sortedOrders = fetchedOrders.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setOrders(sortedOrders);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load order history.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            📦 Order History
          </h1>
          <p className="text-muted-foreground text-lg">
            {isAdmin ? 'View all customer orders' : 'View your past purchases'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">No orders yet</p>
              <p className="text-muted-foreground text-sm mt-1">
                Your order history will appear here after you make a purchase
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 mb-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {isAdmin ? 'Total Revenue' : 'Total Spent'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">₹{totalSpent.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Order
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{orders.length > 0 ? (totalSpent / orders.length).toFixed(2) : '0.00'}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <div className="p-4 border-b flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadOrders}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    {isAdmin && <TableHead>Customer</TableHead>}
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        #{order.id?.slice(-8) || 'N/A'}
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{order.user_email}</span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex flex-col gap-1 max-w-md">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-sm">
                              <span className="font-medium">{item.sweet_name}</span>
                              <span className="text-muted-foreground"> × {item.quantity}</span>
                              <span className="text-muted-foreground ml-2">@ ₹{item.price_at_purchase}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-primary text-lg">
                        ₹{order.total_amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

