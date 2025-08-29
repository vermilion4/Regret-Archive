'use client';

import { useState, useEffect } from 'react';
import { RegretCard } from '@/components/RegretCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Lightbulb, TrendingUp, Clock, Users } from 'lucide-react';
import { Regret, RegretCategory } from '@/lib/types';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { useAuth } from '@/lib/auth';
import { LoginModal } from '@/components/LoginModal';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [regrets, setRegrets] = useState<Regret[]>([]);
  const [featuredRegret, setFeaturedRegret] = useState<Regret | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<RegretCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  useEffect(() => {
    if (!authLoading && user) {
      fetchRegrets();
    }
  }, [selectedCategory, sortBy, user, authLoading]);

  const fetchRegrets = async () => {
    try {
      setLoading(true);
      
      // Build queries
      const queries = [];
      
      if (selectedCategory !== 'all') {
        queries.push(Query.equal('category', selectedCategory));
      }
      
      if (sortBy === 'recent') {
        queries.push(Query.orderDesc('$createdAt')); // Fixed: use $createdAt instead of created_at
      } else {
        queries.push(Query.orderDesc('comment_count'));
      }
      
      // Limit to 20 regrets
      queries.push(Query.limit(20));

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        queries
      );

      const regretsData = response.documents as unknown as Regret[];
      
      // Ensure reactions object is properly initialized for each regret
      const processedRegrets = regretsData.map(regret => ({
        ...regret,
        reactions: regret.reactions || {
          hugs: 0,
          me_too: 0,
          wisdom: 0
        },
        comment_count: regret.comment_count || 0
      }));
      
      setRegrets(processedRegrets);

      // Set featured regret (first one for now)
      if (processedRegrets.length > 0) {
        setFeaturedRegret(processedRegrets[0]);
      }
    } catch (error) {
      console.error('Error fetching regrets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRegrets = selectedCategory === 'all' 
    ? regrets 
    : regrets.filter(regret => regret.category === selectedCategory);

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Regret Archive
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A safe, anonymous space to share regrets and life lessons. 
            Connect with others who understand your experiences.
          </p>
          <div className="flex justify-center">
            <LoginModal />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Regret Archive
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A safe, anonymous space to share regrets and life lessons. 
            Connect with others who understand your experiences.
          </p>
        </div>

        {/* Featured Regret */}
        {featuredRegret && (
          <Card className="mb-8 bg-linear-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  Regret of the Day
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {((featuredRegret.reactions?.hugs || 0) + (featuredRegret.reactions?.me_too || 0) + (featuredRegret.reactions?.wisdom || 0))} reactions
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <RegretCard regret={featuredRegret} variant="featured" />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filters and Controls */}
      <div className="mb-8 space-y-4">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={sortBy === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('recent')}
            >
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </Button>
            <Button
              variant={sortBy === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('popular')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Popular
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {filteredRegrets.length} regrets found
          </div>
        </div>
      </div>

      {/* Regrets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
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
          {filteredRegrets.map((regret) => (
            <RegretCard key={regret.$id} regret={regret} />
          ))}
        </div>
      )}

      {!loading && filteredRegrets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">No regrets found</h3>
          <p className="text-muted-foreground mb-4">
            {selectedCategory === 'all' 
              ? 'Be the first to share a regret and help others learn from your experience.'
              : `No regrets found in the ${selectedCategory} category yet.`
            }
          </p>
          <Button asChild>
            <a href="/submit">Share Your Regret</a>
          </Button>
        </div>
      )}
    </div>
  );
}
