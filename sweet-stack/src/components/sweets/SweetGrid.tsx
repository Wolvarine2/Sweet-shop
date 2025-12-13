import { Sweet } from '@/data/mockData';
import { SweetCard } from './SweetCard';
import { CandyOff } from 'lucide-react';

interface SweetGridProps {
  sweets: Sweet[];
}

export function SweetGrid({ sweets }: SweetGridProps) {
  if (sweets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CandyOff className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          No Sweets Found
        </h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sweets.map((sweet) => (
        <SweetCard key={sweet.id} sweet={sweet} />
      ))}
    </div>
  );
}
