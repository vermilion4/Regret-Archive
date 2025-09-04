'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Clock, TrendingUp } from 'lucide-react';
import { Regret, RegretCategory } from '@/lib/types';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { RegretCard } from '@/components/RegretCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import Link from 'next/link';

export default function SearchClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RegretCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [results, setResults] = useState<Regret[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setHasSearched(true);

      const queries = [];
      
      // Add category filter
      if (selectedCategory !== 'all') {
        queries.push(Query.equal('category', selectedCategory));
      }
      
      // Add sorting
      if (sortBy === 'recent') {
        queries.push(Query.orderDesc('$createdAt'));
      } else {
        queries.push(Query.orderDesc('comment_count'));
      }
      
      // Limit results - we'll fetch more and filter client-side
      queries.push(Query.limit(200));

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        queries
      );

      const regretsData = response.documents as unknown as Regret[];
      
      // Client-side search filtering
      const searchTerm = searchQuery.toLowerCase();
      const filteredRegrets = regretsData.filter(regret => {
        const title = (regret.title || '').toLowerCase();
        const story = (regret.story || '').toLowerCase();
        const lesson = (regret.lesson || '').toLowerCase();
        const category = (regret.category || '').toLowerCase();
        
        return title.includes(searchTerm) || 
               story.includes(searchTerm) || 
               lesson.includes(searchTerm) ||
               category.includes(searchTerm);
      });
      
      const processedRegrets = filteredRegrets.map(regret => ({
        ...regret,
        reactions: regret.reactions || JSON.stringify({
          hugs: 0,
          me_too: 0,
          wisdom: 0
        }),
        comment_count: regret.comment_count || 0
      }));
      
      setResults(processedRegrets);
    } catch (error) {
      console.error('Error searching regrets:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (hasSearched) {
      handleSearch();
    }
  }, [selectedCategory, sortBy]);

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
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bungee">Search Regrets</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Find regrets and life lessons by searching through titles, stories, and lessons learned.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for regrets, lessons, or experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={!searchQuery.trim() || loading}
                className="h-12 px-8"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="mb-8 space-y-6">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant={sortBy === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('recent')}
                className="rounded-full px-6"
              >
                <Clock className="h-4 w-4 mr-2" />
                Recent
              </Button>
              <Button
                variant={sortBy === 'popular' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('popular')}
                className="rounded-full px-6"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Popular
              </Button>
            </div>
            
            {hasSearched && (
              <div className="text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
                {results.length} results for "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        {!hasSearched ? (
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Start Your Search</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Enter keywords to find regrets and life lessons that resonate with you.
            </p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((regret) => (
              <RegretCard key={regret.$id} regret={regret} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-8 opacity-60">🔍</div>
            <h3 className="text-2xl font-semibold mb-4">No results found</h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Try different keywords or browse all regrets to discover stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/#stories">Browse All Regrets</Link>
              </Button>
              <Button asChild>
                <Link href="/submit">Share Your Story</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
