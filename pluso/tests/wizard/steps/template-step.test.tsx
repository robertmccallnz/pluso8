import { assertEquals } from "std/testing/asserts.ts";
import { render, fireEvent } from "@testing-library/preact";
import { TemplateStep } from "../../../islands/AgentCreation/steps/TemplateStep.tsx";
import { STEP_VALIDATION, TEST_AGENT_DATA } from "../test-helpers.ts";

Deno.test("TemplateStep", async (t) => {
  await t.step("should enable next button when a template is selected", () => {
    let updatedData = {};
    const mockSetData = (data: any) => {
      updatedData = data;
    };

    const { getByText } = render(
      <TemplateStep
        onNext={() => {}}
        onBack={() => {}}
        data={{}}
        setData={mockSetData}
      />
    );

    // Click Customer Service template
    const templateButton = getByText("Customer Service").closest("button");
    fireEvent.click(templateButton!);

    // Verify data was updated
    assertEquals(
      (updatedData as any).template,
      "customer_service"
    );
    assertEquals(
      typeof (updatedData as any).systemPrompt,
      "string"
    );
    assertEquals(
      (updatedData as any).systemPrompt.includes("You are a helpful customer service agent"),
      true
    );

    // Verify validation
    assertEquals(STEP_VALIDATION.templateStep(updatedData), true);
  });

  await t.step("should show selected state for chosen template", () => {
    const { getByText } = render(
      <TemplateStep
        onNext={() => {}}
        onBack={() => {}}
        data={TEST_AGENT_DATA}
        setData={() => {}}
      />
    );

    // Verify Customer Service template is shown as selected
    const templateButton = getByText("Customer Service").closest("button");
    assertEquals(templateButton?.classList.contains("border-blue-500"), true);
    assertEquals(templateButton?.classList.contains("bg-blue-50"), true);
  });

  await t.step("should show preview of template system prompt", () => {
    const { getByText } = render(
      <TemplateStep
        onNext={() => {}}
        onBack={() => {}}
        data={TEST_AGENT_DATA}
        setData={() => {}}
      />
    );

    // Click preview button
    const previewButton = getByText("Preview");
    fireEvent.click(previewButton);

    // Verify preview content is shown
    const previewContent = getByText(/You are a helpful customer service agent/);
    assertEquals(previewContent instanceof HTMLElement, true);
  });
});
