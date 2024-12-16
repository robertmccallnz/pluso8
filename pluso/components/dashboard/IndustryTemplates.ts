export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  prompt: string;
  responseTemplate?: string;
  isCustom?: boolean;
  industry: string;
  createdAt?: string;
  updatedAt?: string;
  version: number;
  versions?: TemplateVersion[];
  analytics?: TemplateAnalytics;
  sharing?: TemplateShare;
  author?: string;
  organization?: string;
}

export interface TemplateVersion {
  id: string;
  templateId: string;
  version: number;
  changes: string;
  prompt: string;
  responseTemplate?: string;
  createdAt: string;
  createdBy?: string;
}

export interface TemplateAnalytics {
  uses: number;
  successRate: number;
  averageTokens: number;
  averageCost: number;
  lastUsed?: string;
  popularVariables: Record<string, number>;
  industryUsage: Record<string, number>;
}

export interface TemplateShare {
  id: string;
  templateId: string;
  shareType: "public" | "private" | "organization";
  accessCode?: string;
  sharedBy: string;
  sharedAt: string;
  expiresAt?: string;
  usageLimit?: number;
  currentUses: number;
}

export type TemplateCategory = 
  | "marketing"
  | "operations"
  | "analysis"
  | "documentation"
  | "training"
  | "customer-service"
  | "analytics"
  | "custom";

export interface IndustryTemplates {
  promptTemplates: PromptTemplate[];
  commonVariables?: Record<string, string>;
}

// Template Management System
export class TemplateManager {
  private static instance: TemplateManager;
  private customTemplates: Record<string, PromptTemplate>;
  private templateVersions: Record<string, TemplateVersion[]>;
  private templateAnalytics: Record<string, TemplateAnalytics>;
  private templateShares: Record<string, TemplateShare>;

  private constructor() {
    this.customTemplates = JSON.parse(localStorage.getItem("customTemplates") || "{}");
    this.templateVersions = JSON.parse(localStorage.getItem("templateVersions") || "{}");
    this.templateAnalytics = JSON.parse(localStorage.getItem("templateAnalytics") || "{}");
    this.templateShares = JSON.parse(localStorage.getItem("templateShares") || "{}");
  }

  public static getInstance(): TemplateManager {
    if (!TemplateManager.instance) {
      TemplateManager.instance = new TemplateManager();
    }
    return TemplateManager.instance;
  }

  public saveTemplate(template: PromptTemplate): void {
    const id = template.id || crypto.randomUUID();
    const now = new Date().toISOString();
    
    // Create new version
    const version: TemplateVersion = {
      id: crypto.randomUUID(),
      templateId: id,
      version: (template.version || 0) + 1,
      changes: "Initial version",
      prompt: template.prompt,
      responseTemplate: template.responseTemplate,
      createdAt: now,
      createdBy: template.author,
    };

    // Initialize analytics
    const analytics: TemplateAnalytics = {
      uses: 0,
      successRate: 0,
      averageTokens: 0,
      averageCost: 0,
      popularVariables: {},
      industryUsage: {},
    };

    this.customTemplates[id] = {
      ...template,
      id,
      isCustom: true,
      createdAt: template.createdAt || now,
      updatedAt: now,
      version: version.version,
    };

    this.templateVersions[id] = [version];
    this.templateAnalytics[id] = analytics;
    
    this.persistAll();
  }

  public createVersion(templateId: string, changes: string, prompt: string, responseTemplate?: string): void {
    const template = this.customTemplates[templateId];
    if (!template) return;

    const version: TemplateVersion = {
      id: crypto.randomUUID(),
      templateId,
      version: template.version + 1,
      changes,
      prompt,
      responseTemplate,
      createdAt: new Date().toISOString(),
      createdBy: template.author,
    };

    this.templateVersions[templateId] = [
      version,
      ...(this.templateVersions[templateId] || []),
    ];

    template.version = version.version;
    template.prompt = prompt;
    template.responseTemplate = responseTemplate;
    template.updatedAt = version.createdAt;

    this.persistAll();
  }

  public shareTemplate(
    templateId: string,
    shareType: "public" | "private" | "organization",
    options?: {
      accessCode?: string;
      expiresAt?: string;
      usageLimit?: number;
    }
  ): TemplateShare {
    const template = this.customTemplates[templateId];
    if (!template) throw new Error("Template not found");

    const share: TemplateShare = {
      id: crypto.randomUUID(),
      templateId,
      shareType,
      accessCode: options?.accessCode,
      sharedBy: template.author || "anonymous",
      sharedAt: new Date().toISOString(),
      expiresAt: options?.expiresAt,
      usageLimit: options?.usageLimit,
      currentUses: 0,
    };

    this.templateShares[share.id] = share;
    this.persistAll();

    return share;
  }

  public updateAnalytics(templateId: string, usage: {
    success: boolean;
    tokens: number;
    cost: number;
    variables: string[];
    industry: string;
  }): void {
    const analytics = this.templateAnalytics[templateId];
    if (!analytics) return;

    analytics.uses++;
    analytics.successRate = ((analytics.successRate * (analytics.uses - 1)) + (usage.success ? 1 : 0)) / analytics.uses;
    analytics.averageTokens = ((analytics.averageTokens * (analytics.uses - 1)) + usage.tokens) / analytics.uses;
    analytics.averageCost = ((analytics.averageCost * (analytics.uses - 1)) + usage.cost) / analytics.uses;
    analytics.lastUsed = new Date().toISOString();

    // Update variable popularity
    usage.variables.forEach(variable => {
      analytics.popularVariables[variable] = (analytics.popularVariables[variable] || 0) + 1;
    });

    // Update industry usage
    analytics.industryUsage[usage.industry] = (analytics.industryUsage[usage.industry] || 0) + 1;

    this.persistAll();
  }

  public getTemplateVersions(templateId: string): TemplateVersion[] {
    return this.templateVersions[templateId] || [];
  }

  public getTemplateAnalytics(templateId: string): TemplateAnalytics | undefined {
    return this.templateAnalytics[templateId];
  }

  public getTemplateShare(shareId: string): TemplateShare | undefined {
    return this.templateShares[shareId];
  }

  private persistAll(): void {
    localStorage.setItem("customTemplates", JSON.stringify(this.customTemplates));
    localStorage.setItem("templateVersions", JSON.stringify(this.templateVersions));
    localStorage.setItem("templateAnalytics", JSON.stringify(this.templateAnalytics));
    localStorage.setItem("templateShares", JSON.stringify(this.templateShares));
  }

  public deleteTemplate(id: string): void {
    delete this.customTemplates[id];
    delete this.templateVersions[id];
    delete this.templateAnalytics[id];
    this.persistAll();
  }

  public updateTemplate(template: PromptTemplate): void {
    if (this.customTemplates[template.id]) {
      this.customTemplates[template.id] = {
        ...template,
        updatedAt: new Date().toISOString(),
      };
      this.persistAll();
    }
  }

  public getTemplate(id: string): PromptTemplate | undefined {
    return this.customTemplates[id];
  }

  public getTemplatesByIndustry(industry: string): PromptTemplate[] {
    return Object.values(this.customTemplates).filter(t => t.industry === industry);
  }

  public getTemplatesByCategory(category: TemplateCategory): PromptTemplate[] {
    return Object.values(this.customTemplates).filter(t => t.category === category);
  }
}

export const industryTemplates: Record<string, IndustryTemplates> = {
  realestate: {
    promptTemplates: [
      {
        id: "realestate-listing-1",
        name: "Property Listing",
        description: "Create a compelling property listing",
        category: "marketing",
        industry: "realestate",
        prompt: "Create a property listing for a {bedrooms} bedroom, {bathrooms} bathroom {propertyType} in {location}. Square footage: {sqft}. Key features: {features}. Price: {price}.",
        responseTemplate: """
[Property Headline]
Stunning {propertyType} in {location}

[Key Features]
• {bedrooms} Bedrooms | {bathrooms} Bathrooms
• {sqft} Square Feet
• {features}

[Description]
{2-3 paragraphs highlighting unique features and location benefits}

[Price and Contact]
Offered at {price}
Contact us for a private viewing
""",
        version: 1,
      },
      {
        id: "realestate-analysis-1",
        name: "Market Analysis",
        description: "Generate a market analysis report",
        category: "analysis",
        industry: "realestate",
        prompt: "Create a market analysis report for {location} focusing on {propertyType} properties. Include recent sales data, market trends, and future projections.",
        responseTemplate: """
[Market Analysis Report]
{location} - {propertyType} Market Overview

[Market Trends]
• Current Market Conditions
• Price Trends
• Days on Market

[Recent Sales Data]
• Comparable Properties
• Price per Square Foot
• Sales Volume

[Future Outlook]
{market projections and recommendations}
""",
        version: 1,
      }
    ],
    commonVariables: {
      propertyType: "house, apartment, condo, etc.",
      location: "city, neighborhood",
      bedrooms: "number",
      bathrooms: "number",
      sqft: "square footage",
      price: "listing price",
      features: "key property features"
    }
  },
  luxuryrealestate: {
    promptTemplates: [
      {
        id: "luxuryrealestate-showcase-1",
        name: "Luxury Property Showcase",
        description: "Create an exclusive luxury property presentation",
        category: "marketing",
        industry: "luxuryrealestate",
        prompt: "Create a luxury property showcase for an exclusive {propertyType} in {location}. Features: {luxuryFeatures}. Price: {price}. Unique selling points: {uniquePoints}.",
        responseTemplate: """
[Exclusive Property Presentation]
{Captivating headline emphasizing luxury and exclusivity}

[Distinguished Features]
• {detailed list of luxury amenities}
• {emphasis on unique architectural elements}
• {premium finishes and materials}

[Lifestyle & Location]
{description of prestigious location and lifestyle benefits}

[Private Viewing]
Available for discrete showings by appointment
{price} | Private inquiries welcome
""",
        version: 1,
      },
      {
        id: "luxuryrealestate-investment-1",
        name: "Investment Potential",
        description: "Highlight investment value of luxury property",
        category: "analysis",
        industry: "luxuryrealestate",
        prompt: "Create an investment analysis for a luxury {propertyType} in {location}. Include market position, appreciation potential, and comparable estates.",
        responseTemplate: """
[Investment Overview]
Premium {location} Estate

[Market Position]
• Comparative Market Analysis
• Historical Value Appreciation
• Exclusive Market Insights

[Investment Potential]
{detailed analysis of appreciation and rental potential}

[Exclusive Opportunity]
{emphasize unique investment advantages}
""",
        version: 1,
      }
    ],
    commonVariables: {
      propertyType: "estate, penthouse, villa, etc.",
      location: "prestigious location",
      luxuryFeatures: "premium amenities",
      uniquePoints: "distinctive features",
      price: "price point"
    }
  },
  hotelmanagement: {
    promptTemplates: [
      {
        id: "hotelmanagement-guest-experience-1",
        name: "Guest Experience Protocol",
        description: "Create guest experience guidelines",
        category: "operations",
        industry: "hotelmanagement",
        prompt: "Create a detailed guest experience protocol for {serviceType} at a {hotelClass} hotel. Include check-in, stay, and check-out procedures.",
        responseTemplate: """
[Guest Experience Protocol]
{hotelClass} Standards

[Check-in Experience]
• Arrival Protocol
• Welcome Procedures
• Room Preparation Standards

[During Stay]
• Service Standards
• Response Times
• Guest Communication

[Check-out Process]
• Departure Protocol
• Feedback Collection
• Follow-up Procedures
""",
        version: 1,
      },
      {
        id: "hotelmanagement-staff-training-1",
        name: "Staff Training Module",
        description: "Create staff training materials",
        category: "training",
        industry: "hotelmanagement",
        prompt: "Develop a training module for {departmentName} staff focusing on {trainingFocus} at a {hotelClass} property.",
        responseTemplate: """
[Training Module]
{departmentName} Excellence Program

[Service Standards]
• Core Competencies
• Performance Metrics
• Best Practices

[Practical Guidelines]
{detailed procedures and examples}

[Assessment Criteria]
{performance evaluation metrics}
""",
        version: 1,
      }
    ],
    commonVariables: {
      hotelClass: "luxury, boutique, business, etc.",
      serviceType: "service category",
      departmentName: "department",
      trainingFocus: "training area"
    }
  },
  travel: {
    promptTemplates: [
      {
        id: "travel-itinerary-1",
        name: "Itinerary Creation",
        description: "Create detailed travel itineraries",
        category: "operations",
        industry: "travel",
        prompt: "Create a {duration} day itinerary for {destination}, focusing on {interests}. Budget: {budget}. Travel style: {travelStyle}.",
        responseTemplate: """
[Custom Travel Itinerary]
{destination} - {duration} Days

[Daily Schedule]
{day-by-day breakdown}
• Morning Activities
• Afternoon Experiences
• Evening Plans

[Practical Information]
• Transportation Details
• Booking Requirements
• Budget Allocation

[Local Tips]
{insider recommendations}
""",
        version: 1,
      },
      {
        id: "travel-destination-guide-1",
        name: "Destination Guide",
        description: "Create comprehensive destination guides",
        category: "documentation",
        industry: "travel",
        prompt: "Create a destination guide for {destination} covering local culture, must-see attractions, dining, and practical tips for {travelStyle} travelers.",
        responseTemplate: """
[Destination Overview]
Welcome to {destination}

[Essential Information]
• Best Time to Visit
• Local Customs
• Transportation

[Curated Experiences]
• Cultural Highlights
• Hidden Gems
• Dining Recommendations

[Practical Tips]
{detailed travel advice}
""",
        version: 1,
      }
    ],
    commonVariables: {
      destination: "travel destination",
      duration: "number of days",
      interests: "traveler interests",
      budget: "budget range",
      travelStyle: "luxury, adventure, family, etc."
    }
  }
};
