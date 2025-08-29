'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORIES, RegretCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface CategoryFilterProps {
  selectedCategory: RegretCategory | 'all';
  onCategoryChange: (category: RegretCategory | 'all') => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftShadow(scrollLeft > 0);
      setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll);
    
    const handleResize = () => handleScroll();
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const allCategories = [
    { id: 'all' as const, name: 'All', icon: '📚', description: 'View all regrets' },
    ...CATEGORIES
  ];

  return (
    <div className="w-full">
      {/* Desktop - Enhanced Grid Layout */}
      <div className="hidden sm:block">
        <Tabs 
          value={selectedCategory} 
          onValueChange={(value) => onCategoryChange(value as RegretCategory | 'all')} 
          className="w-full"
        >
          <TabsList className={cn(
            "grid w-full h-auto bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 backdrop-blur-sm p-3 gap-3 rounded-2xl border border-border/50",
            "grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8",
            "shadow-lg shadow-black/5"
          )}>
            {allCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={cn(
                  "flex flex-col items-center space-y-3 p-4 md:p-5",
                  // Enhanced active state
                  "data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/20 data-[state=active]:to-primary/10",
                  "data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20",
                  "data-[state=active]:scale-105 data-[state=active]:border-2 data-[state=active]:border-primary/30",
                  // Improved hover effects
                  "hover:bg-gradient-to-br hover:from-muted/40 hover:to-muted/20 hover:scale-102",
                  "hover:shadow-md hover:shadow-black/10",
                  // Better transitions
                  "transition-all duration-300 ease-out",
                  "rounded-xl group relative overflow-hidden",
                  // Focus states
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  // Animated background
                  "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent",
                  "before:opacity-0 data-[state=active]:before:opacity-100 before:transition-opacity before:duration-300"
                )}
                title={category.description}
              >
                {/* Icon with enhanced animations */}
                <span className={cn(
                  "text-2xl md:text-3xl transition-all duration-300 relative z-10",
                  "group-hover:scale-110 group-data-[state=active]:scale-110",
                  "filter group-hover:brightness-110",
                  // Add subtle rotation on hover
                  "group-hover:rotate-3 group-data-[state=active]:rotate-3"
                )}>
                  {category.icon}
                </span>
                
                {/* Label with better typography */}
                <span className={cn(
                  "text-xs md:text-sm font-medium text-center leading-tight relative z-10",
                  "group-data-[state=active]:text-foreground group-data-[state=active]:font-semibold",
                  "transition-all duration-300"
                )}>
                  {category.name}
                </span>

                {/* Active indicator dot */}
                <div className={cn(
                  "absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full",
                  "opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300"
                )} />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile - Enhanced Scrollable Layout */}
      <div className="sm:hidden relative">
        {/* Enhanced shadow indicators */}
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 rounded-l-2xl",
          showLeftShadow ? "opacity-100" : "opacity-0"
        )} />
        
        <div className={cn(
          "absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 rounded-r-2xl",
          showRightShadow ? "opacity-100" : "opacity-0"
        )} />

        <Tabs 
          value={selectedCategory} 
          onValueChange={(value) => onCategoryChange(value as RegretCategory | 'all')} 
          className="w-full"
        >
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide pb-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <TabsList className="flex w-max h-auto bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 backdrop-blur-sm p-3 gap-3 rounded-2xl min-w-full border border-border/50 shadow-lg">
              {allCategories.map((category, index) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className={cn(
                    "flex flex-col items-center space-y-2 p-3 min-w-[85px] max-w-[95px]",
                    // Enhanced mobile active state
                    "data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/20 data-[state=active]:to-primary/10",
                    "data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20",
                    "data-[state=active]:scale-105 data-[state=active]:border-2 data-[state=active]:border-primary/30",
                    // Mobile hover effects
                    "hover:bg-gradient-to-br hover:from-muted/40 hover:to-muted/20 hover:scale-102",
                    "transition-all duration-300 ease-out",
                    "rounded-xl flex-shrink-0 group relative overflow-hidden",
                    // Enhanced margins for shadows
                    index === 0 && "ml-2",
                    index === allCategories.length - 1 && "mr-2"
                  )}
                  title={category.description}
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300 rounded-xl" />
                  
                  <span className={cn(
                    "text-xl transition-all duration-300 relative z-10",
                    "group-hover:scale-110 group-data-[state=active]:scale-110",
                    "filter group-hover:brightness-110"
                  )}>
                    {category.icon}
                  </span>
                  <span className={cn(
                    "text-xs font-medium text-center leading-tight px-1 relative z-10",
                    "group-data-[state=active]:text-foreground group-data-[state=active]:font-semibold",
                    "truncate w-full transition-all duration-300"
                  )}>
                    {category.name}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {/* Enhanced scroll hint */}
        <div className={cn(
          "flex items-center justify-center mt-3 text-xs text-muted-foreground/70 transition-opacity duration-500",
          !showRightShadow && allCategories.length > 4 ? "opacity-100" : "opacity-0"
        )}>
          <span className="animate-pulse bg-muted/30 px-3 py-1 rounded-full backdrop-blur-sm">
            ← Swipe to see more categories
          </span>
        </div>
      </div>
    </div>
  );
}