import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found - 404 Error',
  description: 'The page you are looking for could not be found. Return to the Regret Archive to explore stories and life lessons.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary/20 mb-4 font-bungee">
            404
          </div>
          <div className="text-6xl mb-4">😔</div>
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-bungee">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              It looks like this page has gone missing, just like some of our regrets. 
              Don't worry though - every ending is a new beginning!
            </p>
            
            <div className="bg-muted/30 p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground">
                <strong>Life Lesson:</strong> Sometimes we take wrong turns, but they often lead us to unexpected discoveries. 
                This 404 page is proof that even mistakes can be beautiful! ✨
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link href="/search">
              <Search className="h-4 w-4 mr-2" />
              Search Stories
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            Looking for something specific? Try these popular pages:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/categories">Categories</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/submit">Share Your Story</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/insights">Community Insights</Link>
            </Button>
          </div>
        </div>

        {/* Fun Quote */}
        <div className="my-12 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
          <blockquote className="text-lg italic text-muted-foreground">
            "The only real mistake is the one from which we learn nothing."
          </blockquote>
          <cite className="text-sm text-muted-foreground mt-2 block">
            — Henry Ford
          </cite>
        </div>
      </div>
    </div>
  );
}
