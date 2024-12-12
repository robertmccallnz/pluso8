import { Anthropic } from "https://esm.sh/@anthropic-ai/sdk@0.18.0";

// Define Message type to resolve type annotation
interface Message {
  role: string;
  content: string;
}

const AGENT_CONFIGS = {
  maia: {
    name: "Maia",
    version: "1.0",
    systemPrompt: `You are Maia, PluSO's front-of-house AI specialist. Your role is to guide businesses through the process of creating custom AI agents using our Deno and LangChain setup.

Core Responsibilities:
- Welcome visitors warmly, using Te Reo Māori greetings appropriately
- Guide discovery conversations to understand business needs
- Explain PluSO's capabilities in terms of business value
- Provide solution-focused estimates (not formal quotes)
- Manage follow-up communication professionally

Remember:
- Always address users by name once learned
- Be warm but professional
- Use Te Reo naturally for greetings, place names, and farewells
- Focus on understanding the business problem before proposing solutions
- Base estimates on complexity of requirements
- Emphasize value and ROI rather than just features`,
    model: "claude-3-haiku-20240307"
  }
};

export const handler = {
  async POST(req: Request): Promise<Response> {
    try {
      const { message, agent = 'maia', conversationHistory = [] } = await req.json();
      
      // Validate agent exists
      if (!AGENT_CONFIGS[agent]) {
        return new Response(JSON.stringify({ 
          error: "Invalid agent specified" 
        }), { 
          status: 400,
          headers: { "Content-Type": "application/json" } 
        });
      }

      const agentConfig = AGENT_CONFIGS[agent];
      
      const anthropic = new Anthropic({
        apiKey: Deno.env.get("ANTHROPIC_API_KEY")
      });

      // Prepare messages with conversation history and new message
      const messages: Array<{ role: string; content: string }> = [
        { role: "system", content: agentConfig.systemPrompt },
        ...conversationHistory.map((msg: Message) => ({
          role: msg.role,
          content: msg.content
        })),
        { 
          role: "user", 
          content: message 
        }
      ];

      const response = await anthropic.messages.create({
        model: agentConfig.model || "claude-3-haiku-20240307",
        max_tokens: 300,
        messages: messages
      });

      const responseMessage = response.content[0]?.text || 
        "I'm sorry, I couldn't generate a response.";

      return new Response(JSON.stringify({ 
        message: responseMessage,
        agent: agentConfig.name,
        timestamp: Date.now()
      }), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (error) {
      console.error("Agent chat processing error:", error);
      return new Response(JSON.stringify({ 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  },

  // CORS handling for preflight requests
  async OPTIONS(): Promise<Response> {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
};