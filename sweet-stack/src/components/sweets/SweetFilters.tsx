import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/data/mockData';
import { Search, X } from 'lucide-react';

interface SweetFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice: number;
}

export function SweetFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  maxPrice,
}: SweetFiltersProps) {
  return (
    <div className="space-y-6 rounded-xl bg-card p-6 shadow-sm border border-border">
      <div className="space-y-2">
        <Label htmlFor="search" className="font-medium">Search Sweets</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="font-medium">Categories</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer transition-colors hover:bg-primary/10"
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              {category}
              {selectedCategory === category && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="font-medium">
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </Label>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          min={0}
          max={maxPrice}
          step={0.5}
          className="mt-2"
        />
      </div>
    </div>
  );
}
