import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found - 404 Error",
  description:
    "The page you are looking for could not be found. Return to the Regret Archive to explore stories and life lessons.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br px-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-primary/20 font-bungee mb-4 text-9xl font-bold">
            404
          </div>
          <div className="mb-4 text-6xl">😔</div>
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h1 className="font-bungee mb-4 text-3xl font-bold md:text-4xl">
              Oops! Page Not Found
            </h1>
            <p className="text-muted-foreground mb-6 text-lg">
              It looks like this page has gone missing, just like some of our
              regrets. Don't worry though - every ending is a new beginning!
            </p>

            <div className="bg-muted/30 mb-6 rounded-lg p-4">
              <p className="text-muted-foreground text-sm">
                <strong>Life Lesson:</strong> Sometimes we take wrong turns, but
                they often lead us to unexpected discoveries. This 404 page is
                proof that even mistakes can be beautiful! ✨
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Search Stories
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12">
          <p className="text-muted-foreground mb-4 text-sm">
            Looking for something specific? Try these popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
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
        <div className="from-primary/10 to-secondary/10 border-primary/20 my-12 rounded-lg border bg-gradient-to-r p-6">
          <blockquote className="text-muted-foreground text-lg italic">
            "The only real mistake is the one from which we learn nothing."
          </blockquote>
          <cite className="text-muted-foreground mt-2 block text-sm">
            — Henry Ford
          </cite>
        </div>
      </div>
    </div>
  );
}
