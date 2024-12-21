import { assertEquals } from "std/testing/asserts.ts";
import { render, fireEvent } from "@testing-library/preact";
import AgentCreationWizard from "../../islands/AgentCreation/AgentCreationWizard.tsx";

Deno.test("AgentCreationWizard - Step Navigation", async (t) => {
  await t.step("should enable next button only when valid selections are made in each step", async () => {
    const { getByText, getByRole, getAllByRole, getByPlaceholderText } = render(
      <AgentCreationWizard />
    );

    // Get the next button
    const nextButton = getByText("Next");
    assertEquals(nextButton.hasAttribute("disabled"), true);

    // Step 1: Use Case Selection
    const customerServiceButton = getByText("Customer Service").closest("button");
    fireEvent.click(customerServiceButton!);
    assertEquals(nextButton.hasAttribute("disabled"), false);
    fireEvent.click(nextButton);

    // Step 2: Model Selection
    assertEquals(nextButton.hasAttribute("disabled"), true);
    const gpt4Button = getByText("GPT-4").closest("button");
    fireEvent.click(gpt4Button!);
    assertEquals(nextButton.hasAttribute("disabled"), false);
    fireEvent.click(nextButton);

    // Step 3: Template Selection
    assertEquals(nextButton.hasAttribute("disabled"), true);
    const customerSupportTemplate = getByText("Customer Service Agent").closest("button");
    fireEvent.click(customerSupportTemplate!);
    assertEquals(nextButton.hasAttribute("disabled"), false);
    fireEvent.click(nextButton);

    // Step 4: Configuration
    assertEquals(nextButton.hasAttribute("disabled"), true);
    
    // Fill in required fields
    const nameInput = getByPlaceholderText("Enter agent name");
    fireEvent.change(nameInput, { target: { value: "Test Agent" } });
    
    const descriptionInput = getByPlaceholderText("Enter agent description");
    fireEvent.change(descriptionInput, { 
      target: { value: "This is a test agent description that meets the minimum length requirement." } 
    });
    
    const systemPromptInput = getByPlaceholderText("Enter system prompt");
    fireEvent.change(systemPromptInput, { 
      target: { value: "You are a helpful customer service agent..." } 
    });
    
    assertEquals(nextButton.hasAttribute("disabled"), false);
    fireEvent.click(nextButton);

    // Step 5: Evaluation
    assertEquals(nextButton.hasAttribute("disabled"), true);
    // Required criteria should be pre-selected
    const contextAwarenessCheckbox = getAllByRole("checkbox")[2];
    fireEvent.click(contextAwarenessCheckbox);
    assertEquals(nextButton.hasAttribute("disabled"), false);
    fireEvent.click(nextButton);

    // Step 6: Testing (Optional)
    assertEquals(nextButton.hasAttribute("disabled"), false);
    // Simulate a test conversation
    const messageInput = getByPlaceholderText("Type a message to test the agent...");
    const sendButton = getByText("Send");
    
    fireEvent.change(messageInput, { target: { value: "Hello, agent!" } });
    fireEvent.click(sendButton);
    
    // Wait for simulated response
    await new Promise(resolve => setTimeout(resolve, 1100));
    assertEquals(nextButton.hasAttribute("disabled"), false);
    fireEvent.click(nextButton);

    // Step 7: Deploy
    const finishButton = getByText("Finish");
    assertEquals(finishButton.hasAttribute("disabled"), false);
  });
});
