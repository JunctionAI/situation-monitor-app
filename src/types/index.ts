// Risk Types
export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskScore {
  countryCode: string;
  countryName: string;
  tier: RiskTier;
  score: number; // 0-100
  factors: RiskFactor[];
  lastUpdated: string;
  trend: 'IMPROVING' | 'STABLE' | 'DETERIORATING';
  summary: string;
}

export interface RiskFactor {
  type: 'CONFLICT' | 'POLITICAL' | 'ECONOMIC' | 'NATURAL' | 'HEALTH' | 'TERRORISM';
  severity: number; // 0-100
  description: string;
}

export interface CountryRiskConfig {
  countryCode: string;
  countryName: string;
  baseRisk: number; // 0-100
  factors: {
    activeConflict: boolean;
    politicalInstability: number;
    economicCrisis: number;
    healthEmergency: number;
  };
  notes: string;
}

// News Types
export type NewsCategory =
  | 'geopolitics'
  | 'war'
  | 'technology'
  | 'ai'
  | 'economy'
  | 'climate'
  | 'health';

export interface NewsArticle {
  id: string;
  title: string;
  description: string | null;
  source: string;
  sourceId: string;
  author: string | null;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  category: NewsCategory;
  sentiment?: {
    score: number; // -1 to 1
    label: 'negative' | 'neutral' | 'positive';
  };
  relatedCountries?: string[]; // ISO codes
}

export interface NewsResponse {
  articles: NewsArticle[];
  totalResults: number;
  lastUpdated: string;
  cached: boolean;
  cacheAge?: number;
  stale?: boolean;
  sources?: string[];
  fetchTime?: number;
  errors?: string[];
}

// Map Types
export interface TooltipData {
  country: string;
  code: string;
  risk: RiskScore | null;
  recentNews: NewsArticle[];
}

export interface MapPosition {
  x: number;
  y: number;
}

// API Types
export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: Array<{
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
  }>;
}

// Extended Country Profile Types
export interface ExtendedCountryProfile {
  code: string;
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  region: string;
  subregion: string;
  population: number;
  area: number;
  borders: string[];
  landlocked: boolean;
  coordinates: { lat: number; lng: number };
  timezones: string[];
  languages: Record<string, string>;
  currencies: Record<string, { name: string; symbol: string }>;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  coatOfArms?: { png: string; svg: string };
  independent: boolean;
  unMember: boolean;
  tld?: string[];
  callingCode?: string;
}

export interface EconomicProfile {
  gdp?: {
    nominal?: number;
    perCapita?: number;
    growth?: number;
  };
  gdpGrowth?: number;      // Annual GDP growth %
  inflation?: number;       // Annual inflation %
  unemployment?: number;    // Unemployment rate %
  currencies: Record<string, { name: string; symbol: string }>;
  majorExports?: string[];
  majorImports?: string[];
  tradingPartners?: string[];
  economicBlocs?: string[];
  economicOutlook?: string;
}

export interface PoliticalProfile {
  government: string;
  headOfState?: {
    title: string;
    name: string;
    since?: string;
  };
  headOfGovernment?: {
    title: string;
    name: string;
    since?: string;
  };
  legislature?: string;
  internationalOrganizations?: string[];
  politicalAnalysis?: string;
}

export interface HistoricalProfile {
  summary: string;
  extract?: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  keyEvents?: Array<{
    year: string;
    event: string;
  }>;
  independence?: {
    date?: string;
    from?: string;
  };
  historicalContext?: string;
}

export interface StrategicProfile {
  militaryStrength?: 'weak' | 'moderate' | 'strong' | 'major_power';
  nuclearStatus?: 'none' | 'seeking' | 'suspected' | 'confirmed';
  alliances?: string[];
  rivalries?: string[];
  strategicAssets?: string[];
  keyInterests?: string[];
}

export interface CountryProfileResponse {
  basic: ExtendedCountryProfile;
  economic: EconomicProfile;
  political: PoliticalProfile;
  historical: HistoricalProfile;
  strategic?: StrategicProfile;
  lastUpdated: string;
  cached: boolean;
}
