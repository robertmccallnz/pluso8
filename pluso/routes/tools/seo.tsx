import { Handlers, PageProps } from "$fresh/server.ts";
import { PuppeteerTools } from "../../utils/puppeteer.ts";

interface SEOData {
  url?: string;
  results?: {
    metaTags: Record<string, string | null>;
    performance: Record<string, number>;
    headings: string[];
    links: {
      internal: number;
      external: number;
      broken: number;
    };
    images: {
      total: number;
      withAlt: number;
      withoutAlt: number;
    };
  };
  error?: string;
}

export const handler: Handlers<SEOData> = {
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

      // Get meta tags
      const metaTags = await PuppeteerTools.analyzeSEOMetaTags(url, [
        'title',
        'description',
        'keywords',
        'robots',
        'viewport',
        'og:title',
        'og:description',
        'twitter:card',
        'twitter:title',
        'twitter:description'
      ]);

      // Get performance metrics
      const performance = await PuppeteerTools.getPerformanceMetrics(url);

      // Get headings
      const headings = await PuppeteerTools.extractContent(url, 'h1, h2, h3');

      // Get link analysis
      const linkAnalysis = await PuppeteerTools.analyzeSEOLinks(url);

      // Get image analysis
      const imageAnalysis = await PuppeteerTools.analyzeSEOImages(url);

      return new Response(JSON.stringify({
        results: {
          metaTags,
          performance,
          headings,
          links: linkAnalysis,
          images: imageAnalysis
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

export default function SEOPage(props: PageProps<SEOData>) {
  return (
    <div class="min-h-screen bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">SEO Analyzer</h1>
          <p class="text-xl text-gray-600">
            Analyze your website's SEO performance and get detailed insights
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <form
            id="seoForm"
            class="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
              const resultDiv = document.getElementById('result');
              const errorDiv = document.getElementById('error');
              
              submitBtn.disabled = true;
              submitBtn.textContent = 'Analyzing...';
              
              try {
                const response = await fetch('/tools/seo', {
                  method: 'POST',
                  body: new FormData(form)
                });
                
                const data = await response.json();
                
                if (data.error) {
                  throw new Error(data.error);
                }
                
                if (resultDiv && data.results) {
                  const { metaTags, performance, headings, links, images } = data.results;
                  
                  resultDiv.innerHTML = `
                    <div class="mt-6 space-y-8">
                      <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Meta Tags</h3>
                        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                          ${Object.entries(metaTags)
                            .map(([key, value]) => `
                              <div class="flex items-center justify-between">
                                <span class="font-medium">${key}:</span>
                                <span class="text-gray-600">${value || 'Not found'}</span>
                              </div>
                            `).join('')}
                        </div>
                      </div>

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
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Headings Structure</h3>
                        <div class="bg-gray-50 rounded-lg p-4">
                          <ul class="list-disc list-inside space-y-1">
                            ${headings.map(heading => `
                              <li class="text-gray-600">${heading}</li>
                            `).join('')}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Link Analysis</h3>
                        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div class="flex items-center justify-between">
                            <span class="font-medium">Internal Links:</span>
                            <span class="text-gray-600">${links.internal}</span>
                          </div>
                          <div class="flex items-center justify-between">
                            <span class="font-medium">External Links:</span>
                            <span class="text-gray-600">${links.external}</span>
                          </div>
                          <div class="flex items-center justify-between">
                            <span class="font-medium">Broken Links:</span>
                            <span class="text-red-600">${links.broken}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Image Analysis</h3>
                        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div class="flex items-center justify-between">
                            <span class="font-medium">Total Images:</span>
                            <span class="text-gray-600">${images.total}</span>
                          </div>
                          <div class="flex items-center justify-between">
                            <span class="font-medium">Images with Alt Text:</span>
                            <span class="text-green-600">${images.withAlt}</span>
                          </div>
                          <div class="flex items-center justify-between">
                            <span class="font-medium">Images without Alt Text:</span>
                            <span class="text-red-600">${images.withoutAlt}</span>
                          </div>
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
                submitBtn.textContent = 'Analyze SEO';
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
              Analyze SEO
            </button>
          </form>

          <div id="error" class="mt-4 text-red-600 text-center"></div>
          <div id="result" class="mt-6"></div>
        </div>
      </div>
    </div>
  );
}
