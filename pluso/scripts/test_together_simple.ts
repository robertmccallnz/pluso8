// Simple test for Together AI API
const TOGETHER_API_KEY = Deno.env.get("TOGETHER_API_KEY");

async function testTogetherAPI() {
  try {
    console.log("\nTesting Together AI API connection:");
    console.log("--------------------------------");
    
    if (!TOGETHER_API_KEY) {
      throw new Error("TOGETHER_API_KEY not found in environment");
    }
    
    console.log("✓ API Key found");
    
    // Test API connection
    const response = await fetch("https://api.together.xyz/inference", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOGETHER_API_KEY}`,
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
  }
}

if (import.meta.main) {
  await testTogetherAPI();
}
