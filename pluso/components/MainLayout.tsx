import { type ComponentChildren } from "preact";
import { useEffect, useSignal } from "preact/hooks";
import MaiaWidgetInterface from "../islands/interfaces/MaiaWidgetInterface.tsx";

interface MainLayoutProps {
  children: ComponentChildren;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const showChat = useSignal(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      showChat.value = true;
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const maiaAgent = {
    id: "maia",
    name: "Maia",
    avatar: "/maia-avatar.png",
    description: "Your AI assistant"
  };

  return (
    <div>
      {children}
      <MaiaWidgetInterface
        initialOpen={showChat.value}
        agents={[maiaAgent]}
        currentAgent="maia"
      />
    </div>
  );
}
