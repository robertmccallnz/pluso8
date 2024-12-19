import { Handlers, PageProps } from "$fresh/server.ts";
import { PuppeteerTools } from "../../utils/puppeteer.ts";

interface PDFData {
  url?: string;
  pdf?: string;
  error?: string;
}

export const handler: Handlers<PDFData> = {
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

      const timestamp = new Date().getTime();
      const outputPath = `./static/pdfs/webpage-${timestamp}.pdf`;
      
      await PuppeteerTools.generatePDF(url, outputPath);
      
      return new Response(JSON.stringify({
        pdf: `/pdfs/webpage-${timestamp}.pdf`
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

export default function PDFPage(props: PageProps<PDFData>) {
  return (
    <div class="min-h-screen bg-gray-50 py-20">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Website to PDF Converter</h1>
          <p class="text-xl text-gray-600">
            Convert any webpage to a downloadable PDF document
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <form
            id="pdfForm"
            class="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
              const resultDiv = document.getElementById('result');
              const errorDiv = document.getElementById('error');
              
              submitBtn.disabled = true;
              submitBtn.textContent = 'Converting...';
              
              try {
                const response = await fetch('/tools/pdf', {
                  method: 'POST',
                  body: new FormData(form)
                });
                
                const data = await response.json();
                
                if (data.error) {
                  throw new Error(data.error);
                }
                
                if (resultDiv && data.pdf) {
                  resultDiv.innerHTML = `
                    <div class="mt-6 text-center">
                      <p class="text-green-600 mb-4">PDF generated successfully!</p>
                      <a 
                        href="${data.pdf}" 
                        download 
                        class="inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                      >
                        Download PDF
                      </a>
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
                submitBtn.textContent = 'Generate PDF';
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
              Generate PDF
            </button>
          </form>

          <div id="error" class="mt-4 text-red-600 text-center"></div>
          <div id="result" class="mt-6"></div>
        </div>
      </div>
    </div>
  );
}
