import { signal } from "@preact/signals";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { createAgent } from "../core/services/agent.ts";

interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: string[];
}

interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  industry: string;
  systemPrompt: string;
  features: string[];
  requiredModels: {
    primary: string[];
    fallback: string[];
    embedding: string[];
  };
  evaluationCriteria: Array<{
    id: string;
    name: string;
    description: string;
    threshold: number;
    weight: number;
  }>;
}

interface CreateAgentFormProps {
  onClose: () => void;
  onSuccess: () => void;
  industries: Industry[];
  templates: Template[];
}

const validationSchema = yup.object().shape({
  industry: yup.string().required("Please select an industry"),
  template: yup.string().required("Please select a template"),
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  systemPrompt: yup.string().required("System prompt is required"),
  evaluationCriteria: yup.array().of(
    yup.object().shape({
      threshold: yup.number()
        .required("Threshold is required")
        .min(0, "Threshold must be at least 0")
        .max(1, "Threshold must be at most 1"),
      weight: yup.number()
        .required("Weight is required")
        .min(0, "Weight must be at least 0")
        .max(1, "Weight must be at most 1"),
    })
  ),
});

const activeStep = signal(0);

export default function CreateAgentFormIsland({
  onClose,
  onSuccess,
  industries,
  templates,
}: CreateAgentFormProps) {
  const steps = [
    "Select Industry",
    "Choose Template",
    "Basic Configuration",
    "Customize Prompt",
    "Set Evaluation Criteria",
  ];

  const handleSubmit = async (values: any) => {
    try {
      const selectedTemplate = templates.find((t) => t.id === values.template);
      if (!selectedTemplate) {
        throw new Error("Template not found");
      }

      const agentData = {
        name: values.name,
        description: values.description,
        type: selectedTemplate.type,
        industry: values.industry,
        template: values.template,
        features: selectedTemplate.features,
        models: {
          primary: selectedTemplate.requiredModels.primary[0],
          fallback: selectedTemplate.requiredModels.fallback[0],
          embedding: selectedTemplate.requiredModels.embedding[0],
        },
        systemPrompt: values.systemPrompt,
        evaluations: true,
        evaluationCriteria: values.evaluationCriteria,
        metrics: true,
      };

      await createAgent(agentData);
      onSuccess();
    } catch (error) {
      console.error("Error creating agent:", error);
    }
  };

  const getStepContent = (step: number, formikProps: any) => {
    switch (step) {
      case 0:
        return (
          <IndustryStep
            industries={industries}
            selectedIndustry={formikProps.values.industry}
            onSelect={(industry) => formikProps.setFieldValue("industry", industry)}
          />
        );
      case 1:
        return (
          <TemplateStep
            templates={templates.filter(
              (t) => t.industry === formikProps.values.industry
            )}
            selectedTemplate={formikProps.values.template}
            onSelect={(template) => formikProps.setFieldValue("template", template)}
          />
        );
      case 2:
        return <ConfigurationStep formik={formikProps} />;
      case 3:
        return <PromptStep formik={formikProps} />;
      case 4:
        return <EvaluationStep formik={formikProps} />;
      default:
        return null;
    }
  };

  return (
    <div class="max-w-2xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-4">Create New Agent</h1>
      <div class="flex justify-between mb-4">
        {steps.map((label, index) => (
          <div
            key={label}
            class={`${
              activeStep.value === index ? "bg-indigo-600" : "bg-gray-300"
            } w-1/5 py-2 text-center text-white rounded-lg`}
          >
            {label}
          </div>
        ))}
      </div>
      <Formik
        initialValues={{
          industry: "",
          template: "",
          name: "",
          description: "",
          systemPrompt: "",
          evaluationCriteria: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <Form class="space-y-6">
            <div class="mt-2">{getStepContent(activeStep.value, formikProps)}</div>
            <div class="flex justify-between mt-4">
              <button
                type="button"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                onClick={() => {
                  if (activeStep.value > 0) {
                    activeStep.value -= 1;
                  }
                }}
                disabled={activeStep.value === 0}
              >
                Back
              </button>
              <div>
                <button
                  type="button"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                  onClick={onClose}
                >
                  Cancel
                </button>
                {activeStep.value === steps.length - 1 ? (
                  <button
                    type="submit"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r"
                    disabled={!formikProps.isValid}
                  >
                    Create Agent
                  </button>
                ) : (
                  <button
                    type="button"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r"
                    onClick={() => {
                      if (activeStep.value < steps.length - 1) {
                        activeStep.value += 1;
                      }
                    }}
                    disabled={
                      !formikProps.values[steps[activeStep.value].toLowerCase()]
                    }
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
