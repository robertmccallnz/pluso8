import { Handlers, PageProps } from "$fresh/server.ts";
import { PuppeteerTools } from "../../utils/puppeteer.ts";

interface FormData {
  url?: string;
  formFields?: Record<string, string>;
  submitSelector?: string;
  result?: {
    success: boolean;
    message: string;
  };
  error?: string;
}

export const handler: Handlers<FormData> = {
  async POST(req, ctx) {
    try {
      const form = await req.formData();
      const url = form.get("url")?.toString();
      const submitSelector = form.get("submitSelector")?.toString();
      const formFieldsJson = form.get("formFields")?.toString();
      
      if (!url || !submitSelector || !formFieldsJson) {
        return new Response(null, {
          status: 400,
          statusText: "URL, submit selector, and form fields are required"
        });
      }

      const formFields = JSON.parse(formFieldsJson);
      
      await PuppeteerTools.fillForm(url, formFields, submitSelector);
      
      return new Response(JSON.stringify({
        result: {
          success: true,
          message: "Form submitted successfully"
        }
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};

export default function FormFillerPage(props: PageProps<FormData>) {
  return (
    <div class="min-h-screen bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Form Filler</h1>
          <p class="text-xl text-gray-600">
            Automatically fill and submit web forms
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <form
            id="formFillerForm"
            class="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
              const resultDiv = document.getElementById('result');
              const errorDiv = document.getElementById('error');
              
              submitBtn.disabled = true;
              submitBtn.textContent = 'Submitting...';
              
              try {
                // Get all form field inputs
                const fieldRows = document.querySelectorAll('.form-field-row');
                const formFields: Record<string, string> = {};
                
                fieldRows.forEach((row) => {
                  const selector = (row.querySelector('[name="selector"]') as HTMLInputElement).value;
                  const value = (row.querySelector('[name="value"]') as HTMLInputElement).value;
                  if (selector && value) {
                    formFields[selector] = value;
                  }
                });

                const formData = new FormData();
                formData.append('url', (form.querySelector('[name="url"]') as HTMLInputElement).value);
                formData.append('submitSelector', (form.querySelector('[name="submitSelector"]') as HTMLInputElement).value);
                formData.append('formFields', JSON.stringify(formFields));

                const response = await fetch('/tools/form-filler', {
                  method: 'POST',
                  body: formData
                });
                
                const data = await response.json();
                
                if (data.error) {
                  throw new Error(data.error);
                }
                
                if (resultDiv && data.result) {
                  resultDiv.innerHTML = `
                    <div class="mt-6 p-4 bg-green-50 rounded-lg">
                      <p class="text-green-700">${data.result.message}</p>
                    </div>
                  `;
                }
                
                if (errorDiv) {
                  errorDiv.textContent = '';
                }
              } catch (error) {
                if (errorDiv) {
                  errorDiv.textContent = error.message;
                }
                if (resultDiv) {
                  resultDiv.innerHTML = '';
                }
              } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Fill Form';
              }
            }}
          >
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Target Website URL
              </label>
              <input
                type="url"
                name="url"
                required
                placeholder="https://example.com/form"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Submit Button Selector
              </label>
              <input
                type="text"
                name="submitSelector"
                required
                placeholder="#submit-button, button[type='submit']"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              <p class="mt-1 text-sm text-gray-500">CSS selector for the submit button</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-4">
                Form Fields
              </label>
              <div id="formFields" class="space-y-4">
                <div class="form-field-row grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="selector"
                      placeholder="#email, input[name='email']"
                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    <p class="mt-1 text-sm text-gray-500">Field Selector</p>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="value"
                      placeholder="Value to fill"
                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    <p class="mt-1 text-sm text-gray-500">Field Value</p>
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                class="mt-4 text-sm text-primary-600 hover:text-primary-700"
                onClick={() => {
                  const formFields = document.getElementById('formFields');
                  if (formFields) {
                    const newRow = formFields.children[0].cloneNode(true) as HTMLElement;
                    const inputs = newRow.querySelectorAll('input');
                    inputs.forEach(input => input.value = '');
                    formFields.appendChild(newRow);
                  }
                }}
              >
                + Add Another Field
              </button>
            </div>
            
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Fill Form
            </button>
          </form>

          <div id="error" class="mt-4 text-red-600 text-center"></div>
          <div id="result" class="mt-6"></div>
        </div>
      </div>
    </div>
  );
}
