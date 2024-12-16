interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: string;
  robots?: string;
  keywords?: string[];
}

export default function SEO({ 
  title, 
  description, 
  image = "https://pluso.co.nz/og-image.jpg",
  type = "website",
  robots = "index,follow",
  keywords = []
}: SEOProps) {
  const defaultKeywords = [
    "AI assistant",
    "artificial intelligence",
    "chat agent",
    "New Zealand",
    "te reo Māori",
    "bilingual AI",
    "PluSO",
    "business automation",
    "custom AI",
    "enterprise AI"
  ];

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])];

  return (
    <>
      {/* Primary Meta Tags */}
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(", ")} />
      <meta name="robots" content={robots} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content="https://pluso.co.nz" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://pluso.co.nz" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="PluSO" />
      <link rel="canonical" href="https://pluso.co.nz" />
    </>
  );
}
