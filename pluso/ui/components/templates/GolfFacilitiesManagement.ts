import { AgentTemplate } from './AgentTemplates';

interface MaintenanceSchedule {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  priority: 'high' | 'medium' | 'low';
  tasks: string[];
  resources: string[];
}

interface FacilityArea {
  id: string;
  name: string;
  components: string[];
  maintenanceSchedules: string[];
  inspectionPoints: string[];
}

export const FACILITIES_TEMPLATE: AgentTemplate = {
  id: 'facilities_management',
  name: 'Golf Facilities Management Suite',
  description: 'Comprehensive facilities and course management system',
  category: 'Operations',
  difficulty: 'advanced',
  agents: [
    {
      role: 'director',
      name: 'Facilities Director',
      description: 'Oversees all facility operations',
      capabilities: [
        'operations_management',
        'budget_control',
        'staff_coordination',
        'strategic_planning'
      ],
      systemPrompt: 'You are an experienced facilities director...',
      parameters: {
        temperature: 0.5,
        maxTokens: 300
      }
    },
    {
      role: 'course',
      name: 'Course Manager',
      description: 'Manages golf course maintenance',
      capabilities: [
        'agronomy',
        'turf_management',
        'irrigation',
        'equipment_maintenance'
      ],
      systemPrompt: 'You are a skilled course manager...',
      parameters: {
        temperature: 0.4,
        maxTokens: 250
      }
    },
    {
      role: 'maintenance',
      name: 'Maintenance Coordinator',
      description: 'Coordinates maintenance activities',
      capabilities: [
        'scheduling',
        'resource_allocation',
        'vendor_management',
        'quality_control'
      ],
      systemPrompt: 'You are a detail-oriented maintenance coordinator...',
      parameters: {
        temperature: 0.4,
        maxTokens: 200
      }
    },
    {
      role: 'sustainability',
      name: 'Sustainability Manager',
      description: 'Manages environmental programs',
      capabilities: [
        'environmental_management',
        'water_conservation',
        'waste_management',
        'certification_compliance'
      ],
      systemPrompt: 'You are an environmentally conscious manager...',
      parameters: {
        temperature: 0.6,
        maxTokens: 250
      }
    }
  ],
  workflow: {
    type: 'hierarchical',
    steps: [
      {
        id: 'planning',
        type: 'management',
        config: {
          activities: [
            'scheduling',
            'budgeting',
            'resource_allocation'
          ]
        }
      },
      {
        id: 'execution',
        type: 'operations',
        config: {
          tasks: [
            'maintenance',
            'inspections',
            'improvements'
          ]
        }
      },
      {
        id: 'monitoring',
        type: 'oversight',
        config: {
          aspects: [
            'quality',
            'efficiency',
            'sustainability'
          ]
        }
      }
    ]
  },
  evaluationCriteria: [
    { metric: 'facility_condition', threshold: 0.9, weight: 0.3 },
    { metric: 'maintenance_efficiency', threshold: 0.85, weight: 0.3 },
    { metric: 'sustainability_score', threshold: 0.8, weight: 0.2 },
    { metric: 'member_satisfaction', threshold: 0.9, weight: 0.2 }
  ]
};

export const MAINTENANCE_SCHEDULES: MaintenanceSchedule[] = [
  {
    id: 'daily_course',
    name: 'Daily Course Maintenance',
    frequency: 'daily',
    priority: 'high',
    tasks: [
      'Mowing greens',
      'Bunker maintenance',
      'Debris removal',
      'Hole location change'
    ],
    resources: ['mowers', 'rakes', 'blowers']
  },
  {
    id: 'weekly_facilities',
    name: 'Weekly Facilities Check',
    frequency: 'weekly',
    priority: 'medium',
    tasks: [
      'Equipment inspection',
      'Clubhouse cleaning',
      'Pro shop inventory',
      'Practice area maintenance'
    ],
    resources: ['cleaning_supplies', 'inspection_tools', 'maintenance_equipment']
  },
  {
    id: 'monthly_infrastructure',
    name: 'Monthly Infrastructure',
    frequency: 'monthly',
    priority: 'medium',
    tasks: [
      'Irrigation system check',
      'Cart path inspection',
      'Drainage assessment',
      'Safety equipment check'
    ],
    resources: ['diagnostic_tools', 'repair_equipment', 'safety_gear']
  },
  {
    id: 'quarterly_renovation',
    name: 'Quarterly Renovation',
    frequency: 'quarterly',
    priority: 'high',
    tasks: [
      'Deep cleaning',
      'Major repairs',
      'System upgrades',
      'Landscape renovation'
    ],
    resources: ['contractors', 'specialized_equipment', 'materials']
  }
];

export const FACILITY_AREAS: FacilityArea[] = [
  {
    id: 'golf_course',
    name: 'Golf Course',
    components: [
      'Greens',
      'Fairways',
      'Tees',
      'Bunkers',
      'Rough',
      'Practice areas'
    ],
    maintenanceSchedules: ['daily_course', 'weekly_facilities'],
    inspectionPoints: [
      'Turf quality',
      'Irrigation coverage',
      'Drainage effectiveness',
      'Hazard conditions'
    ]
  },
  {
    id: 'clubhouse',
    name: 'Clubhouse',
    components: [
      'Locker rooms',
      'Pro shop',
      'Restaurant',
      'Meeting rooms',
      'Administrative offices'
    ],
    maintenanceSchedules: ['weekly_facilities', 'monthly_infrastructure'],
    inspectionPoints: [
      'Cleanliness',
      'Safety compliance',
      'Equipment condition',
      'Amenity status'
    ]
  },
  {
    id: 'practice_facility',
    name: 'Practice Facility',
    components: [
      'Driving range',
      'Putting green',
      'Chipping area',
      'Teaching facility'
    ],
    maintenanceSchedules: ['daily_course', 'weekly_facilities'],
    inspectionPoints: [
      'Turf condition',
      'Target accuracy',
      'Equipment condition',
      'Safety features'
    ]
  }
];

export const SUSTAINABILITY_INITIATIVES = {
  water_management: {
    practices: [
      'Smart irrigation',
      'Drought-resistant turf',
      'Water recycling',
      'Rain harvesting'
    ],
    metrics: [
      'Water usage',
      'Cost savings',
      'Coverage efficiency'
    ]
  },
  energy_efficiency: {
    practices: [
      'LED lighting',
      'Solar power',
      'Energy monitoring',
      'Equipment efficiency'
    ],
    metrics: [
      'Energy consumption',
      'Cost reduction',
      'Carbon footprint'
    ]
  },
  waste_reduction: {
    practices: [
      'Composting',
      'Recycling program',
      'Green procurement',
      'Waste sorting'
    ],
    metrics: [
      'Waste volume',
      'Recycling rate',
      'Cost savings'
    ]
  }
};

export const FACILITY_METRICS = {
  course_quality: {
    measurements: [
      'Green speed',
      'Turf density',
      'Soil quality',
      'Playing conditions'
    ],
    frequency: 'daily',
    benchmarks: {
      green_speed: '10-12 stimpmeter',
      turf_density: '90% coverage',
      soil_ph: '6.0-6.5'
    }
  },
  resource_efficiency: {
    measurements: [
      'Water usage',
      'Energy consumption',
      'Chemical usage',
      'Labor hours'
    ],
    frequency: 'monthly',
    benchmarks: {
      water_reduction: '15%',
      energy_savings: '20%',
      chemical_reduction: '10%'
    }
  },
  maintenance_performance: {
    measurements: [
      'Task completion',
      'Response time',
      'Quality scores',
      'Member feedback'
    ],
    frequency: 'weekly',
    benchmarks: {
      completion_rate: '95%',
      response_time: '24h',
      satisfaction: '4.5/5'
    }
  }
};
