import type { Metadata } from "next";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search Regrets - Find Stories & Life Lessons",
  description:
    "Search through our collection of anonymous regrets and life lessons. Find stories that resonate with your experiences and discover wisdom from others.",
  keywords: [
    "search regrets",
    "find life lessons",
    "regret stories",
    "life experience search",
    "wisdom search",
    "personal story search",
    "regret database",
    "life lesson finder",
  ],
  openGraph: {
    title: "Search Regrets - Find Stories & Life Lessons",
    description:
      "Search through our collection of anonymous regrets and life lessons. Find stories that resonate with your experiences.",
    type: "website",
  },
  twitter: {
    title: "Search Regrets - Find Stories & Life Lessons",
    description:
      "Search through our collection of anonymous regrets and life lessons. Find stories that resonate with your experiences.",
  },
};

export default function SearchPage() {
  return <SearchClient />;
}
