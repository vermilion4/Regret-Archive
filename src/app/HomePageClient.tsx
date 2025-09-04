"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { RegretCard } from "@/components/RegretCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import {
  Heart,
  MessageCircle,
  Lightbulb,
  TrendingUp,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  ArrowUp,
  FileText,
} from "lucide-react";
import { Regret, RegretCategory } from "@/lib/types";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { Query } from "appwrite";
import { useAuth } from "@/lib/auth";
import { LoginModal } from "@/components/LoginModal";
import { cn, safeJsonParse } from "@/lib/utils";
import { RegretOfTheDay } from "@/components/RegretOfTheDay";
import Link from "next/link";

interface HomePageData {
  featuredRegrets: Regret[];
  stats: {
    totalStories: number;
    totalReactions: number;
    totalComments: number;
  };
}

interface HomePageClientProps {
  initialData: HomePageData;
}

export default function HomePageClient({ initialData }: HomePageClientProps) {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  
  // Initialize category from URL parameter if present
  const initialCategory = (searchParams.get("category") as RegretCategory | "all") || "all";
  const hasUrlCategory = !!searchParams.get("category");
  
  const [regrets, setRegrets] = useState<Regret[]>(
    hasUrlCategory ? [] : initialData.featuredRegrets
  );
  const [featuredRegret, setFeaturedRegret] = useState<Regret | null>(
    hasUrlCategory ? null : (initialData.featuredRegrets.length > 0 ? initialData.featuredRegrets[0] : null)
  );
  const [selectedCategory, setSelectedCategory] = useState<
    RegretCategory | "all"
  >(initialCategory);
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [heroInView, setHeroInView] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 6;

  // Refs to avoid stale closures
  const selectedCategoryRef = useRef(selectedCategory);
  const sortByRef = useRef(sortBy);
  const currentPageRef = useRef(currentPage);

  // Update refs when state changes
  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);

  useEffect(() => {
    sortByRef.current = sortBy;
  }, [sortBy]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);


  const fetchRegrets = useCallback(async () => {
    if (!user) return; // Don't fetch if no user

    try {
      setLoading(true);

      // Build queries for pagination using refs to avoid stale closures
      const queries = [];

      if (selectedCategoryRef.current !== "all") {
        queries.push(Query.equal("category", selectedCategoryRef.current));
      }

      if (sortByRef.current === "recent") {
        queries.push(Query.orderDesc("$createdAt"));
      } else {
        queries.push(Query.orderDesc("comment_count"));
      }

      // Add pagination
      const offset = (currentPageRef.current - 1) * itemsPerPage;
      queries.push(Query.offset(offset));
      queries.push(Query.limit(itemsPerPage));

      // Single API call with limit
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.REGRETS, queries);

      const regretsData = response.documents as unknown as Regret[];
      const totalCount = response.total;

      // Update pagination state
      setTotalItems(totalCount);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));

      const processedRegrets = regretsData.map((regret) => {
        // Ensure reactions is valid JSON
        let reactions = regret.reactions;
        if (!reactions) {
          reactions = JSON.stringify({ hugs: 0, me_too: 0, wisdom: 0 });
        } else {
          // Try to parse and re-stringify to ensure it's valid JSON
          try {
            const parsed = safeJsonParse(reactions, {
              hugs: 0,
              me_too: 0,
              wisdom: 0,
            });
            reactions = JSON.stringify(parsed);
          } catch (error) {
            console.warn(
              "Invalid reactions JSON for regret:",
              regret.$id,
              reactions
            );
            reactions = JSON.stringify({ hugs: 0, me_too: 0, wisdom: 0 });
          }
        }

        return {
          ...regret,
          reactions,
          comment_count: regret.comment_count || 0,
        };
      });

      setRegrets(processedRegrets);

      // Set featured regret from first page only
      if (currentPage === 1 && processedRegrets.length > 0) {
        setFeaturedRegret(processedRegrets[0]);
      }
    } catch (error) {
      console.error("Error fetching regrets:", error);
    } finally {
      setLoading(false);
    }
  }, [user, itemsPerPage]);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of stories section when changing pages
    const storiesSection = document.getElementById("stories");
    if (storiesSection) {
      storiesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy]);

  // Handle URL parameter changes (e.g., when navigating from categories page)
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const newCategory = (categoryParam as RegretCategory | "all") || "all";
  
    // Skip reacting if this came from an internal tab switch
    if (isInternalUpdate) {
      setIsInternalUpdate(false);
      return;
    }
  
    // Only update if URL truly changed
    if (newCategory !== selectedCategory) {
      setRegrets([]);
      setLoading(true);
      setSelectedCategory(newCategory);
      setCurrentPage(1);
    }
  }, [searchParams]);
  

  // Single effect to handle data fetching
  useEffect(() => {
    if (!authLoading && user) {
      fetchRegrets();
    }
  }, [authLoading, user, selectedCategory, sortBy, currentPage]);

  // Scroll effect for hero and back to top
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setHeroInView(scrollY < 100);
      setShowBackToTop(scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // No need for client-side filtering since we're doing it in the database query

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen relative z-10">
        {/* Hero Section for Non-Authenticated Users */}
        <div className="relative overflow-hidden z-10">
          {/* Background Elements */}
          <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-br via-transparent" />
          <div className="bg-primary/10 absolute top-0 left-1/4 h-72 w-72 animate-pulse rounded-full opacity-60 blur-3xl" />
          <div className="bg-secondary/10 absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full opacity-40 blur-3xl [animation-delay:2s]" />

          <div className="relative container mx-auto px-4 pt-16 pb-16 md:pt-24 md:pb-24 z-20">
            {/* Main Hero Content */}
            <div className="mb-16 text-center relative z-20">
              <div className="relative mb-6 inline-block">
                <h1 className="font-bungee text-6xl leading-tight font-bold md:text-8xl">
                  Regret Archive
                </h1>
                <div className="absolute -top-4 -right-4 opacity-60">
                  <Sparkles className="text-primary h-8 w-8 animate-pulse" />
                </div>
              </div>

              <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl leading-relaxed md:text-2xl">
                A safe, anonymous space to share regrets and life lessons.
                <br />
                <span className="text-foreground/80 font-medium">
                  Connect with others who understand your experiences.
                </span>
              </p>

              {/* CTA Buttons */}
              <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <div className="text-center">
                  <Button
                    size="lg"
                    className="group bg-primary hover:bg-primary/90 text-primary-foreground relative overflow-hidden rounded-full px-8 py-3"
                  >
                    <span className="relative z-10 flex items-center">
                      Share Your Regret
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="from-primary to-primary/80 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" />
                  </Button>
                </div>
                <LoginModal 
                  trigger={
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover:bg-muted/50 rounded-full border-2 px-8 py-3"
                    >
                      Browse Stories
                    </Button>
                  }
                />
              </div>

              {/* Stats Preview */}
              <div className="mx-auto grid max-w-md grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-foreground mb-1 text-2xl font-bold md:text-3xl">
                    {initialData.stats.totalStories}+
                  </div>
                  <div className="text-muted-foreground text-sm">Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-foreground mb-1 text-2xl font-bold md:text-3xl">
                    {initialData.stats.totalReactions}+
                  </div>
                  <div className="text-muted-foreground text-sm">Reactions</div>
                </div>
                <div className="text-center">
                  <div className="text-foreground mb-1 text-2xl font-bold md:text-3xl">
                    {initialData.stats.totalComments}+
                  </div>
                  <div className="text-muted-foreground text-sm">Comments</div>
                </div>
              </div>
            </div>

            {/* Features Showcase */}
            <div className="mb-16 grid gap-8 md:grid-cols-3">
              <Card className="group border-border/50 hover:border-primary/30 border-2 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 group-hover:bg-primary/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
                    <Heart className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Safe & Anonymous
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Share your deepest regrets without revealing your identity.
                    Your privacy is our priority.
                  </p>
                </CardContent>
              </Card>

              <Card className="group border-border/50 hover:border-primary/30 border-2 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 group-hover:bg-primary/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
                    <Users className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Community Support
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Connect with others who understand. Find comfort in shared
                    experiences and wisdom.
                  </p>
                </CardContent>
              </Card>

              <Card className="group border-border/50 hover:border-primary/30 border-2 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 group-hover:bg-primary/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
                    <Lightbulb className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Learn & Grow</h3>
                  <p className="text-muted-foreground text-sm">
                    Turn regrets into lessons. Help others avoid similar
                    mistakes and grow together.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sample Regret Preview */}
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 text-center">
                <h2 className="font-bungee mb-2 text-2xl font-bold md:text-3xl">
                  Featured Story
                </h2>
                <p className="text-muted-foreground">
                  See what others are sharing
                </p>
              </div>

              {initialData.featuredRegrets.length > 0 ? (
                <Card className="border-primary/20 border-2 shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {initialData.featuredRegrets[0].category}
                      </Badge>
                      <div className="text-muted-foreground text-xs">
                        {new Date(
                          initialData.featuredRegrets[0].$createdAt
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-foreground mb-4 leading-relaxed">
                      "{initialData.featuredRegrets[0].title}"
                    </p>
                    <div className="text-muted-foreground flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Heart className="mr-1 h-4 w-4" />
                          {(() => {
                            try {
                              const reactions = JSON.parse(
                                initialData.featuredRegrets[0].reactions || "{}"
                              );
                              return (
                                (reactions.hugs || 0) +
                                (reactions.me_too || 0) +
                                (reactions.wisdom || 0)
                              );
                            } catch {
                              return 0;
                            }
                          })()}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="mr-1 h-4 w-4" />
                          {initialData.featuredRegrets[0].comment_count || 0}
                        </span>
                      </div>
                      <span className="text-primary font-medium">
                        Anonymous
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-primary/20 border-2 shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        Career
                      </Badge>
                      <div className="text-muted-foreground text-xs">
                        2 days ago
                      </div>
                    </div>
                    <p className="text-foreground mb-4 leading-relaxed">
                      "I wish I had pursued my passion for art instead of
                      following the 'safe' career path. Now I'm stuck in a job I
                      don't love, wondering what could have been. To anyone
                      reading this: don't let fear of failure stop you from
                      chasing your dreams."
                    </p>
                    <div className="text-muted-foreground flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Heart className="mr-1 h-4 w-4" />
                          24
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="mr-1 h-4 w-4" />8
                        </span>
                      </div>
                      <span className="text-primary font-medium">
                        Anonymous
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-muted/30 py-16 relative z-10">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="font-bungee mb-4 text-3xl font-bold md:text-4xl">
              Ready to Share Your Story?
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
              Join our community and help others learn from your experiences.
              Your story could be the one that changes someone's life.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3"
                asChild
              >
                <Link href="/submit">Get Started Now</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-2 px-8 py-3"
                asChild
              >
                <Link href="/categories">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Section */}
      <div
        className={cn(
          "relative overflow-hidden transition-all duration-700 ease-out z-10",
          heroInView ? "pb-16 md:pb-24" : "pb-8"
        )}
      >
        {/* Background Elements */}
        <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-br via-transparent" />
        <div className="bg-primary/10 absolute top-0 left-1/4 h-72 w-72 animate-pulse rounded-full opacity-60 blur-3xl" />
        <div className="bg-secondary/10 absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full opacity-40 blur-3xl [animation-delay:2s]" />

        <div className="relative container mx-auto px-4 pt-16 md:pt-24 z-20">
          {/* Main Title */}
          <div
            className={cn(
              "mb-16 text-center transition-all duration-700 relative z-20",
              heroInView
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-80"
            )}
          >
            <div className="relative mb-6 inline-block">
              <h1 className="font-bungee text-6xl leading-tight font-bold md:text-8xl">
                Regret Archive
              </h1>
              <div className="absolute -top-4 -right-4 opacity-60">
                <Sparkles className="text-primary h-8 w-8 animate-pulse" />
              </div>
            </div>

            <p className="text-muted-foreground mx-auto mb-6 max-w-3xl text-lg leading-relaxed md:text-xl">
              A safe, anonymous space to share regrets and life lessons.
              <br />
              <span className="text-foreground/80 font-medium">
                Connect with others who understand your experiences.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group bg-primary hover:bg-primary/90 text-primary-foreground relative overflow-hidden rounded-full px-8 py-3"
                asChild
              >
                <a href="/submit">
                  <span className="relative z-10 flex items-center">
                    Share Your Regret
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="from-primary to-primary/80 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="hover:bg-muted/50 rounded-full border-2 px-8 py-3"
                asChild
              >
                <a href="#stories">Browse Stories</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="mx-auto grid max-w-md grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-foreground mb-1 text-2xl font-bold md:text-3xl">
                  {totalItems || regrets.length}
                </div>
                <div className="text-muted-foreground text-sm">Stories</div>
              </div>
              <div className="text-center">
                <div className="text-foreground mb-1 text-2xl font-bold md:text-3xl">
                  {(() => {
                    const totalReactions = regrets.reduce((acc, regret) => {
                      const reactions = safeJsonParse(regret.reactions, {
                        hugs: 0,
                        me_too: 0,
                        wisdom: 0,
                      });
                      return (
                        acc +
                        Number(reactions.hugs || 0) +
                        Number(reactions.me_too || 0) +
                        Number(reactions.wisdom || 0)
                      );
                    }, 0);
                    return totalReactions;
                  })()}
                </div>
                <div className="text-muted-foreground text-sm">Reactions</div>
              </div>
              <div className="text-center">
                <div className="text-foreground mb-1 text-2xl font-bold md:text-3xl">
                  {regrets.reduce(
                    (acc, regret) => acc + regret.comment_count,
                    0
                  )}
                </div>
                <div className="text-muted-foreground text-sm">Comments</div>
              </div>
            </div>
          </div>

          {/* Featured Regret - Redesigned */}
          {featuredRegret && (
            <RegretOfTheDay
              featuredRegret={featuredRegret}
              onUpdate={fetchRegrets}
            />
          )}
        </div>
      </div>

      {/* Filters and Content - Improved Spacing */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Filters with Better Spacing */}
        <div id="stories" className="mb-12 space-y-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={(category) => {
              // Clear regrets immediately to prevent showing wrong data during transition
              setRegrets([]);
              setLoading(true);
              setSelectedCategory(category);
            }}
            onInternalUpdate={() => setIsInternalUpdate(true)}
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

            <div className="text-muted-foreground bg-muted/30 rounded-full px-4 py-2 text-sm">
              {totalItems || regrets.length} stories
            </div>
          </div>
        </div>

        {/* Regrets Grid */}
        {loading ? (
          <div className="mb-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="space-y-4 p-6">
                  <div className="bg-muted h-8 w-3/4 rounded"></div>
                  <div className="space-y-2">
                    <div className="bg-muted h-8 rounded"></div>
                    <div className="bg-muted h-8 w-5/6 rounded"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
              {regrets.map((regret) => (
                <RegretCard
                  key={regret.$id}
                  regret={regret}
                  onUpdate={fetchRegrets}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mb-16">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  className="justify-center"
                />
              </div>
            )}
          </>
        )}

        {!loading && regrets.length === 0 && (
          <div className="py-20 text-center">
            <div className="mb-8 opacity-60">
              <FileText className="text-muted-foreground mx-auto h-16 w-16" />
            </div>
            <h3 className="mb-4 text-2xl font-semibold">No stories found</h3>
            <p className="text-muted-foreground mx-auto mb-8 max-w-md text-lg">
              {selectedCategory === "all"
                ? "Be the first to share a regret and help others learn from your experience."
                : `No regrets found in the ${selectedCategory} category yet.`}
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
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed right-8 bottom-8 z-50 h-12 w-12 rounded-full p-0 shadow-lg transition-all duration-200 hover:shadow-xl"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
