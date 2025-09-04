import { Suspense } from "react";
import { Metadata } from "next";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Regret } from "@/lib/types";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "Regret Archive - Share Your Regrets Anonymously",
  description:
    "A safe, anonymous platform for sharing regrets and life lessons. Connect with others who understand your experiences. Find support, wisdom, and community in shared stories of growth.",
  keywords: [
    "regrets",
    "life lessons",
    "anonymous sharing",
    "community support",
    "personal growth",
    "life experiences",
    "emotional support",
    "wisdom sharing",
    "regret stories",
    "life advice",
    "anonymous stories",
    "personal development",
  ],
  openGraph: {
    title: "Regret Archive - Share Your Regrets Anonymously",
    description:
      "A safe, anonymous platform for sharing regrets and life lessons. Connect with others who understand your experiences.",
    url: "https://regret-archive.appwrite.network",
    siteName: "Regret Archive",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Regret Archive - Share Your Regrets Anonymously",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Regret Archive - Share Your Regrets Anonymously",
    description:
      "A safe, anonymous platform for sharing regrets and life lessons. Connect with others who understand your experiences.",
    images: ["/og-image.png"],
    creator: "@adaezendupu",
  },
};

// Server-side data fetching for SEO and social media previews
async function getHomePageData() {
  try {
    // Fetch some public regrets for preview (limit to 3 for performance)
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.REGRETS,
      [Query.orderDesc("$createdAt"), Query.limit(3)]
    );

    const regrets = response.documents as unknown as Regret[];

    // Get category counts for stats
    const categoriesResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.REGRETS,
      [Query.limit(100)] // Get more for accurate stats
    );

    const allRegrets = categoriesResponse.documents as unknown as Regret[];
    const totalStories = allRegrets.length;

    // Calculate total reactions
    const totalReactions = allRegrets.reduce((acc, regret) => {
      let reactions = { hugs: 0, me_too: 0, wisdom: 0 };
      if (regret.reactions) {
        try {
          reactions = JSON.parse(regret.reactions);
        } catch (error) {
          // Use default if parsing fails
        }
      }
      return (
        acc +
        (reactions.hugs || 0) +
        (reactions.me_too || 0) +
        (reactions.wisdom || 0)
      );
    }, 0);

    // Calculate total comments
    const totalComments = allRegrets.reduce(
      (acc, regret) => acc + (regret.comment_count || 0),
      0
    );

    return {
      featuredRegrets: regrets,
      stats: {
        totalStories,
        totalReactions,
        totalComments,
      },
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    // Return fallback data
    return {
      featuredRegrets: [],
      stats: {
        totalStories: 100,
        totalReactions: 500,
        totalComments: 200,
      },
    };
  }
}

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
        </div>
      }
    >
      <HomePageClient initialData={data} />
    </Suspense>
  );
}
