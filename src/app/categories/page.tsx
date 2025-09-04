import type { Metadata } from "next";
import CategoriesClient from "./CategoriesClient";

export const metadata: Metadata = {
  title: "Categories - Explore Regrets by Life Areas",
  description:
    "Browse regrets and life lessons by category including career, relationships, health, education, and more. Find stories that resonate with your experiences.",
  keywords: [
    "regret categories",
    "life areas",
    "career regrets",
    "relationship regrets",
    "health regrets",
    "education regrets",
    "family regrets",
    "financial regrets",
    "personal growth categories",
  ],
  openGraph: {
    title: "Categories - Explore Regrets by Life Areas",
    description:
      "Browse regrets and life lessons by category including career, relationships, health, education, and more.",
    type: "website",
  },
  twitter: {
    title: "Categories - Explore Regrets by Life Areas",
    description:
      "Browse regrets and life lessons by category including career, relationships, health, education, and more.",
  },
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
