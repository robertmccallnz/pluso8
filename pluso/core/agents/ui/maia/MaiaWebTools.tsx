import { useCallback, useState } from "preact/hooks";

interface WebToolsProps {
  tool: 'screenshot' | 'pdf' | 'scraper' | 'seo' | 'form' | 'monitor';
  url: string;
  options?: Record<string, any>;
}

export function useMaiaWebTools() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const runWebTool = useCallback(async ({ tool, url, options = {} }: WebToolsProps) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/agents/TECH_ASST_MAIA_0001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: getToolPrompt(tool, url, options),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to execute web tool");
      }

      const data = await response.json();
      setResult(data.message.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { runWebTool, loading, error, result };
}

function getToolPrompt(tool: string, url: string, options: Record<string, any>): string {
  switch (tool) {
    case 'screenshot':
      return `Please take a screenshot of ${url}. ${options.fullPage ? 'Capture the full page.' : ''}`;
      
    case 'pdf':
      return `Please generate a PDF of ${url}`;
      
    case 'scraper':
      return `Please extract content from ${url} using the CSS selector "${options.selector}"`;
      
    case 'seo':
      return `Please analyze the SEO of ${url}. Check meta tags, headings, links, and images.`;
      
    case 'form':
      return `Please fill the form at ${url} with the following data: ${JSON.stringify(options.formData)}`;
      
    case 'monitor':
      return `Please monitor ${url} for performance, network requests, and accessibility.`;
      
    default:
      throw new Error('Invalid tool specified');
  }
}
