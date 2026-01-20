import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  type?: "website" | "article" | "product";
  image?: string;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export const SEOHead = ({
  title,
  description,
  canonicalPath = "",
  type = "website",
  image = "https://storage.googleapis.com/gpt-engineer-file-uploads/TNjmXhhfoAdSBHUh7DzUYOimY482/uploads/1768224260458-unity global.png",
  keywords,
  author = "Unity Global Tours",
  publishedTime,
  modifiedTime,
}: SEOHeadProps) => {
  const baseUrl = "https://unityglobaltours.com";
  const fullTitle = title.includes("Unity") ? title : `${title} | Unity Global Tours`;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const updateMetaTag = (selector: string, content: string, attrName = "content") => {
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (meta) {
        meta.setAttribute(attrName, content);
      } else {
        meta = document.createElement("meta");
        const [attr, value] = selector.match(/\[([^\]=]+)="([^"]+)"\]/)?.slice(1) || [];
        if (attr && value) {
          meta.setAttribute(attr, value);
        }
        meta.setAttribute(attrName, content);
        document.head.appendChild(meta);
      }
    };

    // Update meta description
    updateMetaTag('meta[name="description"]', description);

    // Update keywords if provided
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', keywords);
    }

    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', fullTitle);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:url"]', canonicalUrl);
    updateMetaTag('meta[property="og:type"]', type);
    updateMetaTag('meta[property="og:image"]', image);

    // Update Twitter Card tags
    updateMetaTag('meta[name="twitter:title"]', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', description);
    updateMetaTag('meta[name="twitter:image"]', image);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = canonicalUrl;
    }

    // Update author
    updateMetaTag('meta[name="author"]', author);

    // Article specific meta
    if (type === "article" && publishedTime) {
      updateMetaTag('meta[property="article:published_time"]', publishedTime);
    }
    if (type === "article" && modifiedTime) {
      updateMetaTag('meta[property="article:modified_time"]', modifiedTime);
    }

    // Cleanup function - reset to defaults on unmount
    return () => {
      document.title = "Unity Global Tours - Gujarat's Trusted Travel Agency Since 2014";
    };
  }, [fullTitle, description, canonicalUrl, type, image, keywords, author, publishedTime, modifiedTime]);

  return null;
};
