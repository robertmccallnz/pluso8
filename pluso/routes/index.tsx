import { h } from "preact";
import NavBar from "../islands/NavBar.tsx";
import { Button } from "../components/Button.tsx";
import { COLORS, TYPOGRAPHY } from "../lib/constants/styles.ts";

export default function Home() {
  return (
    <div 
      style={{
        fontFamily: TYPOGRAPHY.fontFamily.base,
        backgroundColor: COLORS.background.primary
      }}
      class="min-h-screen"
    >
      <NavBar />
      <div class="pt-16 flex flex-col items-center justify-center text-center px-4">
        <h1 
          style={{
            color: COLORS.text.primary,
            fontSize: TYPOGRAPHY.fontSize['3xl']
          }}
          class="mb-6 font-bold"
        >
          Unleash the Power of Customized AI Agents
        </h1>
        
        <p 
          style={{
            color: COLORS.text.secondary,
            fontSize: TYPOGRAPHY.fontSize.lg
          }}
          class="max-w-3xl mb-8 px-4"
        >
          Meet Maia, Jeff, and Petunia: Next-generation AI agents powered by V8, Tokio, and Deno. 
          Imagine AI that doesn't just respond, but truly understands, learns, and works tirelessly for your business.
        </p>
        
        <div class="flex space-x-4">
          <a href="/maia">
            <Button
              variant="primary"
              size="lg"
              class="bg-pluso-blue hover:bg-pluso-cyan text-white"
            >
              Meet Maia
            </Button>
          </a>
          <a href="/about">
            <Button
              variant="secondary"
              size="lg"
              class="bg-pluso-cyan hover:bg-pluso-blue text-white"
            >
              Learn More
            </Button>
          </a>
        </div>

        <div 
          class="mt-12 max-w-4xl text-left bg-white p-6 rounded-lg shadow-md"
          style={{
            backgroundColor: 'white',
            color: COLORS.text.secondary
          }}
        >
          <h2 
            style={{
              color: COLORS.text.primary,
              fontSize: TYPOGRAPHY.fontSize['2xl']
            }}
            class="mb-4 text-center"
          >
            AI Agents: Revolutionizing Business Intelligence
          </h2>
          
          <ul class="space-y-4 list-disc pl-5">
            <li>
              <strong>Continuous Learning:</strong> Powered by V8's high-performance JavaScript engine, our AI agents continuously adapt and improve.
            </li>
            <li>
              <strong>Database Integration:</strong> Seamlessly connect to your existing databases, enabling real-time, context-aware responses.
            </li>
            <li>
              <strong>Persistent Memory:</strong> Leveraging Tokio's asynchronous runtime, agents maintain conversational context and learn from interactions.
            </li>
            <li>
              <strong>24/7 Availability:</strong> Built with Deno's secure runtime, these agents work around the clock without fatigue.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}