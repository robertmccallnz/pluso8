import { Handlers, PageProps } from "$fresh/server.ts";
import { PuppeteerTools } from "../../utils/puppeteer.ts";

interface ScraperData {
  url?: string;
  selector?: string;
  content?: string[];
  error?: string;
}

export const handler: Handlers<ScraperData> = {
  async POST(req, ctx) {
    try {
      const form = await req.formData();
      const url = form.get("url")?.toString();
      const selector = form.get("selector")?.toString();
      
      if (!url || !selector) {
        return new Response(null, {
          status: 400,
          statusText: "URL and selector are required"
        });
      }

      const content = await PuppeteerTools.extractContent(url, selector);
      
      return new Response(JSON.stringify({ content }), {
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

export default function ScraperPage(props: PageProps<ScraperData>) {
  return (
    <div class="min-h-screen bg-gray-50 py-20">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Web Content Scraper</h1>
          <p class="text-xl text-gray-600">
            Extract content from any website using CSS selectors
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <form
            id="scraperForm"
            class="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
              const resultDiv = document.getElementById('result');
              const errorDiv = document.getElementById('error');
              
              submitBtn.disabled = true;
              submitBtn.textContent = 'Extracting...';
              
              try {
                const response = await fetch('/tools/scraper', {
                  method: 'POST',
                  body: new FormData(form)
                });
                
                const data = await response.json();
                
                if (data.error) {
                  throw new Error(data.error);
                }
                
                if (resultDiv && data.content) {
                  const contentHtml = data.content
                    .map(item => `<li class="py-2 border-b last:border-b-0">${item}</li>`)
                    .join('');
                    
                  resultDiv.innerHTML = `
                    <div class="mt-6">
                      <h3 class="text-lg font-medium text-gray-900 mb-4">Extracted Content</h3>
                      <ul class="bg-gray-50 rounded-lg p-4">
                        ${contentHtml}
                      </ul>
                      <button
                        onclick="navigator.clipboard.writeText(${JSON.stringify(data.content.join('\n'))})"
                        class="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Copy to Clipboard
                      </button>
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
                submitBtn.textContent = 'Extract Content';
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
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                CSS Selector
              </label>
              <input
                type="text"
                name="selector"
                required
                placeholder=".article-content p, h1.title"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              <p class="mt-2 text-sm text-gray-500">
                Enter CSS selectors to target specific elements (e.g., "p" for paragraphs, ".class" for classes)
              </p>
            </div>
            
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Extract Content
            </button>
          </form>

          <div id="error" class="mt-4 text-red-600 text-center"></div>
          <div id="result" class="mt-6"></div>
        </div>
      </div>
    </div>
  );
}
