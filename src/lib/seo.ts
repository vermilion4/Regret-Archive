import type { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

const baseUrl = 'https://regret-archive.appwrite.network';
const defaultImage = '/og-image.png';

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = defaultImage,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author = 'Anonymous',
    section,
    tags = []
  } = config;

  const fullTitle = title.includes('Regret Archive') ? title : `${title} | Regret Archive`;
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      'regret archive',
      'regrets',
      'life lessons',
      'anonymous sharing',
      'personal growth',
      'community support',
      ...keywords
    ],
    authors: [{ name: author }],
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: 'Regret Archive',
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: '@regretarchive',
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

export function generateStructuredData(type: 'article' | 'breadcrumb' | 'faq', data: any) {
  const baseStructuredData = {
    "@context": "https://schema.org",
  };

  switch (type) {
    case 'article':
      return {
        ...baseStructuredData,
        "@type": "Article",
        "headline": data.title,
        "description": data.description,
        "datePublished": data.publishedTime,
        "dateModified": data.modifiedTime || data.publishedTime,
        "author": {
          "@type": "Person",
          "name": data.author || "Anonymous"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Regret Archive",
          "url": baseUrl
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": data.url
        },
        ...(data.section && { "articleSection": data.section }),
        ...(data.keywords && { "keywords": data.keywords.join(', ') }),
      };

    case 'breadcrumb':
      return {
        ...baseStructuredData,
        "@type": "BreadcrumbList",
        "itemListElement": data.items.map((item: any, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url
        }))
      };

    case 'faq':
      return {
        ...baseStructuredData,
        "@type": "FAQPage",
        "mainEntity": data.questions.map((q: any) => ({
          "@type": "Question",
          "name": q.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.answer
          }
        }))
      };

    default:
      return data;
  }
}

export const seoConstants = {
  baseUrl,
  siteName: 'Regret Archive',
  defaultDescription: 'A safe, anonymous platform for sharing regrets and life lessons. Connect with others who understand your experiences.',
  defaultKeywords: [
    'regrets',
    'life lessons',
    'anonymous sharing',
    'community support',
    'personal growth',
    'life experiences',
    'emotional support',
    'wisdom sharing'
  ],
  social: {
    twitter: '@regretarchive',
    facebook: 'regretarchive',
  }
} as const;
