import { useState } from "preact/hooks";
import { useMaiaWebTools } from "../MaiaWebTools.tsx";

interface WebToolsProps {
  tool: 'screenshot' | 'pdf' | 'scraper' | 'seo' | 'form' | 'monitor';
  title: string;
  description: string;
}

export default function WebTools({ tool, title, description }: WebToolsProps) {
  const [url, setUrl] = useState('');
  const [selector, setSelector] = useState('');
  const [formFields, setFormFields] = useState<Record<string, string>>({});
  const { runWebTool, loading, error, result } = useMaiaWebTools();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    const options: Record<string, any> = {};
    
    if (tool === 'scraper') {
      options.selector = selector;
    } else if (tool === 'form') {
      options.formData = formFields;
    }
    
    await runWebTool({ tool, url, options });
  };

  const renderToolSpecificInputs = () => {
    switch (tool) {
      case 'scraper':
        return (
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              CSS Selector
            </label>
            <input
              type="text"
              value={selector}
              onInput={(e) => setSelector((e.target as HTMLInputElement).value)}
              placeholder=".article-content, h1.title"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        );
        
      case 'form':
        return (
          <div class="mt-4 space-y-4">
            <div id="formFields">
              {Object.entries(formFields).map(([selector, value], index) => (
                <div key={index} class="grid grid-cols-2 gap-4 mb-2">
                  <input
                    type="text"
                    value={selector}
                    placeholder="CSS Selector"
                    onInput={(e) => {
                      const newFields = { ...formFields };
                      delete newFields[selector];
                      newFields[(e.target as HTMLInputElement).value] = value;
                      setFormFields(newFields);
                    }}
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  <input
                    type="text"
                    value={value}
                    placeholder="Value"
                    onInput={(e) => {
                      setFormFields({
                        ...formFields,
                        [selector]: (e.target as HTMLInputElement).value
                      });
                    }}
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setFormFields({ ...formFields, '': '' })}
              class="text-sm text-primary-600 hover:text-primary-700"
            >
              + Add Field
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div class="min-h-screen bg-gray-50 py-20">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p class="text-xl text-gray-600">{description}</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={url}
                onInput={(e) => setUrl((e.target as HTMLInputElement).value)}
                required
                placeholder="https://example.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {renderToolSpecificInputs()}
            
            <button
              type="submit"
              disabled={loading}
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Run Tool'}
            </button>
          </form>

          {error && (
            <div class="mt-4 p-4 bg-red-50 rounded-lg">
              <p class="text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div class="mt-6 space-y-4">
              <h3 class="text-lg font-medium text-gray-900">Results</h3>
              <div class="bg-gray-50 rounded-lg p-4">
                <pre class="whitespace-pre-wrap text-sm text-gray-600">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
              {result.downloadUrl && (
                <a
                  href={result.downloadUrl}
                  download
                  class="inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  Download Result
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
