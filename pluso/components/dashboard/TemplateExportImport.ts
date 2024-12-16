import { PromptTemplate, TemplateVersion, TemplateAnalytics, TemplateShare } from "./IndustryTemplates";

export interface TemplateExport {
  version: string;
  exportedAt: string;
  templates: PromptTemplate[];
  versions: Record<string, TemplateVersion[]>;
  analytics: Record<string, TemplateAnalytics>;
  shares: Record<string, TemplateShare>;
}

export class TemplateExportImport {
  static readonly EXPORT_VERSION = "1.0.0";

  static exportTemplates(templates: PromptTemplate[], includeAnalytics: boolean = false): string {
    const exportData: TemplateExport = {
      version: this.EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      templates,
      versions: {},
      analytics: {},
      shares: {},
    };

    if (includeAnalytics) {
      templates.forEach(template => {
        if (template.versions) {
          exportData.versions[template.id] = template.versions;
        }
        if (template.analytics) {
          exportData.analytics[template.id] = template.analytics;
        }
        if (template.sharing) {
          exportData.shares[template.id] = template.sharing;
        }
      });
    }

    return JSON.stringify(exportData, null, 2);
  }

  static validateImport(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.version || !data.exportedAt || !Array.isArray(data.templates)) {
      errors.push("Invalid export format");
      return { valid: false, errors };
    }

    if (data.version !== this.EXPORT_VERSION) {
      errors.push(`Unsupported export version: ${data.version}`);
    }

    data.templates.forEach((template: any, index: number) => {
      if (!template.id || !template.name || !template.prompt) {
        errors.push(`Template at index ${index} is missing required fields`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static importTemplates(jsonData: string): { success: boolean; templates: PromptTemplate[]; errors: string[] } {
    try {
      const data = JSON.parse(jsonData);
      const validation = this.validateImport(data);

      if (!validation.valid) {
        return {
          success: false,
          templates: [],
          errors: validation.errors,
        };
      }

      // Generate new IDs for imported templates to avoid conflicts
      const templates = data.templates.map((template: PromptTemplate) => ({
        ...template,
        id: crypto.randomUUID(),
        importedAt: new Date().toISOString(),
      }));

      return {
        success: true,
        templates,
        errors: [],
      };
    } catch (error) {
      return {
        success: false,
        templates: [],
        errors: ["Invalid JSON format"],
      };
    }
  }

  static exportToFile(templates: PromptTemplate[], filename: string, includeAnalytics: boolean = false): void {
    const exportData = this.exportTemplates(templates, includeAnalytics);
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "templates-export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
