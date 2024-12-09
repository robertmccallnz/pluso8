// main.ts
import { loadEnvironment } from "./config.ts";

async function main() {
  // Load environment variables
  await loadEnvironment();
  
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  
  // Example chat completion request
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Hello, how are you?"
        }
      ]
    })
  });

  const data = await response.json();
  console.log(data);
}

main().catch(console.error);