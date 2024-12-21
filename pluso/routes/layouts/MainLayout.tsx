import { ComponentChildren } from "preact";
import NavBar from "../islands/NavBar.tsx";

interface LayoutProps {
  children: ComponentChildren;
  url: URL;  // Add URL prop
}

export default function Layout({ children, url }: LayoutProps) {
  return (
    <div class="min-h-screen">
      <NavBar url={url} />
      <main class="container mx-auto px-4">
        {children}
      </main>
    </div>
  );
}