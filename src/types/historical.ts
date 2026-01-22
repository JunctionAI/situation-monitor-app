// Historical Timeline Types
// Supports time range from 1000 BCE to present

// Negative numbers represent BCE years, positive for CE
export type HistoricalYear = number;

export type HistoricalEra =
  | 'ANCIENT'        // 1000 BCE - 500 BCE
  | 'CLASSICAL'      // 500 BCE - 500 CE
  | 'MEDIEVAL'       // 500 CE - 1500 CE
  | 'EARLY_MODERN'   // 1500 CE - 1800 CE
  | 'MODERN'         // 1800 CE - 1945 CE
  | 'CONTEMPORARY';  // 1945 CE - Present

export interface EraDefinition {
  id: HistoricalEra;
  name: string;
  startYear: HistoricalYear;
  endYear: HistoricalYear;
  color: string;
  description: string;
}

export type EntityType =
  | 'empire'
  | 'kingdom'
  | 'republic'
  | 'city-state'
  | 'nation-state'
  | 'confederation'
  | 'caliphate'
  | 'dynasty';

export interface HistoricalEntity {
  id: string;
  name: string;
  type: EntityType;
  startYear: HistoricalYear;
  endYear: HistoricalYear | null; // null = still exists
  capital?: string;
  territory?: string[]; // Modern country codes that overlap
  color?: string;
  description?: string;
}

export type EventType =
  | 'WAR'
  | 'TREATY'
  | 'COLLAPSE'
  | 'FOUNDING'
  | 'CONQUEST'
  | 'REVOLUTION'
  | 'DISASTER'
  | 'ALLIANCE'
  | 'INDEPENDENCE'
  | 'UNIFICATION'
  | 'TENSION';

export type EventSignificance = 'MINOR' | 'MAJOR' | 'PIVOTAL';

export interface HistoricalEvent {
  id: string;
  year: HistoricalYear;
  endYear?: HistoricalYear; // For multi-year events
  title: string;
  description: string;
  type: EventType;
  significance: EventSignificance;
  coordinates?: [number, number]; // lng, lat
  involvedEntities: string[]; // Entity IDs or country codes
  keywords?: string[];
}

export interface EntitySnapshot {
  entityId: string;
  name: string;
  type: EntityType;
  riskScore?: number;
  stability?: 'STABLE' | 'UNSTABLE' | 'CRISIS' | 'COLLAPSE';
  notes?: string;
}

export interface HistoricalRiskZone {
  id: string;
  name: string;
  coordinates: [number, number];
  radius: number; // km
  riskLevel: number; // 0-100
  type: 'conflict' | 'tension' | 'crisis';
  description?: string;
}

export interface YearSnapshot {
  year: HistoricalYear;
  era: HistoricalEra;
  boundaryGeoJsonUrl?: string;
  entities: EntitySnapshot[];
  events: HistoricalEvent[];
  risks: HistoricalRiskZone[];
  majorPowers?: string[]; // Top powers of the era
  summary?: string; // AI-generated or curated summary
}

export interface TimelineMode {
  type: 'LIVE' | 'HISTORICAL';
  year: HistoricalYear | null; // null = current/live
}

export interface TimelineMilestone {
  year: HistoricalYear;
  label: string;
  significance: EventSignificance;
  eventId?: string;
}
