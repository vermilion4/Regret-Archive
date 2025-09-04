"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { Query } from "appwrite";
import { safeJsonParse } from "@/lib/utils";

interface InsightsData {
  totalRegrets: number;
  totalComments: number;
  totalReactions: number;
  categoryBreakdown: Record<string, number>;
  ageBreakdown: Record<string, number>;
  recentActivity: number;
  avgReactionsPerRegret: number;
}

export default function InsightsClient() {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);

      // Fetch regrets
      const regretsResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        [Query.limit(1000)]
      );

      const regrets = regretsResponse.documents;

      // Fetch comments
      const commentsResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COMMENTS,
        [Query.limit(1000)]
      );

      const comments = commentsResponse.documents;

      // Calculate insights
      const totalRegrets = regrets.length;
      const totalComments = comments.length;

      let totalReactions = 0;
      const categoryBreakdown: Record<string, number> = {};
      const ageBreakdown: Record<string, number> = {};

      regrets.forEach((regret: any) => {
        // Reactions - Parse the JSON string safely
        const reactions = safeJsonParse(regret.reactions, {
          me_too: 0,
          hugs: 0,
          wisdom: 0,
        });
        totalReactions +=
          (reactions.me_too || 0) +
          (reactions.hugs || 0) +
          (reactions.wisdom || 0);

        // Categories
        const category = regret.category;
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;

        // Age groups
        if (regret.age_when_happened) {
          const age = regret.age_when_happened;
          let ageGroup = "";
          if (age < 20) ageGroup = "Under 20";
          else if (age < 30) ageGroup = "20-29";
          else if (age < 40) ageGroup = "30-39";
          else if (age < 50) ageGroup = "40-49";
          else if (age < 60) ageGroup = "50-59";
          else ageGroup = "60+";

          ageBreakdown[ageGroup] = (ageBreakdown[ageGroup] || 0) + 1;
        }
      });

      // Recent activity (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentActivity = regrets.filter(
        (regret: any) => new Date(regret.created_at) > weekAgo
      ).length;

      const avgReactionsPerRegret =
        totalRegrets > 0 ? Math.round(totalReactions / totalRegrets) : 0;

      setInsights({
        totalRegrets,
        totalComments,
        totalReactions,
        categoryBreakdown,
        ageBreakdown,
        recentActivity,
        avgReactionsPerRegret,
      });
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="bg-muted h-8 w-1/3 rounded"></div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-muted h-32 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="mb-4 text-2xl font-bold">No Data Available</h1>
          <p className="text-muted-foreground">
            Insights will be available once regrets are shared.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bungee mb-4 text-3xl font-bold md:text-4xl">
            Community Insights
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover patterns and wisdom from our collective experiences.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Regrets
              </CardTitle>
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.totalRegrets}</div>
              <p className="text-muted-foreground text-xs">Stories shared</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Comments
              </CardTitle>
              <MessageCircle className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.totalComments}</div>
              <p className="text-muted-foreground text-xs">
                Supportive responses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reactions
              </CardTitle>
              <Heart className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {insights.totalReactions}
              </div>
              <p className="text-muted-foreground text-xs">
                Community engagement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Activity
              </CardTitle>
              <Activity className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {insights.recentActivity}
              </div>
              <p className="text-muted-foreground text-xs">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Insights */}
        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Regrets by Category</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {CATEGORIES.map((category) => {
                    const count = insights.categoryBreakdown[category.id] || 0;
                    const percentage =
                      insights.totalRegrets > 0
                        ? Math.round((count / insights.totalRegrets) * 100)
                        : 0;

                    return (
                      <div
                        key={category.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <h4 className="font-medium">{category.name}</h4>
                            <p className="text-muted-foreground text-sm">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{count}</div>
                          <div className="text-muted-foreground text-sm">
                            {percentage}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Age When Regrets Happened</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(insights.ageBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([ageGroup, count]) => {
                      const percentage =
                        insights.totalRegrets > 0
                          ? Math.round((count / insights.totalRegrets) * 100)
                          : 0;

                      return (
                        <div
                          key={ageGroup}
                          className="flex items-center justify-between"
                        >
                          <span className="font-medium">{ageGroup}</span>
                          <div className="flex items-center space-x-4">
                            <div className="bg-muted h-2 w-32 rounded-full">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-muted-foreground w-16 text-right text-sm">
                              {count} ({percentage}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Engagement Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Avg Reactions per Regret</span>
                    <span className="font-bold">
                      {insights.avgReactionsPerRegret}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Comments per Regret</span>
                    <span className="font-bold">
                      {insights.totalRegrets > 0
                        ? Math.round(
                            (insights.totalComments / insights.totalRegrets) *
                              10
                          ) / 10
                        : 0}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-primary mb-2 text-3xl font-bold">
                      {insights.recentActivity}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      New regrets shared in the last 7 days
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Community Wisdom */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Community Wisdom</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
              <div>
                <div className="mb-2 text-2xl">🤗</div>
                <h4 className="mb-2 font-semibold">Supportive Community</h4>
                <p className="text-muted-foreground text-sm">
                  Every regret shared receives an average of{" "}
                  {insights.avgReactionsPerRegret} reactions
                </p>
              </div>
              <div>
                <div className="mb-2 text-2xl">💡</div>
                <h4 className="mb-2 font-semibold">Collective Learning</h4>
                <p className="text-muted-foreground text-sm">
                  {insights.totalComments} comments of support and advice shared
                </p>
              </div>
              <div>
                <div className="mb-2 text-2xl">📈</div>
                <h4 className="mb-2 font-semibold">Growing Together</h4>
                <p className="text-muted-foreground text-sm">
                  {insights.recentActivity} new stories added this week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
