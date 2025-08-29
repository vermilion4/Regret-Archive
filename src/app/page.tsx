"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { RegretCard } from '@/components/RegretCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Lightbulb, TrendingUp, Clock, Users, Sparkles, ArrowRight, ArrowUp } from 'lucide-react';
import { Regret, RegretCategory } from '@/lib/types';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { useAuth } from '@/lib/auth';
import { LoginModal } from '@/components/LoginModal';
import { cn, safeJsonParse } from '@/lib/utils';
import { RegretOfTheDay } from '@/components/RegretOfTheDay';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [regrets, setRegrets] = useState<Regret[]>([]);
  const [featuredRegret, setFeaturedRegret] = useState<Regret | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<RegretCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [heroInView, setHeroInView] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle URL category parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam as RegretCategory | 'all');
    }
  }, [searchParams, selectedCategory]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchRegrets();
    }
  }, [selectedCategory, sortBy, user, authLoading]);

  // Scroll effect for hero and back to top
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setHeroInView(scrollY < 100);
      setShowBackToTop(scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchRegrets = async () => {
    try {
      setLoading(true);
      
      // Build queries
      const queries = [];
      
      if (selectedCategory !== 'all') {
        queries.push(Query.equal('category', selectedCategory));
      }
      
      if (sortBy === 'recent') {
        queries.push(Query.orderDesc('$createdAt'));
      } else {
        queries.push(Query.orderDesc('comment_count'));
      }
      
      queries.push(Query.limit(20));

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        queries
      );

      const regretsData = response.documents as unknown as Regret[];
      
      const processedRegrets = regretsData.map(regret => {
        // Ensure reactions is valid JSON
        let reactions = regret.reactions;
        if (!reactions) {
          reactions = JSON.stringify({ hugs: 0, me_too: 0, wisdom: 0 });
        } else {
          // Try to parse and re-stringify to ensure it's valid JSON
          try {
            const parsed = safeJsonParse(reactions, { hugs: 0, me_too: 0, wisdom: 0 });
            reactions = JSON.stringify(parsed);
          } catch (error) {
            console.warn('Invalid reactions JSON for regret:', regret.$id, reactions);
            reactions = JSON.stringify({ hugs: 0, me_too: 0, wisdom: 0 });
          }
        }
        
        return {
          ...regret,
          reactions,
          comment_count: regret.comment_count || 0
        };
      });
      
      setRegrets(processedRegrets);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen">
        {/* Hero Section for Non-Authenticated Users */}
        <div className="relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-60 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-40 animate-pulse [animation-delay:2s]" />
          
          <div className="relative container mx-auto px-4 pt-16 md:pt-24 pb-16 md:pb-24">
            {/* Main Hero Content */}
            <div className="text-center mb-16">
              <div className="relative inline-block mb-6">
                <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-foreground via-foreground/95 to-foreground/90 bg-clip-text text-transparent leading-tight">
                  Regret Archive
                </h1>
                <div className="absolute -top-4 -right-4 opacity-60">
                  <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                </div>
              </div>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                A safe, anonymous space to share regrets and life lessons.<br />
                <span className="text-foreground/80 font-medium">Connect with others who understand your experiences.</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button size="lg" className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full" asChild>
                  <a href="/submit">
                    <span className="relative z-10 flex items-center">
                      Share Your Regret
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </Button>
                <LoginModal />
              </div>

              {/* Stats Preview */}
              <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                    100+
                  </div>
                  <div className="text-sm text-muted-foreground">Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                    500+
                  </div>
                  <div className="text-sm text-muted-foreground">Reactions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                    200+
                  </div>
                  <div className="text-sm text-muted-foreground">Comments</div>
                </div>
              </div>
            </div>

            {/* Features Showcase */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-border/50 hover:border-primary/30">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Safe & Anonymous</h3>
                  <p className="text-muted-foreground text-sm">
                    Share your deepest regrets without revealing your identity. Your privacy is our priority.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-border/50 hover:border-primary/30">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Community Support</h3>
                  <p className="text-muted-foreground text-sm">
                    Connect with others who understand. Find comfort in shared experiences and wisdom.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-border/50 hover:border-primary/30">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Learn & Grow</h3>
                  <p className="text-muted-foreground text-sm">
                    Turn regrets into lessons. Help others avoid similar mistakes and grow together.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sample Regret Preview */}
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Story</h2>
                <p className="text-muted-foreground">See what others are sharing</p>
              </div>
              
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="text-xs">Career</Badge>
                    <div className="text-xs text-muted-foreground">2 days ago</div>
                  </div>
                  <p className="text-foreground mb-4 leading-relaxed">
                    "I wish I had pursued my passion for art instead of following the 'safe' career path. 
                    Now I'm stuck in a job I don't love, wondering what could have been. 
                    To anyone reading this: don't let fear of failure stop you from chasing your dreams."
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        24
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        8
                      </span>
                    </div>
                    <span className="text-primary font-medium">Anonymous</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Share Your Story?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our community and help others learn from your experiences. 
              Your story could be the one that changes someone's life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full">
                Get Started Now
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 rounded-full border-2">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Modern Hero Section */}
      <div className={cn(
        "relative overflow-hidden transition-all duration-700 ease-out",
        heroInView ? "pb-16 md:pb-24" : "pb-8"
      )}>
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-60 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-40 animate-pulse [animation-delay:2s]" />
        
        <div className="relative container mx-auto px-4 pt-16 md:pt-24">
          {/* Main Title */}
          <div className={cn(
            "text-center mb-16 transition-all duration-700",
            heroInView ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-90"
          )}>
            <div className="relative inline-block mb-6">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-foreground via-foreground/95 to-foreground/90 bg-clip-text text-transparent leading-tight">
                Regret Archive
              </h1>
              <div className="absolute -top-4 -right-4 opacity-60">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              A safe, anonymous space to share regrets and life lessons.<br />
              <span className="text-foreground/80 font-medium">Connect with others who understand your experiences.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full" asChild>
                <a href="/submit">
                  <span className="relative z-10 flex items-center">
                    Share Your Regret
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 rounded-full border-2 hover:bg-muted/50" asChild>
                <a href="#stories">
                  Browse Stories
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {regrets.length}
                </div>
                <div className="text-sm text-muted-foreground">Stories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {(() => {
                    const totalReactions = regrets.reduce((acc, regret) => {
                      const reactions = safeJsonParse(regret.reactions, { hugs: 0, me_too: 0, wisdom: 0 });
                      console.log(reactions)
                      return acc + Number(reactions.hugs || 0) + Number(reactions.me_too || 0) + Number(reactions.wisdom || 0);
                    }, 0);
                    return totalReactions;
                  })()}
                </div>
                <div className="text-sm text-muted-foreground">Reactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {regrets.reduce((acc, regret) => acc + regret.comment_count, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </div>
            </div>
          </div>

          {/* Featured Regret - Redesigned */}
          {featuredRegret && (
            <RegretOfTheDay featuredRegret={featuredRegret} />
          )}
        </div>
      </div>

      {/* Filters and Content - Improved Spacing */}
      <div id="stories" className="container mx-auto px-4">
        {/* Filters with Better Spacing */}
        <div className="mb-12 space-y-8">
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
            
            <div className="text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
              {filteredRegrets.length} stories
            </div>
          </div>
        </div>

        {/* Regrets Grid */}
        {loading ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredRegrets.map((regret) => (
              <RegretCard key={regret.$id} regret={regret} />
            ))}
          </div>
        )}

        {!loading && filteredRegrets.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-8 opacity-60">📝</div>
            <h3 className="text-2xl font-semibold mb-4">No stories found</h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              {selectedCategory === 'all' 
                ? 'Be the first to share a regret and help others learn from your experience.'
                : `No regrets found in the ${selectedCategory} category yet.`
              }
            </p>
            <Button size="lg" className="rounded-full px-8" asChild>
              <a href="/submit">Share Your Story</a>
            </Button>
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}