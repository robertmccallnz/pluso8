import { PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";
import Sidebar from "../../components/SideBar.tsx";

interface DashboardLayoutProps extends PageProps {
  Component: any;
}

export default function DashboardLayout({ Component, url }: DashboardLayoutProps) {
  const menuOpen = useSignal(false);

  return (
    <div data-theme="lemonade" class="min-h-screen bg-base-100">
      <div class="flex h-screen">
        <Sidebar currentPath={url.pathname} />
        
        {/* Backdrop for mobile */}
        {menuOpen.value && (
          <div 
            class="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 lg:hidden"
            onClick={() => menuOpen.value = false}
          ></div>
        )}
        
        {/* Main Content */}
        <main class="flex-1 p-6 lg:p-8 max-w-7xl mx-auto overflow-auto">
          <Component />
        </main>
      </div>
    </div>
  );
}

export const config = {
  skipInheritance: true,
};
