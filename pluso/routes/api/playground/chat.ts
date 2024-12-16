import { Handlers } from "$fresh/server.ts";
import { TOGETHER_API_KEY, TOGETHER_API_URL } from "../../../lib/config/together.ts";
import { AVAILABLE_MODELS } from "../../../lib/constants/models.ts";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export const handler: Handlers = {
  async POST(req) {
    try {
      const { messages, model } = await req.json();
      
      // Find model details
      const modelDetails = AVAILABLE_MODELS.find(m => m.id === model);
      if (!modelDetails) {
        throw new Error("Invalid model selected");
      }

      if (modelDetails.provider === "together") {
        if (!TOGETHER_API_KEY) {
          throw new Error("Together API key not configured");
        }

        const response = await fetch(TOGETHER_API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${TOGETHER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: modelDetails.id,
            messages: messages.map((msg: Message) => ({
              role: msg.role,
              content: msg.content,
            })),
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to get response from Together AI");
        }

        const result = await response.json();
        return new Response(
          JSON.stringify({
            message: result.choices[0].message.content,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Fallback mock response for other providers
      // TODO: Implement other providers
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return new Response(
        JSON.stringify({
          message: `[${modelDetails.provider.toUpperCase()}] This is a mock response for ${modelDetails.name}. Integrate the ${modelDetails.provider} API to get real responses.`,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error in playground chat:", error);
      return new Response(
        JSON.stringify({
          error: error.message || "Internal server error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};
