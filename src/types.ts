export interface StartupScore {
  overallScore: number;
  originality: number;
  practicality: number;
  viability: number;
  marketTiming: number;
  painLevel: number;
  competitionSaturation: number;
  scalability: number;
  survivalChances: number;
  profitabilityProbability: number;
  viralPotential: number;
  executionDifficulty: number;
  aiReplacementRisk: number;
}

export interface FlawAnalysis {
  brutalRoast: string;
  fundamentalFlaws: string[];
}

export interface MarketMetrics {
  estimatedTam: string;
  trendingStatus: 'rising' | 'stable' | 'declining' | 'hyped';
  targetAudience: string;
  category: string;
  customerAcquisitionDifficulty: 'easy' | 'medium' | 'hard' | 'extreme';
}

export interface Competitor {
  name: string;
  strength: string;
  weakness: string;
  pricingModel: string;
  survivalRiskFactor: string; // why they succeeded or failed, and your threat level
}

export interface MonetizationModel {
  strategy: string;
  tierName: string;
  suggestedPricing: string;
  pros: string;
  cons: string;
}

export interface RoadmapPhase {
  phase: string;
  timeline: string;
  objectives: string[];
}

export interface ExecutionGuide {
  mvpFeatures: string[];
  roadmap: RoadmapPhase[];
  suggestedTechStack: {
    frontend: string;
    backend: string;
    database: string;
    hosting: string;
  };
  keyHires: string[];
}

export interface InvestorMetrics {
  reaction: string;
  vcInterestProbability: number;
  bootstrapFriendliness: number;
  fundraisingDifficulty: 'low' | 'moderate' | 'high' | 'prohibitive';
}

export interface StartupAnalysis {
  id: string;
  idea: string;
  submittedAt: string;
  scores: StartupScore;
  roast: FlawAnalysis;
  market: MarketMetrics;
  competitors: Competitor[];
  monetization: MonetizationModel[];
  execution: ExecutionGuide;
  investor: InvestorMetrics;
  brutalModeEnabled: boolean;
  personalityType: string; // e.g. "Cynical VC", "Silicon Valley Guru", "Pragmatic Hacker"
}

export interface SavedIdea {
  id: string;
  idea: string;
  overallScore: number;
  submittedAt: string;
  category: string;
  analysis: StartupAnalysis;
}

export interface UserProfile {
  name: string;
  avatar: string;
  role: string;
  background: string;
  joinedAt: string;
  hasOnboarded: boolean;
}
