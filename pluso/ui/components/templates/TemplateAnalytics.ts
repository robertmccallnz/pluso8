import { AgentTemplate } from './AgentTemplates';
import { MEMBERSHIP_TEMPLATES, CustomizationOption } from './MembershipTemplates';

interface TemplateUsageMetrics {
  deploymentCount: number;
  activeInstances: number;
  averageUptime: number;
  userRating: number;
  successRate: number;
}

interface PerformanceMetrics {
  responseTime: number;
  taskCompletionRate: number;
  userSatisfaction: number;
  resourceEfficiency: number;
  costPerOperation: number;
}

interface CustomizationMetrics {
  optionUsage: Record<string, number>;
  popularCombinations: Array<{
    options: Record<string, any>;
    count: number;
    performance: number;
  }>;
}

export class TemplateAnalytics {
  private usageData: Map<string, TemplateUsageMetrics> = new Map();
  private performanceData: Map<string, PerformanceMetrics> = new Map();
  private customizationData: Map<string, CustomizationMetrics> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    Object.keys(MEMBERSHIP_TEMPLATES).forEach(templateId => {
      this.usageData.set(templateId, {
        deploymentCount: 0,
        activeInstances: 0,
        averageUptime: 0,
        userRating: 0,
        successRate: 0
      });

      this.performanceData.set(templateId, {
        responseTime: 0,
        taskCompletionRate: 0,
        userSatisfaction: 0,
        resourceEfficiency: 0,
        costPerOperation: 0
      });

      this.customizationData.set(templateId, {
        optionUsage: {},
        popularCombinations: []
      });
    });
  }

  recordTemplateUsage(
    templateId: string,
    metrics: Partial<TemplateUsageMetrics>
  ): void {
    const current = this.usageData.get(templateId) || {
      deploymentCount: 0,
      activeInstances: 0,
      averageUptime: 0,
      userRating: 0,
      successRate: 0
    };

    this.usageData.set(templateId, { ...current, ...metrics });
  }

  recordPerformance(
    templateId: string,
    metrics: Partial<PerformanceMetrics>
  ): void {
    const current = this.performanceData.get(templateId) || {
      responseTime: 0,
      taskCompletionRate: 0,
      userSatisfaction: 0,
      resourceEfficiency: 0,
      costPerOperation: 0
    };

    this.performanceData.set(templateId, { ...current, ...metrics });
  }

  recordCustomization(
    templateId: string,
    options: Record<string, any>
  ): void {
    const data = this.customizationData.get(templateId);
    if (!data) return;

    // Update option usage
    Object.entries(options).forEach(([key, value]) => {
      data.optionUsage[key] = (data.optionUsage[key] || 0) + 1;
    });

    // Update popular combinations
    const combinationStr = JSON.stringify(options);
    const existingCombination = data.popularCombinations.find(
      c => JSON.stringify(c.options) === combinationStr
    );

    if (existingCombination) {
      existingCombination.count++;
    } else {
      data.popularCombinations.push({
        options,
        count: 1,
        performance: 0
      });
    }

    this.customizationData.set(templateId, data);
  }

  getTemplateComparison(templateIds: string[]): {
    usage: Record<string, TemplateUsageMetrics>;
    performance: Record<string, PerformanceMetrics>;
    recommendations: string[];
  } {
    const usage: Record<string, TemplateUsageMetrics> = {};
    const performance: Record<string, PerformanceMetrics> = {};
    const recommendations: string[] = [];

    templateIds.forEach(id => {
      usage[id] = this.usageData.get(id) || {
        deploymentCount: 0,
        activeInstances: 0,
        averageUptime: 0,
        userRating: 0,
        successRate: 0
      };

      performance[id] = this.performanceData.get(id) || {
        responseTime: 0,
        taskCompletionRate: 0,
        userSatisfaction: 0,
        resourceEfficiency: 0,
        costPerOperation: 0
      };
    });

    // Generate recommendations
    templateIds.forEach(id => {
      const perf = performance[id];
      const template = MEMBERSHIP_TEMPLATES[id];

      if (perf.taskCompletionRate < 0.8) {
        recommendations.push(
          `Consider optimizing task handling for ${template.name}`
        );
      }

      if (perf.userSatisfaction < 0.7) {
        recommendations.push(
          `Review user feedback for ${template.name} to improve satisfaction`
        );
      }

      if (perf.costPerOperation > 0.5) {
        recommendations.push(
          `Look into cost optimization opportunities for ${template.name}`
        );
      }
    });

    return { usage, performance, recommendations };
  }

  getCustomizationInsights(templateId: string): {
    popularOptions: Record<string, number>;
    bestPerformingCombinations: Array<{
      options: Record<string, any>;
      performance: number;
    }>;
    recommendations: string[];
  } {
    const data = this.customizationData.get(templateId);
    if (!data) {
      return {
        popularOptions: {},
        bestPerformingCombinations: [],
        recommendations: []
      };
    }

    // Sort combinations by performance
    const sortedCombinations = [...data.popularCombinations]
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 5);

    const recommendations: string[] = [];

    // Analyze option usage patterns
    Object.entries(data.optionUsage).forEach(([option, usage]) => {
      const totalUsage = Object.values(data.optionUsage).reduce(
        (sum, count) => sum + count,
        0
      );
      const usagePercentage = (usage / totalUsage) * 100;

      if (usagePercentage > 80) {
        recommendations.push(
          `Consider making "${option}" a default setting due to high usage`
        );
      }
      if (usagePercentage < 20) {
        recommendations.push(
          `Review the necessity of "${option}" due to low usage`
        );
      }
    });

    return {
      popularOptions: data.optionUsage,
      bestPerformingCombinations: sortedCombinations,
      recommendations
    };
  }

  generateReport(templateId: string): {
    summary: string;
    metrics: {
      usage: TemplateUsageMetrics;
      performance: PerformanceMetrics;
      customization: CustomizationMetrics;
    };
    insights: string[];
    recommendations: string[];
  } {
    const usage = this.usageData.get(templateId);
    const performance = this.performanceData.get(templateId);
    const customization = this.customizationData.get(templateId);
    const template = MEMBERSHIP_TEMPLATES[templateId];

    if (!usage || !performance || !customization || !template) {
      throw new Error('Template data not found');
    }

    const insights: string[] = [];
    const recommendations: string[] = [];

    // Analyze usage patterns
    if (usage.activeInstances / usage.deploymentCount < 0.5) {
      insights.push('Low active instance ratio detected');
      recommendations.push('Investigate reasons for template abandonment');
    }

    // Analyze performance
    if (performance.responseTime > 1000) {
      insights.push('Higher than average response times');
      recommendations.push('Optimize agent communication patterns');
    }

    // Analyze customization patterns
    const popularOptions = Object.entries(customization.optionUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([option]) => option);

    insights.push(`Most used customization options: ${popularOptions.join(', ')}`);

    const summary = [
      `Template: ${template.name}`,
      `Active Instances: ${usage.activeInstances}`,
      `Success Rate: ${(usage.successRate * 100).toFixed(1)}%`,
      `User Rating: ${usage.userRating.toFixed(1)}/5`,
      `Task Completion Rate: ${(performance.taskCompletionRate * 100).toFixed(1)}%`
    ].join('\\n');

    return {
      summary,
      metrics: { usage, performance, customization },
      insights,
      recommendations
    };
  }
}
