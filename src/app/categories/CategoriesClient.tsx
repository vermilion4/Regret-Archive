'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CATEGORIES, RegretCategory, Regret } from '@/lib/types';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'appwrite';
import Link from 'next/link';
import { getIconComponent } from '@/lib/utils';
interface CategoryStats {
  id: RegretCategory;
  count: number;
  recentCount: number;
  popularCount: number;
}

export default function CategoriesClient() {
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategoryStats = async () => {
    try {
      setLoading(true);
      
      // OPTIMIZATION: Instead of making 21 API calls (3 per category), 
      // we fetch all regrets once and calculate stats locally
      const allRegretsResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        [Query.limit(1000)] // Get up to 1000 regrets
      );

      const regrets = allRegretsResponse.documents as unknown as Regret[];
      
      // Calculate all category stats locally from the single dataset
      const stats: CategoryStats[] = CATEGORIES.map(category => {
        const categoryRegrets = regrets.filter(regret => regret.category === category.id);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const totalCount = categoryRegrets.length;
        const recentCount = categoryRegrets.filter(regret => 
          new Date(regret.$createdAt) > weekAgo
        ).length;
        const popularCount = categoryRegrets.filter(regret => 
          regret.comment_count > 5
        ).length;

        return {
          id: category.id,
          count: totalCount,
          recentCount,
          popularCount
        };
      });

      setCategoryStats(stats);
    } catch (error) {
      console.error('Error fetching category stats:', error);
      // Set default stats if there's an error
      setCategoryStats(CATEGORIES.map(category => ({
        id: category.id,
        count: 0,
        recentCount: 0,
        popularCount: 0
      })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bungee">Categories</h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Explore regrets by category. Each category represents different aspects of life where we often experience regret and growth.
              </p>
            </div>
            
            {!loading && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setLoading(true);
                  fetchCategoryStats();
                }}
                disabled={loading}
              >
                Refresh Stats
              </Button>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(7)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => {
              const stats = categoryStats.find(s => s.id === category.id);
              return (
                <Card key={category.id} className="group hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">
                          {(() => {
                            const IconComponent = getIconComponent(category.icon);
                            return <IconComponent className="h-8 w-8" />;
                          })()}
                        </span>
                        <div>
                          <h3 className="text-xl font-semibold">{category.name}</h3>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {stats?.count || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {stats?.recentCount || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">This Week</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {stats?.popularCount || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Popular</div>
                      </div>
                    </div>
                    
                    <Button className="w-full" asChild>
                      <Link href={`/?category=${category.id}#stories`}>
                        Browse {category.name}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 font-bungee">Ready to Share Your Story?</h2>
              <p className="text-muted-foreground mb-6">
                Your experience could help someone else avoid the same regret. Share anonymously and make a difference.
              </p>
              <Button size="lg" asChild>
                <Link href="/submit">Share Your Regret</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
