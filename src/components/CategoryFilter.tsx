'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORIES, RegretCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { getIconComponent } from '@/lib/utils';
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
    { id: 'all' as const, name: 'All', icon: 'BookOpen', description: 'View all regrets' },
    ...CATEGORIES
  ];

  return (
    <div className="w-full">
      {/* Desktop - Subtle Grid Layout */}
      <div className="hidden sm:block">
        <Tabs 
          value={selectedCategory} 
          onValueChange={(value) => onCategoryChange(value as RegretCategory | 'all')} 
          className="w-full"
        >
          <TabsList className={cn(
            "grid w-full h-auto bg-background/50 backdrop-blur-sm p-2 gap-2 rounded-xl border border-border/30",
            "grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8",
            "shadow-sm"
          )}>
            {allCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={cn(
                  "flex items-center p-3",
                  "data-[state=active]:bg-primary/8 data-[state=active]:text-primary",
                  "data-[state=active]:border data-[state=active]:border-primary/20",
                  "hover:bg-muted/40 hover:text-foreground/80 cursor-pointer",
                  "transition-all duration-200 ease-out",
                  "rounded-lg group relative",
                  "focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1 gap-1"
                )}
                title={category.description}
              >
                {/* Icon with subtle animations */}
                <span className={cn(
                  "text-lg transition-all duration-200 relative z-10",
                  "group-hover:scale-105 group-data-[state=active]:scale-105",
                  "opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100"
                )}>
                  {(() => {
                    const IconComponent = getIconComponent(category.icon);
                    return <IconComponent className="h-4 w-4" />;
                  })()}
                </span>
                
                {/* Label with refined typography */}
                <span className={cn(
                  "text-xs font-medium text-center leading-tight relative z-10",
                  "text-muted-foreground group-hover:text-foreground/80",
                  "group-data-[state=active]:text-primary group-data-[state=active]:font-medium",
                  "transition-all duration-200"
                )}>
                  {category.name}
                </span>

                {/* Subtle active indicator */}
                <div className={cn(
                  "absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full",
                  "opacity-0 data-[state=active]:opacity-100 transition-opacity duration-200"
                )} />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile - Subtle Scrollable Layout */}
      <div className="sm:hidden relative">
        {/* Subtle shadow indicators */}
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background via-background/90 to-transparent z-10 pointer-events-none transition-opacity duration-200 rounded-l-xl",
          showLeftShadow ? "opacity-100" : "opacity-0"
        )} />
        
        <div className={cn(
          "absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background via-background/90 to-transparent z-10 pointer-events-none transition-opacity duration-200 rounded-r-xl",
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
            <TabsList className="flex w-max h-auto bg-background/50 backdrop-blur-sm p-2 gap-2 rounded-xl min-w-full border border-border/30 shadow-sm">
              {allCategories.map((category, index) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className={cn(
                    "flex flex-col items-center space-y-1.5 p-2.5 min-w-[70px] max-w-[80px]",
                    // Subtle mobile active state
                    "data-[state=active]:bg-primary/8 data-[state=active]:text-primary",
                    "data-[state=active]:border data-[state=active]:border-primary/20",
                    // Mobile hover effects
                    "hover:bg-muted/40 hover:text-foreground/80",
                    "transition-all duration-200 ease-out",
                    "rounded-lg flex-shrink-0 group relative",
                    // Enhanced margins for shadows
                    index === 0 && "ml-1",
                    index === allCategories.length - 1 && "mr-1"
                  )}
                  title={category.description}
                >
                  <span className={cn(
                    "text-base transition-all duration-200 relative z-10",
                    "group-hover:scale-105 group-data-[state=active]:scale-105",
                    "opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100"
                  )}>
                    {(() => {
                      const IconComponent = getIconComponent(category.icon);
                      return <IconComponent className="h-4 w-4" />;
                    })()}
                  </span>
                  <span className={cn(
                    "text-xs font-medium text-center leading-tight px-1 relative z-10",
                    "text-muted-foreground group-hover:text-foreground/80",
                    "group-data-[state=active]:text-primary group-data-[state=active]:font-medium",
                    "truncate w-full transition-all duration-200"
                  )}>
                    {category.name}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {/* Subtle scroll hint */}
        <div className={cn(
          "flex items-center justify-center mt-2 text-xs text-muted-foreground/50 transition-opacity duration-300",
          !showRightShadow && allCategories.length > 4 ? "opacity-100" : "opacity-0"
        )}>
          <span className="bg-muted/20 px-2 py-1 rounded-md backdrop-blur-sm">
            ← Swipe for more
          </span>
        </div>
      </div>
    </div>
  );
}