import { JSX } from "preact";

interface ChatLayoutProps {
  children: JSX.Element;
  title: string;
}

export function ChatLayout({ children, title }: ChatLayoutProps) {
  return (
    <div class="flex flex-col min-h-screen">
      <header class="bg-white shadow">
        <h1 class="text-xl font-bold p-4">{title}</h1>
      </header>
      <main class="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}