async function debugServer() {
  console.log("Starting server debug...");

  try {
    // Make a request to the server
    const response = await fetch("http://localhost:8000/", {
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0"
      }
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    const text = await response.text();
    console.log("\nResponse body:", text);

    // Parse error message if present
    if (text.includes("error occurred")) {
      const errorMatch = text.match(/Error:([^<]+)/);
      if (errorMatch) {
        console.log("\nExtracted error:", errorMatch[1].trim());
      }
    }

  } catch (error) {
    console.error("Debug error:", error);
  }
}

// Run the debug
debugServer().catch(console.error);
