import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Candy, ShoppingBag, Shield, Sparkles, Heart, Star, Truck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-[hsl(var(--cream))] to-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-indian opacity-5" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container relative py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 px-6 py-3 text-sm font-medium text-primary border border-primary/30 shadow-md">
              <Sparkles className="h-4 w-4" />
              <span>Authentic Indian Mithai - Made with Love & Tradition</span>
            </div>
            
            <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl mb-6">
              <span className="bg-gradient-to-r from-primary via-[hsl(var(--deep-red))] to-primary bg-clip-text text-transparent">
                Mithai Bhandar
              </span>
              <br />
              <span className="text-foreground">Traditional Sweets,</span>
              <br />
              <span className="text-foreground">Modern Experience</span>
            </h1>
            
            <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
              Discover our exquisite collection of handcrafted Indian sweets. From classic 
              <span className="font-semibold text-primary"> Laddu & Barfi</span> to traditional 
              <span className="font-semibold text-primary"> Gulab Jamun & Halwa</span>, 
              we bring authentic flavors to your doorstep.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                size="lg" 
                className="gap-2 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-primary to-[hsl(var(--warm-orange))] border-0"
                onClick={handleGetStarted}
              >
                <ShoppingBag className="h-5 w-5" />
                {user ? 'Browse Sweets' : 'Start Shopping'}
              </Button>
              {!user && (
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2 border-primary/30 shadow-md hover:shadow-lg transition-all hover:scale-105">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground mt-1">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground mt-1">Sweet Varieties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/50 bg-card/50 py-20 backdrop-blur-sm">
        <div className="container">
          <h2 className="font-display text-4xl font-bold text-center text-foreground mb-4">
            Why Choose <span className="text-primary">Mithai Bhandar</span>?
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            We bring you the finest Indian sweets with authentic recipes and premium ingredients
          </p>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-2xl bg-gradient-to-br from-card to-card/80 p-8 text-center shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-all hover:scale-105 hover:shadow-xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary shadow-md group-hover:scale-110 transition-transform">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Authentic Recipes</h3>
              <p className="text-muted-foreground">
                Traditional recipes passed down through generations, made with love and premium ingredients
              </p>
            </div>
            
            <div className="group rounded-2xl bg-gradient-to-br from-card to-card/80 p-8 text-center shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-all hover:scale-105 hover:shadow-xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-secondary/20 to-gold/20 text-secondary shadow-md group-hover:scale-110 transition-transform">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Fresh & Fast Delivery</h3>
              <p className="text-muted-foreground">
                Freshly made sweets delivered to your doorstep. Quick checkout and reliable service
              </p>
            </div>
            
            <div className="group rounded-2xl bg-gradient-to-br from-card to-card/80 p-8 text-center shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-all hover:scale-105 hover:shadow-xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-[hsl(var(--deep-red))]/20 text-accent shadow-md group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Every sweet is crafted with care. Secure payments and guaranteed satisfaction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <h2 className="font-display text-4xl font-bold text-center text-foreground mb-4">
            Our <span className="text-primary">Sweet Collection</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Explore our wide range of traditional Indian sweets
          </p>
          
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
            {['Laddu', 'Barfi', 'Halwa', 'Milk Sweets', 'Dry Sweets', 'Traditional'].map((category) => (
              <div key={category} className="group rounded-xl bg-card p-6 text-center shadow-md border border-border hover:border-primary/30 transition-all hover:scale-105 hover:shadow-lg cursor-pointer">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🍬</div>
                <h3 className="font-display font-semibold text-foreground">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-3xl gradient-indian p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Ready for a Sweet Experience?
              </h2>
              <p className="text-lg md:text-xl opacity-95 mb-8 max-w-2xl mx-auto">
                Join thousands of happy customers and discover your new favorite mithai today. 
                Fresh, authentic, and made with love.
              </p>
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-white text-primary hover:bg-white/90"
                onClick={handleGetStarted}
              >
                {user ? 'Browse Collection' : 'Create Free Account'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 py-12 backdrop-blur-sm">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-display text-xl font-bold mb-4 bg-gradient-to-r from-primary to-[hsl(var(--deep-red))] bg-clip-text text-transparent">
                Mithai Bhandar
              </h3>
              <p className="text-muted-foreground">
                Your trusted destination for authentic Indian sweets. Made with tradition, delivered with love.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Browse Sweets</Link></li>
                {user && <li><Link to="/orders" className="hover:text-primary transition-colors">My Orders</Link></li>}
                <li><Link to="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-muted-foreground">
                Email: support@mithaibhandar.com<br />
                Phone: +91 123 456 7890
              </p>
            </div>
          </div>
          <div className="text-center text-muted-foreground pt-8 border-t border-border/50">
            <p>© 2024 Mithai Bhandar. Made with 🍬 and love for authentic Indian sweets.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
