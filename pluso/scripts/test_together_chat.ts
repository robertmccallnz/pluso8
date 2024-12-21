// Test Together AI Chat API
const TOGETHER_API_KEY = Deno.env.get("TOGETHER_API_KEY");

async function testTogetherAPI() {
  try {
    console.log("\nTesting Together AI Chat API:");
    console.log("--------------------------------");
    
    if (!TOGETHER_API_KEY) {
      throw new Error("TOGETHER_API_KEY not found in environment");
    }
    
    console.log("✓ API Key found");
    
    // Test API connection using the chat endpoint
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          {
            role: "user",
            content: "Hi, this is a test message. Please respond with 'API is working' if you receive this."
          }
        ],
        temperature: 0.7,
        max_tokens: 20
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${response.statusText}\n${JSON.stringify(errorData, null, 2)}`);
    }

    const data = await response.json();
    console.log("✓ API connection successful");
    console.log("✓ Response received:", data.choices?.[0]?.message?.content || "[no output]");
    
  } catch (error) {
    console.error("✗ Error:", error.message);
  }
}

if (import.meta.main) {
  await testTogetherAPI();
}
