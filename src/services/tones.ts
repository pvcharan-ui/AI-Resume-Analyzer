import type { ToneOption } from '../types';

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: 'professional',
    label: 'Professional & Direct',
    tagline: 'Standard Corporate & Clear',
    description: 'Crisp, structured, respectful, and focused on business value and role alignment.',
    iconName: 'Briefcase',
  },
  {
    id: 'confident',
    label: 'Confident & Impact-Driven',
    tagline: 'Results & Ownership Focused',
    description: 'Highlights tangible milestones, problem-solving track record, and proactive initiative.',
    iconName: 'TrendingUp',
  },
  {
    id: 'conversational',
    label: 'Conversational & Warm',
    tagline: 'Authentic & Relatable',
    description: 'Modern, engaging narrative tone suitable for collaborative tech cultures and startups.',
    iconName: 'MessageSquare',
  },
  {
    id: 'enthusiastic',
    label: 'Enthusiastic & Dynamic',
    tagline: 'High Energy & Passionate',
    description: 'Expresses genuine passion for company mission, rapid learning, and energetic contribution.',
    iconName: 'Flame',
  },
  {
    id: 'executive',
    label: 'Executive & Strategic',
    tagline: 'High-Level & Architectural',
    description: 'Emphasizes organizational impact, system-level thinking, team enablement, and ROI.',
    iconName: 'Award',
  },
];
