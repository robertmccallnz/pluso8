import { PageProps } from "$fresh/server.ts";
import NavBar from "../components/NavBar.tsx";

export default function Layout({ Component, url }: PageProps) {
  // Don't show this layout in the dashboard
  if (url.pathname.startsWith('/dashboard')) {
    return <Component />;
  }

  return (
    <div data-theme="lemonade" class="min-h-screen bg-base-100">
      <NavBar currentPath={url.pathname} />
      <main class="container mx-auto px-4 py-8 max-w-7xl">
        <Component />
      </main>
    </div>
  );
}

export const config = {
  skipInheritance: false,
};
