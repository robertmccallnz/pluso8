import { AppProps } from "$fresh/server.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pluso - AI Agent Platform</title>
        <meta name="description" content="Build and deploy AI agents with ease" />
        <meta name="robots" content="index,follow" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/css/prism-tomorrow.css" />

        {/* Open Graph */}
        <meta property="og:title" content="Pluso - AI Agent Platform" />
        <meta property="og:description" content="Build and deploy AI agents with ease" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Pluso" />
        <meta property="og:locale" content="en_NZ" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@PlusoAI" />
        <meta name="twitter:title" content="Pluso - AI Agent Platform" />
        <meta name="twitter:description" content="Build and deploy AI agents with ease" />
      </head>
      <Component />
    </>
  );
}
