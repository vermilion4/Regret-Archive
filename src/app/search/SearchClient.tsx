"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Clock, TrendingUp } from "lucide-react";
import { Regret, RegretCategory } from "@/lib/types";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { Query } from "appwrite";
import { RegretCard } from "@/components/RegretCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import Link from "next/link";

export default function SearchClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    RegretCategory | "all"
  >("all");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
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
      if (selectedCategory !== "all") {
        queries.push(Query.equal("category", selectedCategory));
      }

      // Add sorting
      if (sortBy === "recent") {
        queries.push(Query.orderDesc("$createdAt"));
      } else {
        queries.push(Query.orderDesc("comment_count"));
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
      const filteredRegrets = regretsData.filter((regret) => {
        const title = (regret.title || "").toLowerCase();
        const story = (regret.story || "").toLowerCase();
        const lesson = (regret.lesson || "").toLowerCase();
        const category = (regret.category || "").toLowerCase();

        return (
          title.includes(searchTerm) ||
          story.includes(searchTerm) ||
          lesson.includes(searchTerm) ||
          category.includes(searchTerm)
        );
      });

      const processedRegrets = filteredRegrets.map((regret) => ({
        ...regret,
        reactions:
          regret.reactions ||
          JSON.stringify({
            hugs: 0,
            me_too: 0,
            wisdom: 0,
          }),
        comment_count: regret.comment_count || 0,
      }));

      setResults(processedRegrets);
    } catch (error) {
      console.error("Error searching regrets:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleUpdate = () => {
    // Refresh the current search results
    if (hasSearched) {
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
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <h1 className="font-bungee mb-4 text-4xl font-bold md:text-5xl">
            Search Regrets
          </h1>
          <p className="text-muted-foreground max-w-3xl text-xl">
            Find regrets and life lessons by searching through titles, stories,
            and lessons learned.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  type="text"
                  placeholder="Search for regrets, lessons, or experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 pl-10 text-lg"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || loading}
                className="h-12 px-8"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
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
                variant={sortBy === "recent" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("recent")}
                className="rounded-full px-6"
              >
                <Clock className="mr-2 h-4 w-4" />
                Recent
              </Button>
              <Button
                variant={sortBy === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("popular")}
                className="rounded-full px-6"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Popular
              </Button>
            </div>

            {hasSearched && (
              <div className="text-muted-foreground bg-muted/30 rounded-full px-4 py-2 text-sm">
                {results.length} results for "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        {!hasSearched ? (
          <div className="py-20 text-center">
            <Search className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h3 className="mb-4 text-2xl font-semibold">Start Your Search</h3>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              Enter keywords to find regrets and life lessons that resonate with
              you.
            </p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="space-y-4 p-6">
                  <div className="bg-muted h-4 w-3/4 rounded"></div>
                  <div className="space-y-2">
                    <div className="bg-muted h-4 rounded"></div>
                    <div className="bg-muted h-4 w-5/6 rounded"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {results.map((regret) => (
              <RegretCard
                key={regret.$id}
                regret={regret}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="mb-8 opacity-60">
              <Search className="text-muted-foreground mx-auto h-16 w-16" />
            </div>
            <h3 className="mb-4 text-2xl font-semibold">No results found</h3>
            <p className="text-muted-foreground mx-auto mb-8 max-w-md text-lg">
              Try different keywords or browse all regrets to discover stories.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
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
