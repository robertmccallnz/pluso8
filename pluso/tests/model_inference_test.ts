import { assertEquals } from "https://deno.land/std@0.211.0/assert/mod.ts";

Deno.test("Test Model Inference via Local API", async () => {
  const prompt = "What is machine learning? Please explain in one sentence.";
  
  try {
    const response = await fetch("http://localhost:8000/api/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": Deno.env.get("API_KEY") || "",
      },
      body: JSON.stringify({
        messages: [
          { 
            role: "system", 
            content: "You are a helpful AI assistant. Keep your responses concise." 
          },
          { 
            role: "user", 
            content: prompt 
          },
        ],
        model: "mistral-7b-instruct",
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    assertEquals(response.ok, true);
    
    const data = await response.json();
    const modelResponse = data.choices[0].message.content;
    
    console.log("Prompt:", prompt);
    console.log("Model Response:", modelResponse);
    
    // Basic assertions
    assertEquals(typeof modelResponse, "string");
    assertEquals(modelResponse.length > 0, true);
  } catch (error) {
    console.error("Error during inference:", error);
    throw error;
  }
});
