async function checkServer() {
  console.log("Checking server status...");
  
  try {
    const response = await fetch("http://localhost:8000/");
    const status = response.status;
    const text = await response.text();
    
    console.log("\nStatus Code:", status);
    
    if (status >= 400) {
      console.log("\nError Response Body:");
      console.log(text);
      
      // Look for specific error messages
      if (text.includes("Internal Server Error")) {
        console.log("\nDetected 500 Internal Server Error");
      }
    }
    
  } catch (error) {
    console.error("\nConnection Error:", error.message);
  }
}

checkServer();
