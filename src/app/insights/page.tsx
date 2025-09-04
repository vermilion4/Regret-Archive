import type { Metadata } from "next";
import InsightsClient from "./InsightsClient";

export const metadata: Metadata = {
  title: "Community Insights - Regret Statistics & Analytics",
  description:
    "Discover patterns and insights from our community of shared regrets. View statistics, demographics, and trends in personal growth and life lessons.",
  keywords: [
    "regret insights",
    "community statistics",
    "regret analytics",
    "life lesson patterns",
    "personal growth data",
    "regret demographics",
    "community trends",
    "wisdom statistics",
  ],
  openGraph: {
    title: "Community Insights - Regret Statistics & Analytics",
    description:
      "Discover patterns and insights from our community of shared regrets. View statistics, demographics, and trends in personal growth.",
    type: "website",
  },
  twitter: {
    title: "Community Insights - Regret Statistics & Analytics",
    description:
      "Discover patterns and insights from our community of shared regrets. View statistics, demographics, and trends in personal growth.",
  },
};

export default function InsightsPage() {
  return <InsightsClient />;
}
