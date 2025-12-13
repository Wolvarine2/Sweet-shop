import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Candy, ShoppingBag, Shield, Sparkles } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-candy opacity-10" />
        <div className="container relative py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Welcome to the sweetest place online
            </div>
            
            <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Life is{' '}
              <span className="text-primary">Sweet</span>
              <br />
              at Our Shop
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Discover our delightful collection of handcrafted candies, chocolates, 
              and treats. From classic favorites to unique creations, we have something 
              for every sweet tooth.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button size="lg" className="gap-2 text-lg px-8">
                  <ShoppingBag className="h-5 w-5" />
                  Start Shopping
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
            Why Choose Sweet Shop?
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-card p-8 text-center shadow-sm border border-border">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Candy className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Every sweet is crafted with the finest ingredients and lots of love
              </p>
            </div>
            
            <div className="rounded-2xl bg-card p-8 text-center shadow-sm border border-border">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Easy Shopping</h3>
              <p className="text-muted-foreground">
                Browse, search, and purchase your favorites with just a few clicks
              </p>
            </div>
            
            <div className="rounded-2xl bg-card p-8 text-center shadow-sm border border-border">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Secure & Fast</h3>
              <p className="text-muted-foreground">
                Your orders are safe with us. Quick checkout and reliable delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-3xl gradient-candy p-12 text-center text-white">
            <h2 className="font-display text-4xl font-bold mb-4">
              Ready for a Sweet Experience?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Join thousands of happy customers and discover your new favorite treats today.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-muted-foreground">
          <p>© 2024 Sweet Shop. Made with 🍬 and love.</p>
        </div>
      </footer>
    </div>
  );
}
