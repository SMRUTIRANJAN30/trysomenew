import { ToolConfig, CATEGORY_NAMES, ToolCategory } from "@/config/tools";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://trysomenew.com";

/**
 * Generates JSON-LD schema for WebApplication, FAQPage, and BreadcrumbList
 */
export function generateToolJsonLd(tool: ToolConfig) {
  const catName = CATEGORY_NAMES[tool.category as ToolCategory] || tool.category;
  const toolUrl = `${SITE_URL}${tool.href}`;

  // 1. WebApplication Schema
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.name} — trysomenew`,
    url: toolUrl,
    description: tool.shortDescription,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web Browser, iOS, Android, macOS, Windows, Linux",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Person",
      name: "Smrutiranjan Sahoo",
      url: `${SITE_URL}/about`,
    },
    featureList: [
      "100% Client-Side In-Browser Execution",
      "Zero Server Storage or File Retention",
      "Fast WebAssembly Processing",
      "No Watermarks or Page Limits",
    ],
  };

  // 2. BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: catName,
        item: `${SITE_URL}/tools?category=${tool.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: toolUrl,
      },
    ],
  };

  // 3. FAQPage Schema
  const faqSchema = tool.faq && tool.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  } : null;

  return {
    webAppSchema,
    breadcrumbSchema,
    faqSchema,
  };
}
