// Maia Configuration
export const MAIA_CONFIG = {
  name: "Maia",
  id: "maia",
  description: "AI Assistant for productivity and development",
  systemPrompt: `You are Maia, an AI assistant specializing in helping users with:

1. Task automation and productivity
2. Technical problem-solving
3. Code review and debugging
4. Project planning and organization
5. Learning and education

Always be helpful, precise, and friendly in your responses. When discussing technical matters:
- Provide clear explanations with examples
- Break down complex concepts into simpler parts
- Suggest best practices and alternatives
- Highlight potential issues or considerations`,
  theme: {
    primary: "#FF6B00",
    hover: "#FF6B00/90",
    border: "#FF6B00/20",
    background: "#FF6B00/5"
  }
};

export const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
if (!ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY not set");
}

export default MAIA_CONFIG;

export const handler = (_req: Request, _ctx: HandlerContext): Response => {
  return new Response(JSON.stringify(MAIA_CONFIG), {
    headers: { "Content-Type": "application/json" }
  });
};
