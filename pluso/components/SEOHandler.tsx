import { h } from "preact";
import SEO from "./SEO.tsx";
import { defaultSEOConfig } from "../core/seo/config.ts";

interface OpenGraph {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  url?: string;
  siteName?: string;
}

interface Twitter {
  card?: string;
  site?: string;
  creator?: string;
  image?: string;
  title?: string;
  description?: string;
}

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: string;
  robots?: string;
  keywords?: string[];
  openGraph?: OpenGraph;
  twitter?: Twitter;
  canonical?: string;
  locale?: string;
  additionalMetaTags?: Array<{ name: string; content: string }>;
}

interface SEOHandlerProps extends Partial<SEOProps> {
  path?: string;
}

export default function SEOHandler({ path, ...props }: SEOHandlerProps) {
  const seoProps: SEOProps = {
    title: defaultSEOConfig.title,
    description: defaultSEOConfig.description,
    ...props,
    openGraph: {
      ...defaultSEOConfig.openGraph,
      ...props.openGraph,
      url: `${defaultSEOConfig.openGraph?.siteName}${path || ""}`,
    },
  };

  return (
    <SEO
      {...defaultSEOConfig}
      {...seoProps}
      path={path}
    />
  );
}
