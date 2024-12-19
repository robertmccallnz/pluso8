import { Tool } from '../types.ts';

export const webTools: Tool[] = [
  {
    temporaryTool: {
      modelToolName: 'takeScreenshot',
      description: 'Takes a screenshot of a webpage',
      dynamicParameters: [
        {
          name: 'url',
          type: 'string',
          description: 'The URL of the webpage to screenshot'
        },
        {
          name: 'fullPage',
          type: 'boolean',
          description: 'Whether to capture the full page or just the viewport'
        }
      ]
    }
  },
  {
    temporaryTool: {
      modelToolName: 'generatePDF',
      description: 'Generates a PDF from a webpage',
      dynamicParameters: [
        {
          name: 'url',
          type: 'string',
          description: 'The URL of the webpage to convert to PDF'
        }
      ]
    }
  },
  {
    temporaryTool: {
      modelToolName: 'scrapeContent',
      description: 'Extracts content from a webpage using CSS selectors',
      dynamicParameters: [
        {
          name: 'url',
          type: 'string',
          description: 'The URL of the webpage to scrape'
        },
        {
          name: 'selector',
          type: 'string',
          description: 'CSS selector to target specific content'
        }
      ]
    }
  },
  {
    temporaryTool: {
      modelToolName: 'analyzeSEO',
      description: 'Analyzes SEO aspects of a webpage',
      dynamicParameters: [
        {
          name: 'url',
          type: 'string',
          description: 'The URL of the webpage to analyze'
        }
      ]
    }
  },
  {
    temporaryTool: {
      modelToolName: 'fillForm',
      description: 'Fills and submits a form on a webpage',
      dynamicParameters: [
        {
          name: 'url',
          type: 'string',
          description: 'The URL of the webpage with the form'
        },
        {
          name: 'formData',
          type: 'object',
          description: 'Object containing selector-value pairs for form fields'
        }
      ]
    }
  },
  {
    temporaryTool: {
      modelToolName: 'monitorSite',
      description: 'Monitors website performance and accessibility',
      dynamicParameters: [
        {
          name: 'url',
          type: 'string',
          description: 'The URL of the webpage to monitor'
        }
      ]
    }
  }
];
