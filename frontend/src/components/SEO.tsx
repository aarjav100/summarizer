import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl = 'https://summamind.shop/',
  ogType = 'website'
}) => {
  useEffect(() => {
    // Title
    document.title = title;

    // Helper to set or update meta tag
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper for link tags
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Description
    setMetaTag('meta[name="description"]', 'name', 'description', description);

    // Canonical
    setLinkTag('canonical', canonicalUrl);

    // Open Graph
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'SummaMind Studio');

    // Twitter Card
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    // Scroll to top on navigation change
    window.scrollTo(0, 0);
  }, [title, description, canonicalUrl, ogType]);

  return null;
};
