import { ComponentChildren } from "preact";

interface Props {
  title?: string;
  description?: string;
  type?: string;
  openGraph?: {
    title?: string;
    description?: string;
    type?: string;
    siteName?: string;
  };
  twitter?: {
    card?: string;
    site?: string;
    title?: string;
    description?: string;
  };
  children?: ComponentChildren;
}

export default function SEO({ title, description, type, openGraph, twitter, children }: Props) {
  return (
    <head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {type && <meta name="type" content={type} />}

      {/* Open Graph */}
      {openGraph?.title && <meta property="og:title" content={openGraph.title} />}
      {openGraph?.description && <meta property="og:description" content={openGraph.description} />}
      {openGraph?.type && <meta property="og:type" content={openGraph.type} />}
      {openGraph?.siteName && <meta property="og:site_name" content={openGraph.siteName} />}

      {/* Twitter */}
      {twitter?.card && <meta name="twitter:card" content={twitter.card} />}
      {twitter?.site && <meta name="twitter:site" content={twitter.site} />}
      {twitter?.title && <meta name="twitter:title" content={twitter.title} />}
      {twitter?.description && <meta name="twitter:description" content={twitter.description} />}

      {children}
    </head>
  );
}
