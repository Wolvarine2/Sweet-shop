import { useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { SweetFilters } from '@/components/sweets/SweetFilters';
import { SweetGrid } from '@/components/sweets/SweetGrid';
import { useSweets } from '@/contexts/SweetsContext';

export default function Dashboard() {
  const { sweets } = useSweets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const maxPrice = useMemo(() => Math.max(...sweets.map(s => s.price)), [sweets]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice || 500]);

  const filteredSweets = useMemo(() => {
    return sweets.filter((sweet) => {
      const matchesSearch = sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sweet.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || sweet.category === selectedCategory;
      const matchesPrice = sweet.price >= priceRange[0] && sweet.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [sweets, searchQuery, selectedCategory, priceRange]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            ✨ Fresh & Delicious
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            Sweet Collection
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Browse our delicious selection of {sweets.length} handcrafted sweets
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside>
            <SweetFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxPrice}
            />
          </aside>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredSweets.length} of {sweets.length} sweets
              </p>
            </div>
            <SweetGrid sweets={filteredSweets} />
          </section>
        </div>
      </main>
    </div>
  );
}
