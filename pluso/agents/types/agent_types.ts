export interface AgentType {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  defaultTemplate: string;
  teamConfig: {
    canBeOrchestrator: boolean;
    recommendedTeamRole: 'leader' | 'specialist' | 'support';
    isolateConfig: {
      memoryLimit: number;
      timeoutMs: number;
    };
  };
  dataAccess: {
    vectorStore: {
      collections: string[];
      accessLevel: 'read' | 'write' | 'admin';
    };
    requiredAPIs: string[];
  };
}

export interface IndustryAgentTypes {
  industry: string;
  types: AgentType[];
}

export const INDUSTRY_AGENT_TYPES: IndustryAgentTypes[] = [
  {
    industry: "customer-service",
    types: [
      {
        id: "onboarding-specialist",
        name: "Onboarding Specialist",
        description: "Assists new customers with account setup and initial orientation",
        capabilities: ["chat", "document-processing", "email"],
        defaultTemplate: "onboarding-flow",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 128,
            timeoutMs: 5000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["onboarding-docs", "faqs"],
            accessLevel: "read"
          },
          requiredAPIs: ["email-service", "document-processor"]
        }
      },
      {
        id: "support-coordinator",
        name: "Support Coordinator",
        description: "Manages customer inquiries and coordinates with specialist agents",
        capabilities: ["chat", "task-routing", "analytics"],
        defaultTemplate: "support-coordinator",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 256,
            timeoutMs: 10000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["support-docs", "customer-history", "faqs"],
            accessLevel: "admin"
          },
          requiredAPIs: ["ticket-system", "analytics-service"]
        }
      },
      {
        id: "technical-support",
        name: "Technical Support Specialist",
        description: "Handles technical issues and provides detailed solutions",
        capabilities: ["chat", "troubleshooting", "documentation"],
        defaultTemplate: "technical-support",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 192,
            timeoutMs: 7000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["technical-docs", "troubleshooting-guides"],
            accessLevel: "read"
          },
          requiredAPIs: ["knowledge-base", "system-diagnostics"]
        }
      },
      {
        id: "billing-support",
        name: "Billing Support Agent",
        description: "Handles billing inquiries, refunds, and payment processing issues",
        capabilities: ["chat", "payment-processing", "documentation"],
        defaultTemplate: "billing-support",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 128,
            timeoutMs: 5000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["billing-docs", "payment-policies"],
            accessLevel: "read"
          },
          requiredAPIs: ["payment-gateway", "billing-system"]
        }
      },
      {
        id: "satisfaction-surveyor",
        name: "Customer Satisfaction Surveyor",
        description: "Conducts satisfaction surveys and gathers customer feedback",
        capabilities: ["chat", "survey", "analytics"],
        defaultTemplate: "satisfaction-survey",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "support",
          isolateConfig: {
            memoryLimit: 128,
            timeoutMs: 5000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["survey-templates", "feedback-history"],
            accessLevel: "write"
          },
          requiredAPIs: ["survey-system", "analytics-service"]
        }
      },
      {
        id: "retention-specialist",
        name: "Customer Retention Specialist",
        description: "Proactively engages with at-risk customers to prevent churn",
        capabilities: ["chat", "analytics", "crm"],
        defaultTemplate: "retention-specialist",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 192,
            timeoutMs: 7000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["retention-strategies", "customer-history"],
            accessLevel: "read"
          },
          requiredAPIs: ["crm-system", "analytics-service"]
        }
      }
    ]
  },
  {
    industry: "healthcare",
    types: [
      {
        id: "patient-intake",
        name: "Patient Intake Coordinator",
        description: "Manages new patient registration and initial documentation",
        capabilities: ["chat", "form-processing", "scheduling"],
        defaultTemplate: "patient-intake",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 128,
            timeoutMs: 5000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["intake-forms", "medical-policies"],
            accessLevel: "write"
          },
          requiredAPIs: ["ehr-system", "scheduling-system"]
        }
      },
      {
        id: "medical-records",
        name: "Medical Records Assistant",
        description: "Helps retrieve and organize medical records and test results",
        capabilities: ["document-processing", "rag", "search"],
        defaultTemplate: "medical-records",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 256,
            timeoutMs: 10000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["medical-records", "test-results"],
            accessLevel: "read"
          },
          requiredAPIs: ["ehr-system", "lab-results-api"]
        }
      },
      {
        id: "appointment-scheduler",
        name: "Appointment Scheduler",
        description: "Manages appointment scheduling and reminders",
        capabilities: ["scheduling", "chat", "email"],
        defaultTemplate: "appointment-scheduler",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "support",
          isolateConfig: {
            memoryLimit: 128,
            timeoutMs: 5000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["scheduling-policies", "provider-availability"],
            accessLevel: "write"
          },
          requiredAPIs: ["calendar-system", "notification-service"]
        }
      },
      {
        id: "care-coordinator",
        name: "Care Coordinator",
        description: "Coordinates patient care across different providers and departments",
        capabilities: ["chat", "workflow", "analytics"],
        defaultTemplate: "care-coordinator",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 256,
            timeoutMs: 10000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["care-protocols", "patient-history", "provider-directory"],
            accessLevel: "admin"
          },
          requiredAPIs: ["ehr-system", "provider-network", "communication-system"]
        }
      },
      {
        id: "insurance-verifier",
        name: "Insurance Verification Specialist",
        description: "Verifies insurance coverage and benefits",
        capabilities: ["document-processing", "verification", "chat"],
        defaultTemplate: "insurance-verifier",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 192,
            timeoutMs: 7000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["insurance-policies", "coverage-rules"],
            accessLevel: "read"
          },
          requiredAPIs: ["insurance-verification-api", "billing-system"]
        }
      },
      {
        id: "health-educator",
        name: "Health Education Specialist",
        description: "Provides health education and preventive care information",
        capabilities: ["chat", "content", "rag"],
        defaultTemplate: "health-educator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 192,
            timeoutMs: 7000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["health-education-materials", "clinical-guidelines"],
            accessLevel: "read"
          },
          requiredAPIs: ["content-management", "patient-portal"]
        }
      }
    ]
  },
  {
    industry: "legal",
    types: [
      {
        id: "legal-researcher",
        name: "Legal Research Assistant",
        description: "Conducts legal research across case law, statutes, and regulations",
        capabilities: ["rag", "analysis", "document-processing"],
        defaultTemplate: "legal-researcher",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 512,
            timeoutMs: 15000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["case-law", "statutes", "regulations"],
            accessLevel: "read"
          },
          requiredAPIs: ["legal-database", "citation-service"]
        }
      },
      {
        id: "document-drafter",
        name: "Legal Document Drafter",
        description: "Assists in drafting legal documents and contracts",
        capabilities: ["content", "template-processing", "analysis"],
        defaultTemplate: "document-drafter",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 256,
            timeoutMs: 10000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["document-templates", "legal-clauses", "precedents"],
            accessLevel: "read"
          },
          requiredAPIs: ["document-assembly", "template-engine"]
        }
      },
      {
        id: "compliance-monitor",
        name: "Compliance Monitor",
        description: "Monitors and ensures compliance with legal requirements and regulations",
        capabilities: ["analysis", "monitoring", "reporting"],
        defaultTemplate: "compliance-monitor",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["compliance-rules", "regulatory-updates", "audit-logs"],
            accessLevel: "admin"
          },
          requiredAPIs: ["compliance-checker", "reporting-system"]
        }
      },
      {
        id: "case-analyzer",
        name: "Case Analysis Specialist",
        description: "Analyzes case details and provides legal insights",
        capabilities: ["analysis", "rag", "summarization"],
        defaultTemplate: "case-analyzer",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["case-files", "legal-precedents", "expert-opinions"],
            accessLevel: "read"
          },
          requiredAPIs: ["analytics-engine", "document-processor"]
        }
      },
      {
        id: "client-intake",
        name: "Client Intake Specialist",
        description: "Manages new client onboarding and initial case assessment",
        capabilities: ["chat", "form-processing", "workflow"],
        defaultTemplate: "client-intake",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "support",
          isolateConfig: {
            memoryLimit: 192,
            timeoutMs: 7000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["intake-forms", "client-policies", "case-types"],
            accessLevel: "write"
          },
          requiredAPIs: ["crm-system", "scheduling-system"]
        }
      },
      {
        id: "discovery-assistant",
        name: "Discovery Assistant",
        description: "Assists in managing and analyzing discovery documents",
        capabilities: ["document-processing", "analysis", "search"],
        defaultTemplate: "discovery-assistant",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 512,
            timeoutMs: 15000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["discovery-documents", "evidence-database", "metadata-index"],
            accessLevel: "write"
          },
          requiredAPIs: ["document-ocr", "search-engine", "metadata-processor"]
        }
      }
    ]
  },
  {
    industry: "finance",
    types: [
      {
        id: "investment-advisor",
        name: "Investment Advisory Assistant",
        description: "Provides investment recommendations and portfolio analysis",
        capabilities: ["analysis", "rag", "reporting"],
        defaultTemplate: "investment-advisor",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["market-research", "investment-products", "risk-profiles"],
            accessLevel: "read"
          },
          requiredAPIs: ["market-data", "portfolio-analytics"]
        }
      },
      {
        id: "risk-analyst",
        name: "Risk Analysis Specialist",
        description: "Analyzes financial risks and provides risk management strategies",
        capabilities: ["analysis", "modeling", "reporting"],
        defaultTemplate: "risk-analyst",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 512,
            timeoutMs: 15000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["risk-models", "market-data", "compliance-rules"],
            accessLevel: "admin"
          },
          requiredAPIs: ["risk-engine", "market-data-feed"]
        }
      },
      {
        id: "transaction-monitor",
        name: "Transaction Monitoring Specialist",
        description: "Monitors financial transactions for fraud and compliance",
        capabilities: ["monitoring", "analysis", "alerting"],
        defaultTemplate: "transaction-monitor",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["transaction-patterns", "fraud-rules", "compliance-policies"],
            accessLevel: "read"
          },
          requiredAPIs: ["transaction-system", "fraud-detection"]
        }
      },
      {
        id: "financial-planner",
        name: "Financial Planning Assistant",
        description: "Assists in creating and monitoring financial plans",
        capabilities: ["planning", "analysis", "reporting"],
        defaultTemplate: "financial-planner",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 256,
            timeoutMs: 10000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["financial-products", "planning-templates", "tax-rules"],
            accessLevel: "read"
          },
          requiredAPIs: ["planning-tools", "calculator-service"]
        }
      },
      {
        id: "market-analyst",
        name: "Market Analysis Specialist",
        description: "Analyzes market trends and provides investment insights",
        capabilities: ["analysis", "rag", "reporting"],
        defaultTemplate: "market-analyst",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["market-data", "research-reports", "news-feeds"],
            accessLevel: "read"
          },
          requiredAPIs: ["market-data-feed", "news-api"]
        }
      },
      {
        id: "compliance-officer",
        name: "Financial Compliance Officer",
        description: "Ensures compliance with financial regulations and internal policies",
        capabilities: ["monitoring", "reporting", "analysis"],
        defaultTemplate: "compliance-officer",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["regulations", "compliance-policies", "audit-logs"],
            accessLevel: "admin"
          },
          requiredAPIs: ["compliance-system", "reporting-engine"]
        }
      }
    ]
  },
  {
    industry: "education",
    types: [
      {
        id: "curriculum-designer",
        name: "Curriculum Design Assistant",
        description: "Assists in designing and adapting educational curricula",
        capabilities: ["content", "planning", "analysis"],
        defaultTemplate: "curriculum-designer",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["curriculum-standards", "learning-resources", "assessment-templates"],
            accessLevel: "write"
          },
          requiredAPIs: ["content-management", "learning-standards"]
        }
      },
      {
        id: "student-tutor",
        name: "Personal Tutoring Assistant",
        description: "Provides personalized tutoring and learning support",
        capabilities: ["chat", "rag", "assessment"],
        defaultTemplate: "student-tutor",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "support",
          isolateConfig: {
            memoryLimit: 256,
            timeoutMs: 10000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["subject-materials", "practice-problems", "learning-resources"],
            accessLevel: "read"
          },
          requiredAPIs: ["tutoring-platform", "assessment-engine"]
        }
      },
      {
        id: "progress-tracker",
        name: "Learning Progress Monitor",
        description: "Tracks and analyzes student learning progress",
        capabilities: ["analysis", "reporting", "visualization"],
        defaultTemplate: "progress-tracker",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["student-data", "assessment-results", "learning-objectives"],
            accessLevel: "read"
          },
          requiredAPIs: ["analytics-engine", "reporting-system"]
        }
      },
      {
        id: "content-creator",
        name: "Educational Content Creator",
        description: "Creates educational content and learning materials",
        capabilities: ["content", "rag", "media-processing"],
        defaultTemplate: "content-creator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 512,
            timeoutMs: 15000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["learning-resources", "media-assets", "content-templates"],
            accessLevel: "write"
          },
          requiredAPIs: ["content-management", "media-processor"]
        }
      },
      {
        id: "assessment-designer",
        name: "Assessment Designer",
        description: "Creates and manages educational assessments",
        capabilities: ["content", "analysis", "assessment"],
        defaultTemplate: "assessment-designer",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["assessment-templates", "question-bank", "rubrics"],
            accessLevel: "write"
          },
          requiredAPIs: ["assessment-engine", "analytics-system"]
        }
      },
      {
        id: "learning-coordinator",
        name: "Learning Experience Coordinator",
        description: "Coordinates and optimizes learning experiences",
        capabilities: ["workflow", "planning", "monitoring"],
        defaultTemplate: "learning-coordinator",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["learning-paths", "resource-catalog", "student-profiles"],
            accessLevel: "admin"
          },
          requiredAPIs: ["lms-system", "scheduling-system"]
        }
      }
    ]
  },
  {
    industry: "technology",
    types: [
      {
        id: "code-assistant",
        name: "Programming Assistant",
        description: "Assists with code development and debugging",
        capabilities: ["code", "analysis", "documentation"],
        defaultTemplate: "code-assistant",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 512,
            timeoutMs: 15000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["code-repository", "documentation", "best-practices"],
            accessLevel: "read"
          },
          requiredAPIs: ["code-analysis", "version-control"]
        }
      },
      {
        id: "devops-engineer",
        name: "DevOps Assistant",
        description: "Manages deployment and infrastructure operations",
        capabilities: ["infrastructure", "monitoring", "automation"],
        defaultTemplate: "devops-engineer",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["infrastructure-configs", "deployment-scripts", "monitoring-rules"],
            accessLevel: "admin"
          },
          requiredAPIs: ["cloud-platform", "monitoring-system"]
        }
      },
      {
        id: "security-analyst",
        name: "Security Analysis Specialist",
        description: "Analyzes and monitors security threats",
        capabilities: ["security", "analysis", "monitoring"],
        defaultTemplate: "security-analyst",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["security-rules", "threat-patterns", "vulnerability-database"],
            accessLevel: "read"
          },
          requiredAPIs: ["security-scanner", "threat-detection"]
        }
      },
      {
        id: "qa-engineer",
        name: "Quality Assurance Specialist",
        description: "Manages testing and quality assurance processes",
        capabilities: ["testing", "automation", "reporting"],
        defaultTemplate: "qa-engineer",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["test-cases", "test-results", "quality-metrics"],
            accessLevel: "write"
          },
          requiredAPIs: ["test-automation", "reporting-system"]
        }
      },
      {
        id: "system-architect",
        name: "System Architecture Designer",
        description: "Designs and plans system architecture",
        capabilities: ["design", "analysis", "documentation"],
        defaultTemplate: "system-architect",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 512,
            timeoutMs: 15000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["architecture-patterns", "system-specs", "design-documents"],
            accessLevel: "admin"
          },
          requiredAPIs: ["modeling-tools", "documentation-system"]
        }
      },
      {
        id: "data-engineer",
        name: "Data Engineering Specialist",
        description: "Manages data pipelines and infrastructure",
        capabilities: ["data", "pipeline", "analysis"],
        defaultTemplate: "data-engineer",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 512,
            timeoutMs: 15000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["data-schemas", "pipeline-configs", "data-quality-rules"],
            accessLevel: "write"
          },
          requiredAPIs: ["data-platform", "etl-system"]
        }
      }
    ]
  },
  {
    industry: "healthcare-research",
    types: [
      {
        id: "clinical-researcher",
        name: "Clinical Research Assistant",
        description: "Assists in clinical research design and analysis",
        capabilities: ["research", "analysis", "documentation"],
        defaultTemplate: "clinical-researcher",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 512,
            timeoutMs: 15000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["clinical-trials", "research-protocols", "medical-literature"],
            accessLevel: "write"
          },
          requiredAPIs: ["research-database", "statistical-analysis"]
        }
      },
      {
        id: "data-analyst",
        name: "Medical Data Analyst",
        description: "Analyzes medical data and research outcomes",
        capabilities: ["analysis", "statistics", "visualization"],
        defaultTemplate: "data-analyst",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["patient-data", "trial-results", "statistical-models"],
            accessLevel: "read"
          },
          requiredAPIs: ["analytics-engine", "visualization-tools"]
        }
      },
      {
        id: "literature-reviewer",
        name: "Medical Literature Reviewer",
        description: "Reviews and synthesizes medical literature",
        capabilities: ["rag", "analysis", "summarization"],
        defaultTemplate: "literature-reviewer",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["medical-journals", "research-papers", "meta-analyses"],
            accessLevel: "read"
          },
          requiredAPIs: ["literature-database", "citation-service"]
        }
      },
      {
        id: "compliance-monitor",
        name: "Research Compliance Monitor",
        description: "Ensures compliance with research protocols and regulations",
        capabilities: ["monitoring", "documentation", "reporting"],
        defaultTemplate: "compliance-monitor",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["compliance-guidelines", "ethics-protocols", "audit-logs"],
            accessLevel: "admin"
          },
          requiredAPIs: ["compliance-system", "audit-tools"]
        }
      },
      {
        id: "protocol-designer",
        name: "Research Protocol Designer",
        description: "Designs and optimizes research protocols",
        capabilities: ["planning", "documentation", "analysis"],
        defaultTemplate: "protocol-designer",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["protocol-templates", "best-practices", "study-designs"],
            accessLevel: "write"
          },
          requiredAPIs: ["protocol-management", "workflow-system"]
        }
      },
      {
        id: "grant-writer",
        name: "Research Grant Writer",
        description: "Assists in writing and managing research grants",
        capabilities: ["content", "analysis", "documentation"],
        defaultTemplate: "grant-writer",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["grant-templates", "funding-sources", "proposal-guidelines"],
            accessLevel: "write"
          },
          requiredAPIs: ["document-management", "budget-tools"]
        }
      }
    ]
  },
  {
    industry: "manufacturing",
    types: [
      {
        id: "process-optimizer",
        name: "Process Optimization Specialist",
        description: "Optimizes manufacturing processes and workflows",
        capabilities: ["analysis", "optimization", "monitoring"],
        defaultTemplate: "process-optimizer",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 512,
            timeoutMs: 15000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["process-data", "optimization-models", "performance-metrics"],
            accessLevel: "admin"
          },
          requiredAPIs: ["process-monitoring", "optimization-engine"]
        }
      },
      {
        id: "quality-inspector",
        name: "Quality Control Inspector",
        description: "Monitors and ensures product quality standards",
        capabilities: ["monitoring", "analysis", "reporting"],
        defaultTemplate: "quality-inspector",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["quality-standards", "inspection-data", "defect-patterns"],
            accessLevel: "write"
          },
          requiredAPIs: ["quality-system", "inspection-tools"]
        }
      },
      {
        id: "maintenance-planner",
        name: "Maintenance Planning Specialist",
        description: "Plans and schedules equipment maintenance",
        capabilities: ["planning", "monitoring", "scheduling"],
        defaultTemplate: "maintenance-planner",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["equipment-data", "maintenance-schedules", "repair-procedures"],
            accessLevel: "write"
          },
          requiredAPIs: ["maintenance-system", "scheduling-tools"]
        }
      },
      {
        id: "inventory-manager",
        name: "Inventory Management Specialist",
        description: "Manages inventory and supply chain operations",
        capabilities: ["inventory", "analysis", "optimization"],
        defaultTemplate: "inventory-manager",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["inventory-data", "supply-chain", "demand-forecasts"],
            accessLevel: "write"
          },
          requiredAPIs: ["inventory-system", "forecasting-tools"]
        }
      },
      {
        id: "safety-monitor",
        name: "Safety Compliance Monitor",
        description: "Monitors and ensures workplace safety compliance",
        capabilities: ["monitoring", "reporting", "documentation"],
        defaultTemplate: "safety-monitor",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["safety-regulations", "incident-reports", "safety-procedures"],
            accessLevel: "admin"
          },
          requiredAPIs: ["safety-system", "reporting-tools"]
        }
      },
      {
        id: "production-scheduler",
        name: "Production Scheduling Specialist",
        description: "Optimizes production schedules and resource allocation",
        capabilities: ["scheduling", "optimization", "analysis"],
        defaultTemplate: "production-scheduler",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["production-data", "resource-availability", "order-schedules"],
            accessLevel: "write"
          },
          requiredAPIs: ["scheduling-system", "resource-management"]
        }
      }
    ]
  },
  {
    industry: "clubs",
    types: [
      {
        id: "membership-coordinator",
        name: "Membership Coordinator",
        description: "Manages member relationships and engagement",
        capabilities: ["crm", "communication", "analysis"],
        defaultTemplate: "membership-coordinator",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["member-profiles", "engagement-metrics", "membership-tiers"],
            accessLevel: "admin"
          },
          requiredAPIs: ["crm-system", "communication-platform"]
        }
      },
      {
        id: "event-planner",
        name: "Event Planning Assistant",
        description: "Plans and coordinates club events and activities",
        capabilities: ["planning", "scheduling", "coordination"],
        defaultTemplate: "event-planner",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["event-templates", "venue-database", "activity-calendar"],
            accessLevel: "write"
          },
          requiredAPIs: ["event-management", "scheduling-system"]
        }
      },
      {
        id: "communications-manager",
        name: "Communications Manager",
        description: "Manages club communications and announcements",
        capabilities: ["content", "communication", "social-media"],
        defaultTemplate: "communications-manager",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["announcement-templates", "content-calendar", "member-preferences"],
            accessLevel: "write"
          },
          requiredAPIs: ["email-platform", "social-media-tools"]
        }
      },
      {
        id: "resource-manager",
        name: "Resource Management Assistant",
        description: "Manages club facilities and resources",
        capabilities: ["inventory", "scheduling", "maintenance"],
        defaultTemplate: "resource-manager",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["facility-inventory", "booking-schedules", "maintenance-logs"],
            accessLevel: "write"
          },
          requiredAPIs: ["booking-system", "maintenance-tracker"]
        }
      },
      {
        id: "finance-coordinator",
        name: "Financial Coordinator",
        description: "Manages club finances and membership dues",
        capabilities: ["finance", "reporting", "analysis"],
        defaultTemplate: "finance-coordinator",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["financial-records", "membership-fees", "budget-plans"],
            accessLevel: "admin"
          },
          requiredAPIs: ["accounting-system", "payment-processor"]
        }
      },
      {
        id: "community-moderator",
        name: "Community Engagement Moderator",
        description: "Moderates and facilitates community interactions",
        capabilities: ["moderation", "communication", "conflict-resolution"],
        defaultTemplate: "community-moderator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "support",
          isolateConfig: {
            memoryLimit: 256,
            timeoutMs: 10000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["community-guidelines", "interaction-logs", "member-feedback"],
            accessLevel: "write"
          },
          requiredAPIs: ["community-platform", "moderation-tools"]
        }
      },
      {
        id: "onboarding-specialist",
        name: "Member Onboarding Specialist",
        description: "Manages new member orientation and integration",
        capabilities: ["onboarding", "documentation", "support"],
        defaultTemplate: "onboarding-specialist",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "support",
          isolateConfig: {
            memoryLimit: 256,
            timeoutMs: 10000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["onboarding-materials", "club-documentation", "member-faqs"],
            accessLevel: "read"
          },
          requiredAPIs: ["onboarding-system", "documentation-platform"]
        }
      },
      {
        id: "activity-coordinator",
        name: "Activity Coordinator",
        description: "Coordinates and manages club activities and programs",
        capabilities: ["coordination", "scheduling", "program-management"],
        defaultTemplate: "activity-coordinator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["activity-programs", "instructor-database", "participant-records"],
            accessLevel: "write"
          },
          requiredAPIs: ["program-management", "scheduling-system"]
        }
      }
    ]
  },
  {
    industry: "golf-clubs",
    types: [
      {
        id: "tee-time-manager",
        name: "Tee Time Management Assistant",
        description: "Manages tee time bookings and course scheduling",
        capabilities: ["scheduling", "optimization", "booking"],
        defaultTemplate: "tee-time-manager",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["tee-time-schedule", "member-preferences", "course-availability"],
            accessLevel: "admin"
          },
          requiredAPIs: ["booking-system", "scheduling-platform"]
        }
      },
      {
        id: "tournament-coordinator",
        name: "Tournament Coordinator",
        description: "Manages golf tournaments and competitions",
        capabilities: ["event-planning", "scoring", "coordination"],
        defaultTemplate: "tournament-coordinator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["tournament-templates", "competition-rules", "player-handicaps"],
            accessLevel: "write"
          },
          requiredAPIs: ["tournament-management", "scoring-system"]
        }
      },
      {
        id: "course-manager",
        name: "Course Management Assistant",
        description: "Monitors course conditions and maintenance",
        capabilities: ["maintenance", "scheduling", "reporting"],
        defaultTemplate: "course-manager",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["course-conditions", "maintenance-schedules", "equipment-inventory"],
            accessLevel: "admin"
          },
          requiredAPIs: ["maintenance-system", "weather-service"]
        }
      },
      {
        id: "pro-shop-manager",
        name: "Pro Shop Management Assistant",
        description: "Manages pro shop inventory and sales",
        capabilities: ["inventory", "sales", "customer-service"],
        defaultTemplate: "pro-shop-manager",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["inventory-database", "sales-records", "product-catalog"],
            accessLevel: "write"
          },
          requiredAPIs: ["pos-system", "inventory-management"]
        }
      },
      {
        id: "handicap-manager",
        name: "Handicap System Manager",
        description: "Manages player handicaps and scoring records",
        capabilities: ["scoring", "analysis", "reporting"],
        defaultTemplate: "handicap-manager",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["player-scores", "handicap-records", "tournament-results"],
            accessLevel: "write"
          },
          requiredAPIs: ["handicap-system", "scoring-platform"]
        }
      },
      {
        id: "golf-instructor",
        name: "Golf Instruction Coordinator",
        description: "Manages golf lessons and instruction programs",
        capabilities: ["scheduling", "instruction", "program-management"],
        defaultTemplate: "golf-instructor",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["lesson-schedules", "instructor-profiles", "student-progress"],
            accessLevel: "write"
          },
          requiredAPIs: ["lesson-booking", "progress-tracking"]
        }
      },
      {
        id: "food-beverage-manager",
        name: "F&B Operations Manager",
        description: "Manages clubhouse dining and beverage services",
        capabilities: ["inventory", "scheduling", "service-management"],
        defaultTemplate: "food-beverage-manager",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["menu-items", "inventory-levels", "reservation-system"],
            accessLevel: "write"
          },
          requiredAPIs: ["pos-system", "reservation-platform"]
        }
      },
      {
        id: "membership-services",
        name: "Golf Membership Services",
        description: "Manages golf-specific membership services and benefits",
        capabilities: ["member-services", "communication", "benefits-management"],
        defaultTemplate: "membership-services",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["member-profiles", "membership-tiers", "benefits-packages"],
            accessLevel: "admin"
          },
          requiredAPIs: ["crm-system", "benefits-management"]
        }
      },
      {
        id: "events-coordinator",
        name: "Golf Events Coordinator",
        description: "Coordinates and manages golf-specific events and social functions",
        capabilities: ["event-planning", "coordination", "social-programming"],
        defaultTemplate: "events-coordinator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["event-calendar", "venue-bookings", "catering-services"],
            accessLevel: "write"
          },
          requiredAPIs: ["event-management", "catering-system"]
        }
      }
    ]
  },
  {
    industry: "retail-and-ecommerce",
    types: [
      {
        id: "inventory-manager",
        name: "Inventory Management Specialist",
        description: "Manages retail inventory and stock levels",
        capabilities: ["inventory", "analysis", "forecasting"],
        defaultTemplate: "inventory-manager",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["inventory-levels", "sales-history", "supplier-data"],
            accessLevel: "admin"
          },
          requiredAPIs: ["inventory-system", "forecasting-platform"]
        }
      },
      {
        id: "digital-marketing",
        name: "Digital Marketing Specialist",
        description: "Manages online marketing campaigns",
        capabilities: ["marketing", "analysis", "content-creation"],
        defaultTemplate: "digital-marketing",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["campaign-data", "customer-segments", "marketing-content"],
            accessLevel: "admin"
          },
          requiredAPIs: ["marketing-platform", "analytics-system"]
        }
      },
      {
        id: "customer-service",
        name: "Customer Service Assistant",
        description: "Handles customer inquiries and support",
        capabilities: ["chat", "support", "issue-resolution"],
        defaultTemplate: "customer-service",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "support",
          isolateConfig: {
            memoryLimit: 256,
            timeoutMs: 10000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["customer-inquiries", "product-info", "return-policies"],
            accessLevel: "read"
          },
          requiredAPIs: ["crm-system", "ticketing-platform"]
        }
      },
      {
        id: "catalog-manager",
        name: "Product Catalog Manager",
        description: "Manages online product catalog and listings",
        capabilities: ["content", "categorization", "optimization"],
        defaultTemplate: "catalog-manager",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["product-catalog", "category-hierarchy", "product-attributes"],
            accessLevel: "write"
          },
          requiredAPIs: ["catalog-system", "content-management"]
        }
      },
      {
        id: "pricing-analyst",
        name: "Pricing Strategy Analyst",
        description: "Manages pricing strategies and promotions",
        capabilities: ["analysis", "optimization", "forecasting"],
        defaultTemplate: "pricing-analyst",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["price-data", "competitor-prices", "market-trends"],
            accessLevel: "write"
          },
          requiredAPIs: ["pricing-engine", "market-analytics"]
        }
      },
      {
        id: "fulfillment-coordinator",
        name: "Fulfillment Operations Coordinator",
        description: "Manages order fulfillment and shipping",
        capabilities: ["logistics", "coordination", "optimization"],
        defaultTemplate: "fulfillment-coordinator",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["order-data", "shipping-rules", "warehouse-inventory"],
            accessLevel: "admin"
          },
          requiredAPIs: ["fulfillment-system", "shipping-platform"]
        }
      },
      {
        id: "marketplace-manager",
        name: "Marketplace Operations Manager",
        description: "Manages marketplace sellers and operations",
        capabilities: ["vendor-management", "compliance", "optimization"],
        defaultTemplate: "marketplace-manager",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["seller-data", "marketplace-rules", "performance-metrics"],
            accessLevel: "admin"
          },
          requiredAPIs: ["marketplace-platform", "vendor-portal"]
        }
      },
      {
        id: "review-manager",
        name: "Product Review Manager",
        description: "Manages product reviews and ratings",
        capabilities: ["moderation", "analysis", "engagement"],
        defaultTemplate: "review-manager",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["product-reviews", "customer-feedback", "moderation-rules"],
            accessLevel: "write"
          },
          requiredAPIs: ["review-platform", "sentiment-analysis"]
        }
      }
    ]
  },
  {
    industry: "agriculture",
    types: [
      {
        id: "crop-manager",
        name: "Crop Management Specialist",
        description: "Manages crop planning and monitoring",
        capabilities: ["monitoring", "analysis", "planning"],
        defaultTemplate: "crop-manager",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 512,
            timeoutMs: 15000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["crop-data", "soil-conditions", "weather-patterns"],
            accessLevel: "admin"
          },
          requiredAPIs: ["weather-service", "soil-monitoring"]
        }
      },
      {
        id: "irrigation-specialist",
        name: "Irrigation Management Specialist",
        description: "Monitors and manages irrigation systems",
        capabilities: ["monitoring", "automation", "optimization"],
        defaultTemplate: "irrigation-specialist",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["irrigation-schedules", "water-usage", "soil-moisture"],
            accessLevel: "write"
          },
          requiredAPIs: ["irrigation-control", "moisture-sensors"]
        }
      },
      {
        id: "livestock-manager",
        name: "Livestock Management Assistant",
        description: "Monitors livestock health and operations",
        capabilities: ["monitoring", "health-tracking", "inventory"],
        defaultTemplate: "livestock-manager",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["livestock-data", "health-records", "feed-inventory"],
            accessLevel: "admin"
          },
          requiredAPIs: ["health-monitoring", "inventory-system"]
        }
      },
      {
        id: "equipment-coordinator",
        name: "Equipment Operations Coordinator",
        description: "Manages farm equipment and maintenance",
        capabilities: ["maintenance", "scheduling", "inventory"],
        defaultTemplate: "equipment-coordinator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["equipment-inventory", "maintenance-logs", "usage-data"],
            accessLevel: "write"
          },
          requiredAPIs: ["maintenance-system", "equipment-tracking"]
        }
      },
      {
        id: "yield-analyst",
        name: "Yield Analysis Specialist",
        description: "Analyzes and forecasts crop yields",
        capabilities: ["analysis", "forecasting", "reporting"],
        defaultTemplate: "yield-analyst",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["yield-data", "historical-records", "market-prices"],
            accessLevel: "read"
          },
          requiredAPIs: ["analytics-platform", "market-data"]
        }
      },
      {
        id: "compliance-monitor",
        name: "Agricultural Compliance Monitor",
        description: "Ensures compliance with agricultural regulations",
        capabilities: ["compliance", "documentation", "reporting"],
        defaultTemplate: "compliance-monitor",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["regulations", "compliance-records", "certification-requirements"],
            accessLevel: "admin"
          },
          requiredAPIs: ["compliance-system", "documentation-platform"]
        }
      }
    ]
  },
  {
    industry: "real-estate",
    types: [
      {
        id: "property-manager",
        name: "Property Management Assistant",
        description: "Manages property operations and maintenance",
        capabilities: ["property-management", "maintenance", "tenant-relations"],
        defaultTemplate: "property-manager",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["property-records", "maintenance-logs", "tenant-data"],
            accessLevel: "admin"
          },
          requiredAPIs: ["property-management", "maintenance-system"]
        }
      },
      {
        id: "listing-specialist",
        name: "Listing Management Specialist",
        description: "Manages property listings and marketing",
        capabilities: ["content", "marketing", "analysis"],
        defaultTemplate: "listing-specialist",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["property-listings", "market-data", "marketing-materials"],
            accessLevel: "write"
          },
          requiredAPIs: ["listing-platform", "marketing-system"]
        }
      },
      {
        id: "market-analyst",
        name: "Real Estate Market Analyst",
        description: "Analyzes market trends and property values",
        capabilities: ["analysis", "forecasting", "reporting"],
        defaultTemplate: "market-analyst",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["market-trends", "property-values", "economic-indicators"],
            accessLevel: "read"
          },
          requiredAPIs: ["market-analytics", "data-services"]
        }
      },
      {
        id: "tenant-coordinator",
        name: "Tenant Relations Coordinator",
        description: "Manages tenant relationships and communications",
        capabilities: ["communication", "support", "documentation"],
        defaultTemplate: "tenant-coordinator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "support",
          isolateConfig: {
            memoryLimit: 256,
            timeoutMs: 10000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["tenant-records", "lease-agreements", "communication-logs"],
            accessLevel: "write"
          },
          requiredAPIs: ["crm-system", "communication-platform"]
        }
      },
      {
        id: "compliance-specialist",
        name: "Real Estate Compliance Specialist",
        description: "Ensures compliance with real estate regulations",
        capabilities: ["compliance", "documentation", "reporting"],
        defaultTemplate: "compliance-specialist",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["regulations", "compliance-records", "legal-requirements"],
            accessLevel: "admin"
          },
          requiredAPIs: ["compliance-system", "documentation-platform"]
        }
      },
      {
        id: "transaction-coordinator",
        name: "Transaction Coordination Specialist",
        description: "Manages real estate transactions and documentation",
        capabilities: ["transaction-management", "documentation", "coordination"],
        defaultTemplate: "transaction-coordinator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["transaction-records", "contract-templates", "closing-documents"],
            accessLevel: "write"
          },
          requiredAPIs: ["transaction-system", "document-management"]
        }
      },
      {
        id: "investment-analyst",
        name: "Real Estate Investment Analyst",
        description: "Analyzes investment opportunities and ROI",
        capabilities: ["analysis", "financial-modeling", "reporting"],
        defaultTemplate: "investment-analyst",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["investment-data", "financial-models", "market-analysis"],
            accessLevel: "read"
          },
          requiredAPIs: ["financial-analytics", "investment-platform"]
        }
      }
    ]
  },
  {
    industry: "transportation",
    types: [
      {
        id: "fleet-manager",
        name: "Fleet Management Specialist",
        description: "Manages vehicle fleet operations and maintenance",
        capabilities: ["fleet-management", "maintenance", "optimization"],
        defaultTemplate: "fleet-manager",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["vehicle-data", "maintenance-records", "route-history"],
            accessLevel: "admin"
          },
          requiredAPIs: ["fleet-management", "maintenance-system"]
        }
      },
      {
        id: "route-optimizer",
        name: "Route Optimization Specialist",
        description: "Optimizes transportation routes and schedules",
        capabilities: ["routing", "optimization", "scheduling"],
        defaultTemplate: "route-optimizer",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["route-data", "traffic-patterns", "delivery-schedules"],
            accessLevel: "write"
          },
          requiredAPIs: ["routing-engine", "traffic-api"]
        }
      },
      {
        id: "safety-compliance",
        name: "Transportation Safety Monitor",
        description: "Monitors safety compliance and regulations",
        capabilities: ["compliance", "monitoring", "reporting"],
        defaultTemplate: "safety-compliance",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["safety-regulations", "incident-reports", "compliance-records"],
            accessLevel: "admin"
          },
          requiredAPIs: ["safety-system", "compliance-platform"]
        }
      },
      {
        id: "logistics-coordinator",
        name: "Logistics Coordination Specialist",
        description: "Coordinates logistics and shipment operations",
        capabilities: ["logistics", "coordination", "tracking"],
        defaultTemplate: "logistics-coordinator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["shipment-data", "warehouse-inventory", "delivery-status"],
            accessLevel: "write"
          },
          requiredAPIs: ["logistics-platform", "tracking-system"]
        }
      },
      {
        id: "fuel-manager",
        name: "Fuel Management Specialist",
        description: "Manages fuel consumption and efficiency",
        capabilities: ["monitoring", "optimization", "reporting"],
        defaultTemplate: "fuel-manager",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["fuel-data", "consumption-patterns", "cost-records"],
            accessLevel: "write"
          },
          requiredAPIs: ["fuel-monitoring", "analytics-platform"]
        }
      }
    ]
  },
  {
    industry: "energy",
    types: [
      {
        id: "grid-manager",
        name: "Grid Management Specialist",
        description: "Monitors and manages power grid operations",
        capabilities: ["monitoring", "optimization", "control"],
        defaultTemplate: "grid-manager",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 512,
            timeoutMs: 15000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["grid-data", "load-patterns", "maintenance-schedules"],
            accessLevel: "admin"
          },
          requiredAPIs: ["grid-control", "monitoring-system"]
        }
      },
      {
        id: "renewable-specialist",
        name: "Renewable Energy Specialist",
        description: "Manages renewable energy systems and integration",
        capabilities: ["monitoring", "optimization", "forecasting"],
        defaultTemplate: "renewable-specialist",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["renewable-data", "weather-patterns", "generation-forecasts"],
            accessLevel: "write"
          },
          requiredAPIs: ["weather-service", "forecasting-platform"]
        }
      },
      {
        id: "demand-analyst",
        name: "Energy Demand Analyst",
        description: "Analyzes and forecasts energy demand",
        capabilities: ["analysis", "forecasting", "optimization"],
        defaultTemplate: "demand-analyst",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["consumption-data", "demand-patterns", "historical-usage"],
            accessLevel: "read"
          },
          requiredAPIs: ["analytics-platform", "forecasting-system"]
        }
      },
      {
        id: "maintenance-coordinator",
        name: "Energy Infrastructure Maintenance",
        description: "Coordinates infrastructure maintenance",
        capabilities: ["maintenance", "scheduling", "monitoring"],
        defaultTemplate: "maintenance-coordinator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["maintenance-records", "equipment-data", "inspection-logs"],
            accessLevel: "write"
          },
          requiredAPIs: ["maintenance-system", "asset-management"]
        }
      },
      {
        id: "compliance-specialist",
        name: "Energy Compliance Specialist",
        description: "Ensures compliance with energy regulations",
        capabilities: ["compliance", "reporting", "documentation"],
        defaultTemplate: "compliance-specialist",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["regulations", "compliance-records", "audit-logs"],
            accessLevel: "admin"
          },
          requiredAPIs: ["compliance-system", "reporting-platform"]
        }
      }
    ]
  },
  {
    industry: "media-entertainment",
    types: [
      {
        id: "content-strategist",
        name: "Content Strategy Specialist",
        description: "Develops and manages content strategies",
        capabilities: ["planning", "analysis", "content-management"],
        defaultTemplate: "content-strategist",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["content-library", "audience-data", "performance-metrics"],
            accessLevel: "admin"
          },
          requiredAPIs: ["cms-platform", "analytics-system"]
        }
      },
      {
        id: "production-coordinator",
        name: "Production Coordination Specialist",
        description: "Manages production schedules and resources",
        capabilities: ["scheduling", "resource-management", "coordination"],
        defaultTemplate: "production-coordinator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["production-schedules", "resource-allocation", "project-timelines"],
            accessLevel: "write"
          },
          requiredAPIs: ["production-management", "scheduling-system"]
        }
      },
      {
        id: "audience-analyst",
        name: "Audience Analytics Specialist",
        description: "Analyzes audience engagement and trends",
        capabilities: ["analysis", "reporting", "optimization"],
        defaultTemplate: "audience-analyst",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["audience-metrics", "engagement-data", "demographic-info"],
            accessLevel: "read"
          },
          requiredAPIs: ["analytics-platform", "audience-tracking"]
        }
      },
      {
        id: "rights-manager",
        name: "Rights Management Specialist",
        description: "Manages content rights and licensing",
        capabilities: ["rights-management", "compliance", "documentation"],
        defaultTemplate: "rights-manager",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["rights-database", "licensing-agreements", "usage-tracking"],
            accessLevel: "admin"
          },
          requiredAPIs: ["rights-management", "contract-system"]
        }
      },
      {
        id: "distribution-coordinator",
        name: "Content Distribution Specialist",
        description: "Manages content distribution across platforms",
        capabilities: ["distribution", "optimization", "monitoring"],
        defaultTemplate: "distribution-coordinator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["distribution-channels", "platform-metrics", "delivery-logs"],
            accessLevel: "write"
          },
          requiredAPIs: ["distribution-platform", "analytics-system"]
        }
      },
      {
        id: "social-media-manager",
        name: "Social Media Management Specialist",
        description: "Manages social media presence and engagement",
        capabilities: ["social-media", "content-creation", "engagement"],
        defaultTemplate: "social-media-manager",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["social-content", "engagement-metrics", "audience-feedback"],
            accessLevel: "write"
          },
          requiredAPIs: ["social-media-platform", "analytics-tools"]
        }
      }
    ]
  },
  {
    industry: "events",
    types: [
      {
        id: "event-planner",
        name: "Event Planning Specialist",
        description: "Plans and coordinates all aspects of events",
        capabilities: ["planning", "coordination", "budgeting"],
        defaultTemplate: "event-planner",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["event-plans", "vendor-contacts", "client-requirements"],
            accessLevel: "admin"
          },
          requiredAPIs: ["planning-system", "crm-platform"]
        }
      },
      {
        id: "venue-coordinator",
        name: "Venue Management Specialist",
        description: "Manages venue logistics and setup",
        capabilities: ["venue-management", "logistics", "scheduling"],
        defaultTemplate: "venue-coordinator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["venue-inventory", "floor-plans", "setup-requirements"],
            accessLevel: "write"
          },
          requiredAPIs: ["venue-management", "inventory-system"]
        }
      },
      {
        id: "registration-manager",
        name: "Registration Management Specialist",
        description: "Manages attendee registration and check-in",
        capabilities: ["registration", "attendee-management", "reporting"],
        defaultTemplate: "registration-manager",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["attendee-data", "registration-records", "check-in-logs"],
            accessLevel: "write"
          },
          requiredAPIs: ["registration-platform", "badge-system"]
        }
      },
      {
        id: "vendor-coordinator",
        name: "Vendor Coordination Specialist",
        description: "Manages vendor relationships and logistics",
        capabilities: ["vendor-management", "coordination", "scheduling"],
        defaultTemplate: "vendor-coordinator",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["vendor-contracts", "service-requirements", "delivery-schedules"],
            accessLevel: "admin"
          },
          requiredAPIs: ["vendor-management", "contract-system"]
        }
      },
      {
        id: "av-specialist",
        name: "AV Technical Specialist",
        description: "Manages audio-visual and technical requirements",
        capabilities: ["av-management", "technical-support", "equipment-setup"],
        defaultTemplate: "av-specialist",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["equipment-inventory", "technical-requirements", "setup-plans"],
            accessLevel: "write"
          },
          requiredAPIs: ["av-system", "equipment-management"]
        }
      },
      {
        id: "catering-coordinator",
        name: "Catering Coordination Specialist",
        description: "Manages food and beverage services",
        capabilities: ["catering-management", "menu-planning", "dietary-management"],
        defaultTemplate: "catering-coordinator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["menu-plans", "dietary-requirements", "catering-schedules"],
            accessLevel: "write"
          },
          requiredAPIs: ["catering-system", "dietary-management"]
        }
      },
      {
        id: "safety-compliance",
        name: "Safety and Compliance Specialist",
        description: "Ensures event safety and regulatory compliance",
        capabilities: ["safety-management", "compliance", "risk-assessment"],
        defaultTemplate: "safety-compliance",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["safety-protocols", "permits-licenses", "incident-reports"],
            accessLevel: "admin"
          },
          requiredAPIs: ["safety-system", "compliance-platform"]
        }
      },
      {
        id: "marketing-specialist",
        name: "Event Marketing Specialist",
        description: "Manages event promotion and marketing",
        capabilities: ["marketing", "promotion", "social-media"],
        defaultTemplate: "marketing-specialist",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["marketing-materials", "promotional-campaigns", "engagement-metrics"],
            accessLevel: "write"
          },
          requiredAPIs: ["marketing-platform", "analytics-system"]
        }
      }
    ]
  },
  {
    industry: "travel",
    types: [
      {
        id: "travel-planner",
        name: "Travel Planning Specialist",
        description: "Plans and coordinates comprehensive travel itineraries",
        capabilities: ["itinerary-planning", "booking", "coordination"],
        defaultTemplate: "travel-planner",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["travel-itineraries", "client-preferences", "booking-history"],
            accessLevel: "admin"
          },
          requiredAPIs: ["booking-system", "crm-platform", "gds-system"]
        }
      },
      {
        id: "accommodation-specialist",
        name: "Accommodation Management Specialist",
        description: "Manages hotel and accommodation bookings",
        capabilities: ["hotel-booking", "rate-negotiation", "inventory-management"],
        defaultTemplate: "accommodation-specialist",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["hotel-inventory", "rate-cards", "booking-records"],
            accessLevel: "write"
          },
          requiredAPIs: ["hotel-booking-system", "rate-management"]
        }
      },
      {
        id: "transportation-coordinator",
        name: "Transportation Coordination Specialist",
        description: "Manages all transportation arrangements",
        capabilities: ["flight-booking", "ground-transport", "route-planning"],
        defaultTemplate: "transportation-coordinator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["flight-inventory", "transport-options", "routing-data"],
            accessLevel: "write"
          },
          requiredAPIs: ["flight-booking", "transport-management"]
        }
      },
      {
        id: "experience-curator",
        name: "Experience Curation Specialist",
        description: "Curates unique travel experiences and activities",
        capabilities: ["experience-planning", "activity-booking", "local-expertise"],
        defaultTemplate: "experience-curator",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["activities-database", "local-experiences", "tour-inventory"],
            accessLevel: "admin"
          },
          requiredAPIs: ["activity-booking", "experience-platform"]
        }
      },
      {
        id: "travel-concierge",
        name: "Travel Concierge Specialist",
        description: "Provides personalized concierge services",
        capabilities: ["concierge-service", "request-handling", "problem-solving"],
        defaultTemplate: "travel-concierge",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["service-requests", "vendor-contacts", "guest-preferences"],
            accessLevel: "write"
          },
          requiredAPIs: ["concierge-system", "crm-platform"]
        }
      },
      {
        id: "documentation-specialist",
        name: "Travel Documentation Specialist",
        description: "Manages travel documents and requirements",
        capabilities: ["visa-processing", "document-management", "requirement-checking"],
        defaultTemplate: "documentation-specialist",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["visa-requirements", "travel-documents", "country-regulations"],
            accessLevel: "write"
          },
          requiredAPIs: ["document-management", "visa-processing"]
        }
      },
      {
        id: "insurance-coordinator",
        name: "Travel Insurance Specialist",
        description: "Manages travel insurance and risk assessment",
        capabilities: ["insurance-planning", "risk-assessment", "claims-assistance"],
        defaultTemplate: "insurance-coordinator",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["insurance-policies", "risk-assessments", "claims-history"],
            accessLevel: "write"
          },
          requiredAPIs: ["insurance-platform", "claims-management"]
        }
      },
      {
        id: "loyalty-specialist",
        name: "Travel Loyalty Program Specialist",
        description: "Manages loyalty programs and rewards",
        capabilities: ["loyalty-management", "rewards-optimization", "member-services"],
        defaultTemplate: "loyalty-specialist",
        teamConfig: {
          canBeOrchestrator: false,
          recommendedTeamRole: "specialist",
          isolateConfig: {
            memoryLimit: 384,
            timeoutMs: 12000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["loyalty-programs", "member-data", "rewards-inventory"],
            accessLevel: "write"
          },
          requiredAPIs: ["loyalty-platform", "rewards-management"]
        }
      },
      {
        id: "emergency-response",
        name: "Travel Emergency Response Specialist",
        description: "Handles travel emergencies and crisis management",
        capabilities: ["emergency-response", "crisis-management", "coordination"],
        defaultTemplate: "emergency-response",
        teamConfig: {
          canBeOrchestrator: true,
          recommendedTeamRole: "leader",
          isolateConfig: {
            memoryLimit: 512,
            timeoutMs: 15000
          }
        },
        dataAccess: {
          vectorStore: {
            collections: ["emergency-protocols", "medical-facilities", "evacuation-plans"],
            accessLevel: "admin"
          },
          requiredAPIs: ["emergency-system", "medical-assistance"]
        }
      }
    ]
  }
];
