import { Handlers, PageProps } from "$fresh/server.ts";
import { PuppeteerTools } from "../../utils/puppeteer.ts";
import WebTools from "../../islands/tools/WebTools.tsx";

interface ScreenshotData {
  url?: string;
  screenshot?: string;
  error?: string;
}

export const handler: Handlers<ScreenshotData> = {
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
      const outputPath = `./static/screenshots/screenshot-${timestamp}.png`;
      
      await PuppeteerTools.takeScreenshot(url, outputPath, true);
      
      return new Response(JSON.stringify({
        screenshot: `/screenshots/screenshot-${timestamp}.png`
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

export default function ScreenshotPage(props: PageProps) {
  return (
    <WebTools
      tool="screenshot"
      title="Website Screenshot Tool"
      description="Capture full-page screenshots of any website"
    />
  );
}
