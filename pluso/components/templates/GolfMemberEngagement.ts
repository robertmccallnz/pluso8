import { AgentTemplate } from './AgentTemplates';

interface OnboardingStep {
  id: string;
  name: string;
  description: string;
  required: boolean;
  duration: number;
  resources: string[];
}

interface EngagementProgram {
  id: string;
  name: string;
  description: string;
  targetAudience: string[];
  duration: string;
  metrics: string[];
}

export const MEMBER_ENGAGEMENT_TEMPLATE: AgentTemplate = {
  id: 'member_engagement',
  name: 'Member Engagement & Onboarding Suite',
  description: 'Comprehensive member engagement and onboarding system',
  category: 'Membership',
  difficulty: 'intermediate',
  agents: [
    {
      role: 'onboarding',
      name: 'Onboarding Specialist',
      description: 'Guides new members through the onboarding process',
      capabilities: [
        'onboarding_management',
        'orientation',
        'member_education',
        'feedback_collection'
      ],
      systemPrompt: 'You are a welcoming onboarding specialist...',
      parameters: {
        temperature: 0.7,
        maxTokens: 300
      }
    },
    {
      role: 'engagement',
      name: 'Engagement Manager',
      description: 'Manages ongoing member engagement programs',
      capabilities: [
        'program_management',
        'event_coordination',
        'communication',
        'analytics'
      ],
      systemPrompt: 'You are an engaging membership manager...',
      parameters: {
        temperature: 0.6,
        maxTokens: 250
      }
    },
    {
      role: 'concierge',
      name: 'Member Concierge',
      description: 'Provides personalized member services',
      capabilities: [
        'service_coordination',
        'preference_management',
        'request_handling',
        'vip_services'
      ],
      systemPrompt: 'You are a helpful member concierge...',
      parameters: {
        temperature: 0.8,
        maxTokens: 300
      }
    }
  ],
  workflow: {
    type: 'adaptive',
    steps: [
      {
        id: 'onboarding',
        type: 'process',
        config: {
          phases: [
            'welcome',
            'orientation',
            'integration',
            'follow_up'
          ]
        }
      },
      {
        id: 'engagement',
        type: 'program',
        config: {
          activities: [
            'events',
            'communications',
            'services',
            'feedback'
          ]
        }
      }
    ]
  },
  evaluationCriteria: [
    { metric: 'onboarding_completion', threshold: 0.9, weight: 0.3 },
    { metric: 'member_satisfaction', threshold: 0.85, weight: 0.4 },
    { metric: 'engagement_rate', threshold: 0.8, weight: 0.3 }
  ]
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    name: 'Welcome Package',
    description: 'Initial welcome and club introduction',
    required: true,
    duration: 1,
    resources: ['welcome_guide', 'club_rules', 'member_card']
  },
  {
    id: 'orientation',
    name: 'Club Orientation',
    description: 'Guided tour and facility introduction',
    required: true,
    duration: 2,
    resources: ['facility_map', 'staff_intro', 'amenities_guide']
  },
  {
    id: 'golf_assessment',
    name: 'Golf Skills Assessment',
    description: 'Evaluation of golf skills and handicap',
    required: true,
    duration: 1,
    resources: ['pro_evaluation', 'handicap_card']
  },
  {
    id: 'social_intro',
    name: 'Social Integration',
    description: 'Introduction to club social activities',
    required: false,
    duration: 1,
    resources: ['events_calendar', 'social_groups']
  },
  {
    id: 'tech_setup',
    name: 'Technology Setup',
    description: 'Setup of club technology and apps',
    required: true,
    duration: 1,
    resources: ['mobile_app', 'booking_system', 'scoring_system']
  }
];

export const ENGAGEMENT_PROGRAMS: EngagementProgram[] = [
  {
    id: 'new_member',
    name: 'New Member Integration',
    description: 'First 90 days engagement program',
    targetAudience: ['new_members'],
    duration: '90_days',
    metrics: ['participation', 'satisfaction', 'retention']
  },
  {
    id: 'social_golf',
    name: 'Social Golf Program',
    description: 'Regular social golf events',
    targetAudience: ['all_members', 'social_golfers'],
    duration: 'ongoing',
    metrics: ['participation', 'satisfaction', 'frequency']
  },
  {
    id: 'competitive',
    name: 'Competitive Golf Program',
    description: 'Tournament and competition program',
    targetAudience: ['competitive_golfers'],
    duration: 'seasonal',
    metrics: ['participation', 'performance', 'satisfaction']
  },
  {
    id: 'family',
    name: 'Family Engagement',
    description: 'Family-oriented activities and events',
    targetAudience: ['families', 'juniors'],
    duration: 'ongoing',
    metrics: ['family_participation', 'satisfaction', 'retention']
  }
];

export const MEMBER_TOUCHPOINTS = {
  daily: [
    'Personalized greetings',
    'Service preferences',
    'Booking confirmations'
  ],
  weekly: [
    'Event invitations',
    'Golf tips',
    'Social activity updates'
  ],
  monthly: [
    'Newsletter',
    'Performance updates',
    'Satisfaction surveys'
  ],
  quarterly: [
    'Membership review',
    'Goal setting',
    'Program adjustments'
  ],
  annual: [
    'Anniversary recognition',
    'Membership renewal',
    'Year-in-review'
  ]
};

export const ENGAGEMENT_METRICS = {
  participation: {
    events: ['attendance', 'frequency', 'diversity'],
    facilities: ['usage_rate', 'peak_times', 'preferences'],
    programs: ['enrollment', 'completion', 'progression']
  },
  satisfaction: {
    service: ['responsiveness', 'quality', 'personalization'],
    facilities: ['availability', 'condition', 'amenities'],
    value: ['perceived_value', 'recommendation_rate', 'renewal_intent']
  },
  engagement: {
    social: ['connections', 'group_participation', 'event_hosting'],
    digital: ['app_usage', 'online_booking', 'communication_response'],
    community: ['volunteering', 'mentoring', 'feedback_provision']
  }
};
