import { assertEquals } from "std/testing/asserts.ts";
import { render, fireEvent } from "@testing-library/preact";
import { ModelStep } from "../../../islands/AgentCreation/steps/ModelStep.tsx";
import { STEP_VALIDATION, TEST_AGENT_DATA } from "../test-helpers.ts";

Deno.test("ModelStep", async (t) => {
  await t.step("should enable next button when a model is selected", () => {
    let updatedData = {};
    const mockSetData = (data: any) => {
      updatedData = data;
    };

    const { getByText } = render(
      <ModelStep
        onNext={() => {}}
        onBack={() => {}}
        data={{}}
        setData={mockSetData}
      />
    );

    // Click GPT-4 option
    const gpt4Button = getByText("GPT-4").closest("button");
    fireEvent.click(gpt4Button!);

    // Verify data was updated with both model and provider
    assertEquals(updatedData, {
      provider: "openai",
      model: "gpt-4",
      maxTokens: 8192
    });

    // Verify validation
    assertEquals(STEP_VALIDATION.modelStep(updatedData), true);
  });

  await t.step("should show selected state for chosen model", () => {
    const { getByText } = render(
      <ModelStep
        onNext={() => {}}
        onBack={() => {}}
        data={TEST_AGENT_DATA}
        setData={() => {}}
      />
    );

    // Verify GPT-4 is shown as selected
    const gpt4Button = getByText("GPT-4").closest("button");
    assertEquals(gpt4Button?.classList.contains("border-blue-500"), true);
    assertEquals(gpt4Button?.classList.contains("bg-blue-50"), true);
  });
});
