import { assertEquals } from "std/testing/asserts.ts";
import { render, fireEvent } from "@testing-library/preact";
import { UseCaseStep } from "../../../islands/AgentCreation/steps/UseCaseStep.tsx";
import { STEP_VALIDATION, TEST_AGENT_DATA } from "../test-helpers.ts";

Deno.test("UseCaseStep", async (t) => {
  await t.step("should enable next button when a use case is selected", () => {
    let updatedData = {};
    const mockSetData = (data: any) => {
      updatedData = data;
    };

    const { getByText } = render(
      <UseCaseStep
        onNext={() => {}}
        onBack={() => {}}
        data={{}}
        setData={mockSetData}
      />
    );

    // Click Customer Service use case
    const useCaseButton = getByText("Customer Service").closest("button");
    fireEvent.click(useCaseButton!);

    // Verify data was updated
    assertEquals(updatedData, {
      useCase: "customer_service"
    });

    // Verify validation
    assertEquals(STEP_VALIDATION.useCaseStep(updatedData), true);
  });

  await t.step("should show selected state for chosen use case", () => {
    const { getByText } = render(
      <UseCaseStep
        onNext={() => {}}
        onBack={() => {}}
        data={TEST_AGENT_DATA}
        setData={() => {}}
      />
    );

    // Verify Customer Service use case is shown as selected
    const useCaseButton = getByText("Customer Service").closest("button");
    assertEquals(useCaseButton?.classList.contains("border-blue-500"), true);
    assertEquals(useCaseButton?.classList.contains("bg-blue-50"), true);
  });
});
