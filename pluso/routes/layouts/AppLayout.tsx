import { PageProps } from "$fresh/server.ts";
import NavBar from "../islands/NavBar.tsx";  // Add this import

export default function Layout({ Component, url }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pluso</title>
        <link rel="stylesheet" href="/output.css" />
      </head>
      <body>
        <div data-theme="lemonade" class="min-h-screen bg-base-100">
          {/* Replace the div with direct NavBar component */}
          <NavBar currentPath={url?.pathname || '/'} />
          <main class="container mx-auto px-4 py-8 max-w-7xl">
            <Component />
          </main>
        </div>
      </body>
    </html>
  );
}

export const config = {
  skipInheritance: false,
};