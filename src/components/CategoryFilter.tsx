"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES, RegretCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { getIconComponent } from "@/lib/utils";
interface CategoryFilterProps {
  selectedCategory: RegretCategory | "all";
  onCategoryChange: (category: RegretCategory | "all") => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
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
    container.addEventListener("scroll", handleScroll);

    const handleResize = () => handleScroll();
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const allCategories = [
    {
      id: "all" as const,
      name: "All",
      icon: "BookOpen",
      description: "View all regrets",
    },
    ...CATEGORIES,
  ];

  return (
    <div className="w-full">
      {/* Desktop - Subtle Grid Layout */}
      <div className="hidden sm:block">
        <Tabs
          value={selectedCategory}
          onValueChange={(value) =>
            onCategoryChange(value as RegretCategory | "all")
          }
          className="w-full"
        >
          <TabsList
            className={cn(
              "bg-background/50 border-border/30 grid h-auto w-full gap-2 rounded-xl border p-2 backdrop-blur-sm",
              "grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8",
              "shadow-sm"
            )}
          >
            {allCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={cn(
                  "flex items-center p-3",
                  "data-[state=active]:bg-primary/8 data-[state=active]:text-primary",
                  "data-[state=active]:border-primary/20 data-[state=active]:border",
                  "hover:bg-muted/40 hover:text-foreground/80 cursor-pointer",
                  "transition-all duration-200 ease-out",
                  "group relative rounded-lg",
                  "focus-visible:ring-primary/30 gap-1 focus-visible:ring-1 focus-visible:ring-offset-1"
                )}
                title={category.description}
              >
                {/* Icon with subtle animations */}
                <span
                  className={cn(
                    "relative z-10 text-lg transition-all duration-200",
                    "group-hover:scale-105 group-data-[state=active]:scale-105",
                    "opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100"
                  )}
                >
                  {(() => {
                    const IconComponent = getIconComponent(category.icon);
                    return <IconComponent className="h-4 w-4" />;
                  })()}
                </span>

                {/* Label with refined typography */}
                <span
                  className={cn(
                    "relative z-10 text-center text-xs leading-tight font-medium",
                    "text-muted-foreground group-hover:text-foreground/80",
                    "group-data-[state=active]:text-primary group-data-[state=active]:font-medium",
                    "transition-all duration-200"
                  )}
                >
                  {category.name}
                </span>

                {/* Subtle active indicator */}
                <div
                  className={cn(
                    "bg-primary absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
                    "opacity-0 transition-opacity duration-200 data-[state=active]:opacity-100"
                  )}
                />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile - Subtle Scrollable Layout */}
      <div className="relative sm:hidden">
        {/* Subtle shadow indicators */}
        <div
          className={cn(
            "from-background via-background/90 pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-6 rounded-l-xl bg-gradient-to-r to-transparent transition-opacity duration-200",
            showLeftShadow ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          className={cn(
            "from-background via-background/90 pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-6 rounded-r-xl bg-gradient-to-l to-transparent transition-opacity duration-200",
            showRightShadow ? "opacity-100" : "opacity-0"
          )}
        />

        <Tabs
          value={selectedCategory}
          onValueChange={(value) =>
            onCategoryChange(value as RegretCategory | "all")
          }
          className="w-full"
        >
          <div
            ref={scrollContainerRef}
            className="scrollbar-hide overflow-x-auto pb-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <TabsList className="bg-background/50 border-border/30 flex h-auto w-max min-w-full gap-2 rounded-xl border p-2 shadow-sm backdrop-blur-sm">
              {allCategories.map((category, index) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className={cn(
                    "flex max-w-[80px] min-w-[70px] flex-col items-center space-y-1.5 p-2.5",
                    // Subtle mobile active state
                    "data-[state=active]:bg-primary/8 data-[state=active]:text-primary",
                    "data-[state=active]:border-primary/20 data-[state=active]:border",
                    // Mobile hover effects
                    "hover:bg-muted/40 hover:text-foreground/80",
                    "transition-all duration-200 ease-out",
                    "group relative flex-shrink-0 rounded-lg",
                    // Enhanced margins for shadows
                    index === 0 && "ml-1",
                    index === allCategories.length - 1 && "mr-1"
                  )}
                  title={category.description}
                >
                  <span
                    className={cn(
                      "relative z-10 text-base transition-all duration-200",
                      "group-hover:scale-105 group-data-[state=active]:scale-105",
                      "opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100"
                    )}
                  >
                    {(() => {
                      const IconComponent = getIconComponent(category.icon);
                      return <IconComponent className="h-4 w-4" />;
                    })()}
                  </span>
                  <span
                    className={cn(
                      "relative z-10 px-1 text-center text-xs leading-tight font-medium",
                      "text-muted-foreground group-hover:text-foreground/80",
                      "group-data-[state=active]:text-primary group-data-[state=active]:font-medium",
                      "w-full truncate transition-all duration-200"
                    )}
                  >
                    {category.name}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {/* Subtle scroll hint */}
        <div
          className={cn(
            "text-muted-foreground/50 mt-2 flex items-center justify-center text-xs transition-opacity duration-300",
            !showRightShadow && allCategories.length > 4
              ? "opacity-100"
              : "opacity-0"
          )}
        >
          <span className="bg-muted/20 rounded-md px-2 py-1 backdrop-blur-sm">
            ← Swipe for more
          </span>
        </div>
      </div>
    </div>
  );
}
