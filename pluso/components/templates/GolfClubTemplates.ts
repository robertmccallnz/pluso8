import { AgentTemplate } from './AgentTemplates';

export const GOLF_TEMPLATES: Record<string, AgentTemplate> = {
  tournamentManager: {
    id: 'tournament_manager',
    name: 'Tournament Management Suite',
    description: 'Complete tournament organization and management system',
    category: 'Golf Operations',
    difficulty: 'advanced',
    agents: [
      {
        role: 'director',
        name: 'Tournament Director',
        description: 'Oversees tournament operations',
        capabilities: ['tournament_planning', 'rules_management', 'scoring'],
        systemPrompt: 'You are a professional tournament director...',
        parameters: {
          temperature: 0.6,
          maxTokens: 300
        }
      },
      {
        role: 'registrar',
        name: 'Player Registrar',
        description: 'Manages player registration and handicaps',
        capabilities: ['registration', 'handicap_management', 'player_grouping'],
        systemPrompt: 'You are a tournament registrar...',
        parameters: {
          temperature: 0.4,
          maxTokens: 200
        }
      },
      {
        role: 'scorer',
        name: 'Scoring Manager',
        description: 'Handles live scoring and leaderboards',
        capabilities: ['live_scoring', 'leaderboard_management', 'statistics'],
        systemPrompt: 'You are a scoring manager...',
        parameters: {
          temperature: 0.3,
          maxTokens: 200
        }
      }
    ],
    workflow: {
      type: 'sequential',
      steps: [
        {
          id: 'setup',
          type: 'configuration',
          config: {
            settings: [
              'format',
              'divisions',
              'rules',
              'schedule'
            ]
          }
        },
        {
          id: 'registration',
          type: 'process',
          config: {
            phases: [
              'open_registration',
              'validation',
              'grouping'
            ]
          }
        },
        {
          id: 'execution',
          type: 'management',
          config: {
            components: [
              'scoring',
              'leaderboard',
              'communications'
            ]
          }
        }
      ]
    },
    evaluationCriteria: [
      { metric: 'registration_efficiency', threshold: 0.95, weight: 0.3 },
      { metric: 'scoring_accuracy', threshold: 0.99, weight: 0.4 },
      { metric: 'player_satisfaction', threshold: 0.9, weight: 0.3 }
    ]
  },

  eventPlanner: {
    id: 'event_planner',
    name: 'Golf Event Planning System',
    description: 'Comprehensive event planning for golf clubs',
    category: 'Events',
    difficulty: 'intermediate',
    agents: [
      {
        role: 'coordinator',
        name: 'Event Coordinator',
        description: 'Plans and coordinates golf events',
        capabilities: ['event_planning', 'vendor_management', 'scheduling'],
        systemPrompt: 'You are an experienced event coordinator...',
        parameters: {
          temperature: 0.7,
          maxTokens: 300
        }
      },
      {
        role: 'hospitality',
        name: 'Hospitality Manager',
        description: 'Manages catering and guest services',
        capabilities: ['catering_management', 'guest_services', 'venue_setup'],
        systemPrompt: 'You are a hospitality manager...',
        parameters: {
          temperature: 0.6,
          maxTokens: 250
        }
      }
    ],
    workflow: {
      type: 'parallel',
      steps: [
        {
          id: 'planning',
          type: 'coordination',
          config: {
            aspects: [
              'scheduling',
              'vendors',
              'logistics'
            ]
          }
        },
        {
          id: 'execution',
          type: 'management',
          config: {
            services: [
              'catering',
              'setup',
              'staff'
            ]
          }
        }
      ]
    },
    evaluationCriteria: [
      { metric: 'event_success', threshold: 0.9, weight: 0.4 },
      { metric: 'guest_satisfaction', threshold: 0.85, weight: 0.3 },
      { metric: 'budget_adherence', threshold: 0.95, weight: 0.3 }
    ]
  },

  weddingCoordinator: {
    id: 'wedding_coordinator',
    name: 'Golf Club Wedding Suite',
    description: 'Specialized wedding planning and coordination',
    category: 'Events',
    difficulty: 'advanced',
    agents: [
      {
        role: 'planner',
        name: 'Wedding Planner',
        description: 'Coordinates all wedding aspects',
        capabilities: ['wedding_planning', 'vendor_coordination', 'timeline_management'],
        systemPrompt: 'You are a dedicated wedding planner...',
        parameters: {
          temperature: 0.8,
          maxTokens: 400
        }
      },
      {
        role: 'venue',
        name: 'Venue Coordinator',
        description: 'Manages venue setup and logistics',
        capabilities: ['venue_management', 'setup_coordination', 'staff_management'],
        systemPrompt: 'You are a venue coordinator...',
        parameters: {
          temperature: 0.6,
          maxTokens: 300
        }
      },
      {
        role: 'catering',
        name: 'Catering Manager',
        description: 'Handles all food and beverage services',
        capabilities: ['menu_planning', 'service_coordination', 'dietary_management'],
        systemPrompt: 'You are a catering manager...',
        parameters: {
          temperature: 0.5,
          maxTokens: 250
        }
      }
    ],
    workflow: {
      type: 'hierarchical',
      steps: [
        {
          id: 'planning',
          type: 'coordination',
          config: {
            phases: [
              'consultation',
              'design',
              'vendor_selection'
            ]
          }
        },
        {
          id: 'preparation',
          type: 'management',
          config: {
            tasks: [
              'timeline',
              'setup',
              'rehearsal'
            ]
          }
        }
      ]
    },
    evaluationCriteria: [
      { metric: 'client_satisfaction', threshold: 0.95, weight: 0.4 },
      { metric: 'execution_quality', threshold: 0.9, weight: 0.3 },
      { metric: 'vendor_coordination', threshold: 0.9, weight: 0.3 }
    ]
  },

  facilityManager: {
    id: 'facility_manager',
    name: 'Golf Facility Management',
    description: 'Comprehensive facility and course management',
    category: 'Operations',
    difficulty: 'advanced',
    agents: [
      {
        role: 'operations',
        name: 'Operations Manager',
        description: 'Oversees facility operations',
        capabilities: ['facility_management', 'maintenance_scheduling', 'staff_coordination'],
        systemPrompt: 'You are a facility operations manager...',
        parameters: {
          temperature: 0.5,
          maxTokens: 300
        }
      },
      {
        role: 'maintenance',
        name: 'Course Superintendent',
        description: 'Manages course maintenance',
        capabilities: ['course_maintenance', 'resource_management', 'quality_control'],
        systemPrompt: 'You are a golf course superintendent...',
        parameters: {
          temperature: 0.4,
          maxTokens: 250
        }
      },
      {
        role: 'proshop',
        name: 'Pro Shop Manager',
        description: 'Manages pro shop operations',
        capabilities: ['inventory_management', 'sales', 'customer_service'],
        systemPrompt: 'You are a pro shop manager...',
        parameters: {
          temperature: 0.6,
          maxTokens: 200
        }
      }
    ],
    workflow: {
      type: 'parallel',
      steps: [
        {
          id: 'daily_operations',
          type: 'management',
          config: {
            areas: [
              'course',
              'clubhouse',
              'proshop'
            ]
          }
        },
        {
          id: 'maintenance',
          type: 'scheduling',
          config: {
            tasks: [
              'routine',
              'preventive',
              'emergency'
            ]
          }
        }
      ]
    },
    evaluationCriteria: [
      { metric: 'facility_condition', threshold: 0.9, weight: 0.4 },
      { metric: 'operational_efficiency', threshold: 0.85, weight: 0.3 },
      { metric: 'member_satisfaction', threshold: 0.9, weight: 0.3 }
    ]
  },

  membershipManager: {
    id: 'membership_manager',
    name: 'Golf Club Membership System',
    description: 'Complete membership management solution',
    category: 'Administration',
    difficulty: 'intermediate',
    agents: [
      {
        role: 'manager',
        name: 'Membership Manager',
        description: 'Handles member relations and services',
        capabilities: ['member_management', 'communication', 'service_coordination'],
        systemPrompt: 'You are a membership manager...',
        parameters: {
          temperature: 0.7,
          maxTokens: 300
        }
      },
      {
        role: 'billing',
        name: 'Billing Coordinator',
        description: 'Manages membership billing and fees',
        capabilities: ['billing_management', 'payment_processing', 'reporting'],
        systemPrompt: 'You are a billing coordinator...',
        parameters: {
          temperature: 0.4,
          maxTokens: 200
        }
      }
    ],
    workflow: {
      type: 'sequential',
      steps: [
        {
          id: 'member_services',
          type: 'management',
          config: {
            services: [
              'onboarding',
              'support',
              'engagement'
            ]
          }
        },
        {
          id: 'billing',
          type: 'process',
          config: {
            tasks: [
              'invoicing',
              'collections',
              'reporting'
            ]
          }
        }
      ]
    },
    evaluationCriteria: [
      { metric: 'member_retention', threshold: 0.9, weight: 0.4 },
      { metric: 'service_quality', threshold: 0.85, weight: 0.3 },
      { metric: 'billing_accuracy', threshold: 0.99, weight: 0.3 }
    ]
  }
};

export const GOLF_CUSTOMIZATION_OPTIONS = {
  tournament_manager: [
    {
      id: 'tournament_format',
      name: 'Tournament Format',
      description: 'Type of tournament format',
      type: 'select',
      options: ['stroke_play', 'match_play', 'scramble', 'best_ball'],
      default: 'stroke_play'
    },
    {
      id: 'scoring_system',
      name: 'Scoring System',
      description: 'Method for tracking scores',
      type: 'select',
      options: ['digital', 'manual', 'hybrid'],
      default: 'hybrid'
    }
  ],
  event_planner: [
    {
      id: 'event_type',
      name: 'Event Type',
      description: 'Type of golf event',
      type: 'select',
      options: ['corporate', 'charity', 'member', 'private'],
      default: 'member'
    },
    {
      id: 'catering_service',
      name: 'Catering Service',
      description: 'Level of catering service',
      type: 'select',
      options: ['basic', 'premium', 'luxury'],
      default: 'premium'
    }
  ],
  wedding_coordinator: [
    {
      id: 'package_type',
      name: 'Wedding Package',
      description: 'Wedding package level',
      type: 'select',
      options: ['essential', 'premium', 'luxury'],
      default: 'premium'
    },
    {
      id: 'venue_setup',
      name: 'Venue Setup',
      description: 'Wedding venue configuration',
      type: 'tags',
      default: ['ceremony', 'reception', 'photos'],
      validation: { required: true }
    }
  ],
  facility_manager: [
    {
      id: 'maintenance_schedule',
      name: 'Maintenance Schedule',
      description: 'Facility maintenance frequency',
      type: 'select',
      options: ['daily', 'weekly', 'monthly'],
      default: 'daily'
    },
    {
      id: 'resource_allocation',
      name: 'Resource Allocation',
      description: 'Resource management strategy',
      type: 'select',
      options: ['standard', 'intensive', 'minimal'],
      default: 'standard'
    }
  ]
};
