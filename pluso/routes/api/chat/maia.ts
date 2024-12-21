import { Handlers } from "$fresh/server.ts";
import { AnthropicClient } from "../../../core/providers/anthropic/client.ts";
import { parse } from "https://deno.land/std@0.208.0/yaml/mod.ts";

// Load Maia's config
const configFile = await Deno.readTextFile(new URL("../../../islands/agents/maia/config.yaml", import.meta.url));
const config = parse(configFile) as {
  name: string;
  description: string;
  model: {
    provider: string;
    name: string;
    config: {
      max_tokens: number;
      temperature: number;
    };
  };
  system_prompt: string;
};

// Initialize Anthropic client
const anthropic = new AnthropicClient({
  apiKey: Deno.env.get("ANTHROPIC_API_KEY") || "",
  baseUrl: "https://api.anthropic.com"
});

export const handler: Handlers = {
  async POST(req) {
    try {
      const { message } = await req.json();

      if (!Deno.env.get("ANTHROPIC_API_KEY")) {
        throw new Error("ANTHROPIC_API_KEY not set");
      }

      const completion = await anthropic.messages.create({
        model: config.model.name,
        max_tokens: config.model.config.max_tokens,
        messages: [{
          role: "user",
          content: message
        }],
        system: config.system_prompt
      });

      return new Response(JSON.stringify({
        response: completion.content[0].text
      }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Chat error:", error);
      return new Response(JSON.stringify({
        error: "Failed to process chat message",
        details: error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
