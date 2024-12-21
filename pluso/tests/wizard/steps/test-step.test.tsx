import { assertEquals } from "std/testing/asserts.ts";
import { render, fireEvent } from "@testing-library/preact";
import { TestStep } from "../../../islands/AgentCreation/steps/TestStep.tsx";
import { STEP_VALIDATION, TEST_AGENT_DATA } from "../test-helpers.ts";

Deno.test("TestStep", async (t) => {
  await t.step("should enable next button by default (testing is optional)", () => {
    const { getByText } = render(
      <TestStep
        onNext={() => {}}
        onBack={() => {}}
        data={{}}
        setData={() => {}}
      />
    );

    const nextButton = getByText("Next") as HTMLButtonElement;
    assertEquals(nextButton.disabled, false);
  });

  await t.step("should simulate agent response after user message", async () => {
    let updatedData = {};
    const mockSetData = (data: any) => {
      updatedData = data;
    };

    const { getByPlaceholderText, getByText, findByText } = render(
      <TestStep
        onNext={() => {}}
        onBack={() => {}}
        data={{}}
        setData={mockSetData}
      />
    );

    // Send a test message
    const messageInput = getByPlaceholderText("Type a message to test the agent...") as HTMLInputElement;
    const sendButton = getByText("Send");

    fireEvent.change(messageInput, { target: { value: "Hello, agent!" } });
    fireEvent.click(sendButton);

    // Wait for simulated response
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Verify agent response appears
    const response = await findByText(/This is a simulated response/);
    assertEquals(response instanceof HTMLElement, true);

    // Verify test results were updated
    assertEquals(
      (updatedData as any).testResults?.messageCount,
      2
    );
    assertEquals(
      (updatedData as any).testResults?.passed,
      true
    );

    // Verify validation
    assertEquals(STEP_VALIDATION.testStep(updatedData), true);
  });

  await t.step("should show test status when tests are completed", () => {
    const { getByText } = render(
      <TestStep
        onNext={() => {}}
        onBack={() => {}}
        data={TEST_AGENT_DATA}
        setData={() => {}}
      />
    );

    const successText = getByText("Test completed successfully");
    const messageCountText = getByText("2 messages exchanged");
    
    assertEquals(successText instanceof HTMLElement, true);
    assertEquals(messageCountText instanceof HTMLElement, true);
  });
});
