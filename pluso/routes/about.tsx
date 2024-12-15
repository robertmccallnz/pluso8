import { Handlers } from "$fresh/server.ts";
import NavBar from "../islands/NavBar.tsx";
import { COLORS, TYPOGRAPHY } from "../lib/constants/styles.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const resp = await ctx.render();
    resp.headers.set("X-Custom-Header", "Hello");
    return resp;
  },
};

export default function AboutPage() {
  return (
    <div 
      style={{
        fontFamily: TYPOGRAPHY.fontFamily.base,
        backgroundColor: COLORS.background.primary
      }}
      class="min-h-screen"
    >
      <NavBar />
      <main class="pt-16 container mx-auto px-4">
        <h1 
          style={{
            color: COLORS.text.primary,
            fontSize: TYPOGRAPHY.fontSize['2xl']
          }}
          class="mb-6"
        >
          About Pluso
        </h1>
        <div 
          style={{
            color: COLORS.text.secondary
          }}
          class="prose max-w-none"
        >
          <p class="mb-4">
            Welcome to Pluso - your comprehensive AI assistant platform. We bring together specialized AI agents to help with various aspects of your life and work.
          </p>
          <p class="mb-4">
            Meet our AI team:
          </p>
          <ul class="list-disc pl-5 mb-4">
            <li><strong>Maia:</strong> Your personal AI companion for everyday tasks and conversations</li>
            <li><strong>Jeff:</strong> Legal expert specializing in property law and regulations</li>
            <li><strong>Petunia:</strong> Creative assistant for writing and content creation</li>
          </ul>
          <p>
            Each AI agent is designed with specific expertise and capabilities to provide you with the best possible assistance in their respective domains.
          </p>
        </div>
      </main>
      <footer class="text-center text-gray-500 text-sm py-12 mt-16 space-y-2">
        <div>
          &copy; {new Date().getFullYear()} <span class="font-mono">plu_SO</span>
        </div>
        <div class="flex justify-center space-x-4">
          <span>Tel: 022 400 4387</span>
          <span>|</span>
          <a href="mailto:hello@pluso.co.nz" class="hover:text-gray-700">
            hello@pluso.co.nz
          </a>
        </div>
      </footer>
    </div>
  );
}