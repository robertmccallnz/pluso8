import { PromptTemplate, TemplateAnalytics } from "./IndustryTemplates";

interface TemplateScore {
  template: PromptTemplate;
  score: number;
  reasons: string[];
}

export class TemplateRecommender {
  private static instance: TemplateRecommender;
  private recentlyUsedTemplates: Set<string> = new Set();
  private userPreferences: Map<string, number> = new Map(); // category/industry -> weight

  private constructor() {}

  static getInstance(): TemplateRecommender {
    if (!this.instance) {
      this.instance = new TemplateRecommender();
    }
    return this.instance;
  }

  updateUserPreference(category: string, weight: number): void {
    this.userPreferences.set(category, Math.max(0, Math.min(1, weight)));
  }

  recordTemplateUse(templateId: string): void {
    this.recentlyUsedTemplates.add(templateId);
    if (this.recentlyUsedTemplates.size > 50) {
      const [firstItem] = this.recentlyUsedTemplates;
      this.recentlyUsedTemplates.delete(firstItem);
    }
  }

  private calculateTemplateScore(
    template: PromptTemplate,
    analytics: TemplateAnalytics | undefined,
    userContext: {
      industry?: string;
      category?: string;
      recentCategories?: string[];
      recentIndustries?: string[];
    }
  ): TemplateScore {
    const score: TemplateScore = {
      template,
      score: 0,
      reasons: [],
    };

    // Base score components
    const components: { value: number; weight: number; reason: string }[] = [];

    // Success rate score
    if (analytics?.successRate) {
      const successScore = analytics.successRate * 100;
      components.push({
        value: successScore,
        weight: 0.3,
        reason: `${successScore.toFixed(1)}% success rate`,
      });
    }

    // Industry match
    if (userContext.industry && template.industry === userContext.industry) {
      components.push({
        value: 100,
        weight: 0.25,
        reason: `Matches your industry (${template.industry})`,
      });
    }

    // Category match
    if (userContext.category && template.category === userContext.category) {
      components.push({
        value: 100,
        weight: 0.2,
        reason: `Matches your category (${template.category})`,
      });
    }

    // Recent usage popularity
    if (analytics?.totalUses) {
      const recentUsageScore = Math.min(analytics.totalUses / 100, 1) * 100;
      components.push({
        value: recentUsageScore,
        weight: 0.15,
        reason: `Popular template with ${analytics.totalUses} recent uses`,
      });
    }

    // User preference alignment
    const preferenceWeight = this.userPreferences.get(template.category) || 0;
    if (preferenceWeight > 0) {
      components.push({
        value: preferenceWeight * 100,
        weight: 0.1,
        reason: `Aligns with your preferences in ${template.category}`,
      });
    }

    // Calculate weighted average
    const totalWeight = components.reduce((sum, comp) => sum + comp.weight, 0);
    score.score = components.reduce(
      (sum, comp) => sum + (comp.value * comp.weight) / totalWeight,
      0
    );
    score.reasons = components.map((comp) => comp.reason);

    return score;
  }

  getRecommendations(
    templates: PromptTemplate[],
    context: {
      industry?: string;
      category?: string;
      recentCategories?: string[];
      recentIndustries?: string[];
      limit?: number;
    }
  ): TemplateScore[] {
    const scores: TemplateScore[] = templates
      .filter((template) => !this.recentlyUsedTemplates.has(template.id))
      .map((template) =>
        this.calculateTemplateScore(template, template.analytics, context)
      )
      .sort((a, b) => b.score - a.score);

    return scores.slice(0, context.limit || 5);
  }

  getSimilarTemplates(
    templateId: string,
    templates: PromptTemplate[],
    limit: number = 3
  ): PromptTemplate[] {
    const sourceTemplate = templates.find((t) => t.id === templateId);
    if (!sourceTemplate) return [];

    const scored = templates
      .filter((t) => t.id !== templateId)
      .map((template) => {
        let similarity = 0;
        const reasons: string[] = [];

        // Category match
        if (template.category === sourceTemplate.category) {
          similarity += 0.4;
          reasons.push("Same category");
        }

        // Industry match
        if (template.industry === sourceTemplate.industry) {
          similarity += 0.3;
          reasons.push("Same industry");
        }

        // Variable overlap
        const sourceVars = new Set(
          sourceTemplate.prompt.match(/\{\{([^}]+)\}\}/g) || []
        );
        const targetVars = new Set(
          template.prompt.match(/\{\{([^}]+)\}\}/g) || []
        );
        const overlap = [...sourceVars].filter((v) => targetVars.has(v)).length;
        if (overlap > 0) {
          similarity += 0.3 * (overlap / Math.max(sourceVars.size, targetVars.size));
          reasons.push(`${overlap} shared variables`);
        }

        return { template, similarity, reasons };
      })
      .sort((a, b) => b.similarity - a.similarity);

    return scored.slice(0, limit).map((s) => s.template);
  }
}
