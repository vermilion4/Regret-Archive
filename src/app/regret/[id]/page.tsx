import type { Metadata } from 'next';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Regret } from '@/lib/types';
import RegretDetailClient from './RegretDetailClient';

// Generate metadata for each regret page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const paramsData = await params;
  const { id } = paramsData;
  
  try {
    const regret = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.REGRETS,
      id
    ) as unknown as Regret;

    const title = `${regret.title} - Regret Story`;
    const description = regret.lesson 
      ? `Read this anonymous regret story: "${regret.title}". Lesson learned: ${regret.lesson.substring(0, 150)}...`
      : `Read this anonymous regret story: "${regret.title}". A personal story of growth and learning.`;

    return {
      title,
      description,
      keywords: [
        'regret story',
        'life lesson',
        'personal growth',
        regret.category,
        'anonymous story',
        'life experience',
        'wisdom sharing'
      ],
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: regret.$createdAt,
        section: regret.category,
        tags: [regret.category, 'regret', 'life lesson', 'personal growth'],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch (error) {
    return {
      title: 'Regret Not Found',
      description: 'The regret story you are looking for could not be found.',
    };
  }
}

export default async function RegretDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const paramsData = await params;
  const { id } = paramsData;
  return <RegretDetailClient regretId={id} />;
}
