'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORIES, RegretCategory } from '@/lib/types';
import { getCategoryIcon } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: RegretCategory | 'all';
  onCategoryChange: (category: RegretCategory | 'all') => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="w-full">
      <Tabs value={selectedCategory} onValueChange={onCategoryChange} className="w-full">
        <TabsList className="grid w-full grid-cols-8 h-auto bg-muted/50">
          <TabsTrigger 
            value="all" 
            className="flex flex-col items-center space-y-1 p-3 data-[state=active]:bg-background"
          >
            <span className="text-lg">📚</span>
            <span className="text-xs">All</span>
          </TabsTrigger>
          
          {CATEGORIES.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex flex-col items-center space-y-1 p-3 data-[state=active]:bg-background"
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-xs">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
