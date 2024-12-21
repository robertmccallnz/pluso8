import { assertEquals } from "std/testing/asserts.ts";
import { render, fireEvent } from "@testing-library/preact";
import { EvaluationStep } from "../../../islands/AgentCreation/steps/EvaluationStep.tsx";
import { STEP_VALIDATION, TEST_AGENT_DATA } from "../test-helpers.ts";

Deno.test("EvaluationStep", async (t) => {
  await t.step("should have required criteria pre-selected and disabled", () => {
    const { getAllByRole } = render(
      <EvaluationStep
        onNext={() => {}}
        onBack={() => {}}
        data={{}}
        setData={() => {}}
      />
    );

    const checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    const responseAccuracyCheckbox = checkboxes[0];
    const responseTimeCheckbox = checkboxes[1];

    assertEquals(responseAccuracyCheckbox.checked, true);
    assertEquals(responseAccuracyCheckbox.disabled, true);
    assertEquals(responseTimeCheckbox.checked, true);
    assertEquals(responseTimeCheckbox.disabled, true);
  });

  await t.step("should enable next button when required criteria are selected", () => {
    const mockSetData = (data: any) => {
      // Verify data was updated
      assertEquals(data, {
        evaluationCriteria: ["response_accuracy", "response_time", "context_awareness"]
      });

      // Verify validation
      const updatedData = {
        evaluationCriteria: ["response_accuracy", "response_time", "context_awareness"]
      };
      assertEquals(STEP_VALIDATION.evaluationStep(updatedData), true);
    };

    const { getAllByRole } = render(
      <EvaluationStep
        onNext={() => {}}
        onBack={() => {}}
        data={{}}
        setData={mockSetData}
      />
    );

    // Required criteria should be pre-selected
    const contextAwarenessCheckbox = getAllByRole("checkbox")[2];
    fireEvent.click(contextAwarenessCheckbox);
  });

  await t.step("should show selected state for chosen criteria", () => {
    const { getAllByRole } = render(
      <EvaluationStep
        onNext={() => {}}
        onBack={() => {}}
        data={TEST_AGENT_DATA}
        setData={() => {}}
      />
    );

    const checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    checkboxes.forEach((checkbox, index) => {
      if (index < 3) { // First three criteria should be checked
        assertEquals(checkbox.checked, true);
      } else {
        assertEquals(checkbox.checked, false);
      }
    });
  });
});
