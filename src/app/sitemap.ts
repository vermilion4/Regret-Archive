import { MetadataRoute } from "next";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { Query } from "appwrite";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://regret-archive.appwrite.network";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ];

  try {
    // Fetch all regrets for dynamic pages
    const regretsResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.REGRETS,
      [Query.limit(1000)] // Adjust based on your needs
    );

    const regretPages = regretsResponse.documents.map((regret: any) => ({
      url: `${baseUrl}/regret/${regret.$id}`,
      lastModified: new Date(regret.$createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

    return [...staticPages, ...regretPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static pages only if there's an error
    return staticPages;
  }
}
