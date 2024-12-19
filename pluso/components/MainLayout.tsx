import { type ComponentChildren } from "preact";
import { useEffect, useSignal } from "preact/hooks";
import { useLocation } from "preact-iso";
import WidgetInterface from "../islands/interfaces/Widget.tsx";

interface MainLayoutProps {
  children: ComponentChildren;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const showChat = useSignal(false);
  const location = useLocation();

  useEffect(() => {
    // Only show chat automatically on home page after 5 seconds
    if (location.path === "/") {
      const timer = setTimeout(() => {
        showChat.value = true;
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.path]);

  const maiaAgent = {
    id: "maia",
    name: "Maia",
    avatar: "/maia-avatar.png", // Make sure this path is correct
    description: "Your AI assistant"
  };

  return (
    <div>
      {children}
      <WidgetInterface
        initialOpen={showChat.value}
        agents={[maiaAgent]}
        currentAgent="maia"
      />
    </div>
  );
}
