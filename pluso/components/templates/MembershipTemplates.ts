import { AgentTemplate } from './AgentTemplates';

export interface CustomizationOption {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'tags';
  default: any;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    required?: boolean;
  };
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: string[];
}

export const MEMBERSHIP_TEMPLATES: Record<string, AgentTemplate> = {
  golfClub: {
    id: 'golf_club',
    name: 'Golf Club Management',
    description: 'Comprehensive golf club management system',
    category: 'Sports',
    difficulty: 'intermediate',
    agents: [
      {
        role: 'membership',
        name: 'Membership Manager',
        description: 'Handles member relations and requests',
        capabilities: ['member_management', 'scheduling', 'communication'],
        systemPrompt: 'You are a golf club membership manager...',
        parameters: {
          temperature: 0.7,
          maxTokens: 200
        }
      },
      {
        role: 'events',
        name: 'Tournament Organizer',
        description: 'Manages tournaments and events',
        capabilities: ['event_planning', 'scoring', 'rankings'],
        systemPrompt: 'You are a golf tournament organizer...',
        parameters: {
          temperature: 0.6,
          maxTokens: 300
        }
      },
      {
        role: 'facilities',
        name: 'Facilities Manager',
        description: 'Manages course and facility bookings',
        capabilities: ['booking_management', 'maintenance_scheduling'],
        systemPrompt: 'You are a facilities manager...',
        parameters: {
          temperature: 0.5,
          maxTokens: 200
        }
      }
    ],
    workflow: {
      type: 'parallel',
      steps: [
        {
          id: 'member_services',
          type: 'service',
          config: { services: ['bookings', 'tournaments', 'lessons'] }
        },
        {
          id: 'facility_management',
          type: 'management',
          config: { areas: ['course', 'clubhouse', 'practice'] }
        }
      ]
    },
    evaluationCriteria: [
      { metric: 'member_satisfaction', threshold: 0.85, weight: 0.4 },
      { metric: 'facility_utilization', threshold: 0.8, weight: 0.3 },
      { metric: 'event_success_rate', threshold: 0.9, weight: 0.3 }
    ]
  },

  sportsClub: {
    id: 'sports_club',
    name: 'Sports Club Operations',
    description: 'Multi-sport club management system',
    category: 'Sports',
    difficulty: 'intermediate',
    agents: [
      {
        role: 'coordinator',
        name: 'Sports Coordinator',
        description: 'Coordinates sports programs and teams',
        capabilities: ['program_management', 'team_coordination'],
        systemPrompt: 'You are a sports club coordinator...',
        parameters: {
          temperature: 0.6,
          maxTokens: 250
        }
      },
      {
        role: 'scheduler',
        name: 'Facility Scheduler',
        description: 'Manages facility bookings and schedules',
        capabilities: ['scheduling', 'resource_management'],
        systemPrompt: 'You are a facility scheduler...',
        parameters: {
          temperature: 0.4,
          maxTokens: 200
        }
      }
    ],
    workflow: {
      type: 'hierarchical',
      steps: [
        {
          id: 'program_management',
          type: 'management',
          config: { programs: ['youth', 'adult', 'competitive'] }
        },
        {
          id: 'facility_scheduling',
          type: 'scheduling',
          config: { facilities: ['courts', 'fields', 'gym'] }
        }
      ]
    },
    evaluationCriteria: [
      { metric: 'program_participation', threshold: 0.8, weight: 0.4 },
      { metric: 'facility_efficiency', threshold: 0.85, weight: 0.3 },
      { metric: 'member_retention', threshold: 0.9, weight: 0.3 }
    ]
  },

  gardeningClub: {
    id: 'gardening_club',
    name: 'Gardening Club Hub',
    description: 'Garden club and community management',
    category: 'Hobby',
    difficulty: 'beginner',
    agents: [
      {
        role: 'coordinator',
        name: 'Garden Coordinator',
        description: 'Manages garden activities and education',
        capabilities: ['event_planning', 'education', 'community_management'],
        systemPrompt: 'You are a garden club coordinator...',
        parameters: {
          temperature: 0.7,
          maxTokens: 300
        }
      },
      {
        role: 'expert',
        name: 'Gardening Expert',
        description: 'Provides gardening advice and knowledge',
        capabilities: ['plant_knowledge', 'problem_solving'],
        systemPrompt: 'You are a gardening expert...',
        parameters: {
          temperature: 0.6,
          maxTokens: 400
        }
      }
    ],
    workflow: {
      type: 'collaborative',
      steps: [
        {
          id: 'community_engagement',
          type: 'engagement',
          config: { activities: ['workshops', 'shows', 'sharing'] }
        },
        {
          id: 'knowledge_sharing',
          type: 'education',
          config: { formats: ['tips', 'guides', 'qa'] }
        }
      ]
    },
    evaluationCriteria: [
      { metric: 'community_engagement', threshold: 0.8, weight: 0.4 },
      { metric: 'knowledge_quality', threshold: 0.85, weight: 0.3 },
      { metric: 'event_satisfaction', threshold: 0.9, weight: 0.3 }
    ]
  },

  bookClub: {
    id: 'book_club',
    name: 'Book Club Central',
    description: 'Book club organization and discussion management',
    category: 'Culture',
    difficulty: 'beginner',
    agents: [
      {
        role: 'facilitator',
        name: 'Discussion Facilitator',
        description: 'Manages book discussions and meetings',
        capabilities: ['discussion_management', 'literary_analysis'],
        systemPrompt: 'You are a book club facilitator...',
        parameters: {
          temperature: 0.8,
          maxTokens: 400
        }
      },
      {
        role: 'curator',
        name: 'Book Curator',
        description: 'Selects and recommends books',
        capabilities: ['book_recommendation', 'genre_analysis'],
        systemPrompt: 'You are a book curator...',
        parameters: {
          temperature: 0.7,
          maxTokens: 300
        }
      }
    ],
    workflow: {
      type: 'sequential',
      steps: [
        {
          id: 'book_selection',
          type: 'curation',
          config: { criteria: ['diversity', 'interest', 'accessibility'] }
        },
        {
          id: 'discussion_management',
          type: 'facilitation',
          config: { formats: ['in-person', 'virtual', 'hybrid'] }
        }
      ]
    },
    evaluationCriteria: [
      { metric: 'discussion_quality', threshold: 0.85, weight: 0.4 },
      { metric: 'member_participation', threshold: 0.8, weight: 0.3 },
      { metric: 'book_satisfaction', threshold: 0.9, weight: 0.3 }
    ]
  }
};

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'sports',
    name: 'Sports Clubs',
    description: 'Templates for sports and athletic organizations',
    icon: '🏅',
    templates: ['golf_club', 'sports_club']
  },
  {
    id: 'hobby',
    name: 'Hobby Clubs',
    description: 'Templates for hobby and interest groups',
    icon: '🎨',
    templates: ['gardening_club']
  },
  {
    id: 'culture',
    name: 'Cultural Clubs',
    description: 'Templates for cultural and artistic organizations',
    icon: '📚',
    templates: ['book_club']
  }
];

export const CUSTOMIZATION_OPTIONS: Record<string, CustomizationOption[]> = {
  golf_club: [
    {
      id: 'tournament_types',
      name: 'Tournament Types',
      description: 'Types of tournaments to support',
      type: 'tags',
      default: ['singles', 'doubles', 'handicap'],
      validation: { required: true }
    },
    {
      id: 'booking_window',
      name: 'Booking Window',
      description: 'Days in advance for bookings',
      type: 'number',
      default: 14,
      validation: { min: 1, max: 60 }
    }
  ],
  sports_club: [
    {
      id: 'sports_offered',
      name: 'Sports Offered',
      description: 'List of sports programs',
      type: 'tags',
      default: ['tennis', 'basketball', 'volleyball'],
      validation: { required: true }
    },
    {
      id: 'age_groups',
      name: 'Age Groups',
      description: 'Supported age groups',
      type: 'select',
      options: ['youth', 'adult', 'senior', 'all'],
      default: 'all'
    }
  ],
  gardening_club: [
    {
      id: 'garden_type',
      name: 'Garden Type',
      description: 'Type of gardening focus',
      type: 'select',
      options: ['ornamental', 'vegetable', 'mixed'],
      default: 'mixed'
    },
    {
      id: 'event_frequency',
      name: 'Event Frequency',
      description: 'Frequency of club events',
      type: 'select',
      options: ['weekly', 'biweekly', 'monthly'],
      default: 'monthly'
    }
  ],
  book_club: [
    {
      id: 'meeting_format',
      name: 'Meeting Format',
      description: 'Preferred meeting format',
      type: 'select',
      options: ['in-person', 'virtual', 'hybrid'],
      default: 'hybrid'
    },
    {
      id: 'genre_focus',
      name: 'Genre Focus',
      description: 'Primary book genres',
      type: 'tags',
      default: ['fiction', 'non-fiction'],
      validation: { required: true }
    }
  ]
};
