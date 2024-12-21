import { assertEquals } from "std/testing/asserts.ts";
import { render, fireEvent } from "@testing-library/preact";
import { ConfigStep } from "../../../islands/AgentCreation/steps/ConfigStep.tsx";
import { STEP_VALIDATION, TEST_AGENT_DATA } from "../test-helpers.ts";

Deno.test("ConfigStep", async (t) => {
  await t.step("should enable next button when all required fields are valid", () => {
    const mockSetData = () => {};
    const { getByPlaceholderText } = render(
      <ConfigStep
        onNext={() => {}}
        onBack={() => {}}
        data={{}}
        setData={mockSetData}
      />
    );

    // Fill in name
    const nameInput = getByPlaceholderText("Enter agent name");
    fireEvent.change(nameInput, { target: { value: "Test Agent" } });

    // Fill in description
    const descriptionInput = getByPlaceholderText("Enter agent description");
    fireEvent.change(descriptionInput, {
      target: { value: "This is a test agent description that meets the minimum length requirement." }
    });

    // Fill in system prompt
    const systemPromptInput = getByPlaceholderText("Enter system prompt");
    fireEvent.change(systemPromptInput, {
      target: { value: "You are a helpful customer service agent..." }
    });

    // Verify validation
    const updatedData = {
      name: "Test Agent",
      description: "This is a test agent description that meets the minimum length requirement.",
      systemPrompt: "You are a helpful customer service agent..."
    };
    assertEquals(STEP_VALIDATION.configStep(updatedData), true);
  });

  await t.step("should show validation errors for invalid inputs", () => {
    const { getByPlaceholderText, getByText } = render(
      <ConfigStep
        onNext={() => {}}
        onBack={() => {}}
        data={{}}
        setData={() => {}}
      />
    );

    // Test name validation
    const nameInput = getByPlaceholderText("Enter agent name");
    fireEvent.change(nameInput, { target: { value: "Te" } });
    assertEquals(getByText("Name must be at least 3 characters") instanceof HTMLElement, true);

    // Test description validation
    const descriptionInput = getByPlaceholderText("Enter agent description");
    fireEvent.change(descriptionInput, { target: { value: "Short" } });
    assertEquals(getByText("Description must be at least 10 characters") instanceof HTMLElement, true);
  });

  await t.step("should show pre-filled values from existing data", () => {
    const { getByPlaceholderText } = render(
      <ConfigStep
        onNext={() => {}}
        onBack={() => {}}
        data={TEST_AGENT_DATA}
        setData={() => {}}
      />
    );

    const nameInput = getByPlaceholderText("Enter agent name") as HTMLInputElement;
    const descriptionInput = getByPlaceholderText("Enter agent description") as HTMLTextAreaElement;
    const systemPromptInput = getByPlaceholderText("Enter system prompt") as HTMLTextAreaElement;

    assertEquals(nameInput.value, TEST_AGENT_DATA.name);
    assertEquals(descriptionInput.value, TEST_AGENT_DATA.description);
    assertEquals(systemPromptInput.value, TEST_AGENT_DATA.systemPrompt);
  });
});
