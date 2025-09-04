import Script from 'next/script';

interface StructuredDataProps {
  type: 'website' | 'article' | 'organization' | 'breadcrumb';
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Regret Archive",
          "description": "A safe, anonymous platform for sharing regrets and life lessons. Connect with others who understand your experiences.",
          "url": "https://regret-archive.appwrite.network",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://regret-archive.appwrite.network/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Regret Archive",
            "url": "https://regret-archive.appwrite.network"
          }
        };

      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "datePublished": data.datePublished,
          "dateModified": data.dateModified || data.datePublished,
          "author": {
            "@type": "Person",
            "name": "Anonymous"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Regret Archive",
            "url": "https://regret-archive.appwrite.network"
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url
          },
          "articleSection": data.category,
          "keywords": data.keywords?.join(', '),
          "about": {
            "@type": "Thing",
            "name": data.category
          }
        };

      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Regret Archive",
          "description": "A safe, anonymous platform for sharing regrets and life lessons",
          "url": "https://regret-archive.appwrite.network",
          "logo": "https://regret-archive.appwrite.network/logo.png",
          "sameAs": [
            "https://twitter.com/regretarchive"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": "English"
          }
        };

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.items.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };

      default:
        return data;
    }
  };

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData(), null, 2)
      }}
    />
  );
}
