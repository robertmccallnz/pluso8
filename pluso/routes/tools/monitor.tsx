import { Handlers, PageProps } from "$fresh/server.ts";
import { PuppeteerTools } from "../../utils/puppeteer.ts";

interface MonitorData {
  url?: string;
  results?: {
    performance: Record<string, number>;
    networkRequests: string[];
    console: {
      logs: string[];
      errors: string[];
    };
    accessibility: Record<string, {
      visible: boolean;
      clickable: boolean;
    }>;
  };
  error?: string;
}

export const handler: Handlers<MonitorData> = {
  async POST(req, ctx) {
    try {
      const form = await req.formData();
      const url = form.get("url")?.toString();
      
      if (!url) {
        return new Response(null, {
          status: 400,
          statusText: "URL is required"
        });
      }

      // Get performance metrics
      const performance = await PuppeteerTools.getPerformanceMetrics(url);

      // Get network requests
      const networkRequests = await PuppeteerTools.monitorNetworkRequests(url);

      // Test accessibility of important elements
      const accessibility = await PuppeteerTools.testElementsAccessibility(url, [
        'button',
        'a',
        'input',
        'nav',
        'main',
        'header',
        'footer'
      ]);

      return new Response(JSON.stringify({
        results: {
          performance,
          networkRequests,
          accessibility
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

export default function MonitorPage(props: PageProps<MonitorData>) {
  return (
    <div class="min-h-screen bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Site Monitor</h1>
          <p class="text-xl text-gray-600">
            Monitor website performance, network requests, and accessibility
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <form
            id="monitorForm"
            class="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
              const resultDiv = document.getElementById('result');
              const errorDiv = document.getElementById('error');
              
              submitBtn.disabled = true;
              submitBtn.textContent = 'Monitoring...';
              
              try {
                const response = await fetch('/tools/monitor', {
                  method: 'POST',
                  body: new FormData(form)
                });
                
                const data = await response.json();
                
                if (data.error) {
                  throw new Error(data.error);
                }
                
                if (resultDiv && data.results) {
                  const { performance, networkRequests, accessibility } = data.results;
                  
                  resultDiv.innerHTML = `
                    <div class="mt-6 space-y-8">
                      <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
                        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                          ${Object.entries(performance)
                            .map(([key, value]) => `
                              <div class="flex items-center justify-between">
                                <span class="font-medium">${key}:</span>
                                <span class="text-gray-600">${value}</span>
                              </div>
                            `).join('')}
                        </div>
                      </div>

                      <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Network Requests</h3>
                        <div class="bg-gray-50 rounded-lg p-4">
                          <ul class="list-disc list-inside space-y-1">
                            ${networkRequests.map(request => `
                              <li class="text-gray-600 truncate">${request}</li>
                            `).join('')}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Accessibility Check</h3>
                        <div class="bg-gray-50 rounded-lg p-4 space-y-4">
                          ${Object.entries(accessibility)
                            .map(([selector, status]) => `
                              <div>
                                <h4 class="font-medium mb-2">${selector}</h4>
                                <div class="grid grid-cols-2 gap-4">
                                  <div class="flex items-center">
                                    <span class="mr-2">Visible:</span>
                                    <span class="${status.visible ? 'text-green-600' : 'text-red-600'}">
                                      ${status.visible ? '✓' : '✗'}
                                    </span>
                                  </div>
                                  <div class="flex items-center">
                                    <span class="mr-2">Clickable:</span>
                                    <span class="${status.clickable ? 'text-green-600' : 'text-red-600'}">
                                      ${status.clickable ? '✓' : '✗'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            `).join('')}
                        </div>
                      </div>
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
                submitBtn.textContent = 'Start Monitoring';
              }
            }}
          >
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                name="url"
                required
                placeholder="https://example.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Start Monitoring
            </button>
          </form>

          <div id="error" class="mt-4 text-red-600 text-center"></div>
          <div id="result" class="mt-6"></div>
        </div>
      </div>
    </div>
  );
}
