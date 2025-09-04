"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "bg-muted/50 text-muted-foreground inline-flex items-center justify-center rounded-lg p-1 backdrop-blur-sm",
      // Better responsive height handling
      "h-auto min-h-[2.5rem]",
      // Improved focus styles
      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base styles
      "inline-flex items-center justify-center text-sm font-medium whitespace-nowrap transition-all duration-200",
      // Sizing and spacing
      "rounded-md px-3 py-1.5",
      // Default state
      "text-muted-foreground hover:text-foreground",
      "hover:bg-muted/60 hover:shadow-sm",
      // Active state - enhanced
      "data-[state=active]:bg-background data-[state=active]:text-foreground",
      "data-[state=active]:border data-[state=active]:shadow-md",
      "data-[state=active]:border-border/20",
      // Focus styles
      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
      // Disabled state
      "disabled:pointer-events-none disabled:opacity-50",
      // Better interaction feedback
      "active:scale-[0.98] active:transition-transform active:duration-75",
      // Icon support
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      // Dark mode improvements
      "dark:hover:bg-muted/40 dark:data-[state=active]:bg-background/95",
      "dark:data-[state=active]:border-border/30",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      // Layout
      "flex-1 outline-none",
      // Animation support
      "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95",
      "data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:zoom-out-95",
      // Focus styles
      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
