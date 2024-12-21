// Test Together AI API connection
import { loadEnvConfig } from "../utils/env.ts";

async function testTogetherAPI() {
  try {
    const env = await loadEnvConfig();
    console.log("\nTesting Together AI API connection:");
    console.log("--------------------------------");
    
    // Check if key exists and has proper format
    const key = Deno.env.get("TOGETHER_API_KEY");
    if (!key) {
      throw new Error("TOGETHER_API_KEY not found in environment");
    }
    
    console.log("✓ API Key found");
    console.log(`✓ API Key length: ${key.length} characters`);
    
    // Test API connection
    const response = await fetch("https://api.together.xyz/inference", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "togethercomputer/llama-2-70b-chat",
        prompt: "Hi, this is a test message. Please respond with 'API is working' if you receive this.",
        max_tokens: 20,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ["</s>", "Human:", "Assistant:"],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✓ API connection successful");
    console.log("✓ Response received:", data.output?.text || "[no output]");
    
  } catch (error) {
    console.error("✗ Error:", error.message);
    if (error.message.includes("not found")) {
      console.log("\nTo fix this:");
      console.log("1. Add TOGETHER_API_KEY to your .env file:");
      console.log("   TOGETHER_API_KEY=your_api_key_here");
      console.log("2. Make sure the key is valid and not expired");
      console.log("3. Restart the application after adding the key");
    }
  }
}

if (import.meta.main) {
  await testTogetherAPI();
}
