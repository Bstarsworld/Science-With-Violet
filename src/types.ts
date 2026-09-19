export interface ScienceFactItem {
  emoji: string;
  headline: string;
  detail: string;
  gradeBadge?: string; // e.g. "K-2" or "3-5"
}

export interface HomeExperimentData {
  title: string;
  subtitle: string;
  timeEstimate: string;
  difficulty: 'Super Easy' | 'Fun & Easy' | 'With a Grown-Up';
  materials: string[];
  steps: string[];
  scienceWhy: string;
}

export interface ScienceNodeData {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  accentColor: string;
  glowColor: string;
  icon: string;
  emoji: string;
  position: [number, number, number]; // 3D coordinates around planet
  gradeTarget: string;
  bigQuestion: string;
  description: string;
  companionProps: string[];
  funFact: string;
  coreConcepts: string[];
  awesomeFacts: ScienceFactItem[];
  homeExperiment: HomeExperimentData;
  activities: {
    title: string;
    description: string;
    badge: string;
  }[];
}

export type ActiveModal = 
  | { type: 'node'; data: ScienceNodeData; defaultTab?: 'explore' | 'game' | 'experiment' }
  | { type: 'about' }
  | { type: 'contact' }
  | { type: 'arcade' }
  | { type: 'videos' }
  | null;

