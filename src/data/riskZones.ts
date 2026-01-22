import { CountryRiskConfig, RiskTier } from '@/types';

// Predefined risk levels for known conflict zones and areas of instability
// These serve as baseline values that can be adjusted by AI sentiment analysis
export const RISK_ZONES: Record<string, CountryRiskConfig> = {
  // CRITICAL (76-100) - Active conflicts
  'UKR': {
    countryCode: 'UKR',
    countryName: 'Ukraine',
    baseRisk: 95,
    factors: { activeConflict: true, politicalInstability: 70, economicCrisis: 60, healthEmergency: 30 },
    notes: 'Active war zone - Russian invasion ongoing since 2022'
  },
  'PSE': {
    countryCode: 'PSE',
    countryName: 'Palestine',
    baseRisk: 95,
    factors: { activeConflict: true, politicalInstability: 90, economicCrisis: 85, healthEmergency: 70 },
    notes: 'Active conflict in Gaza - humanitarian crisis'
  },
  'ISR': {
    countryCode: 'ISR',
    countryName: 'Israel',
    baseRisk: 80,
    factors: { activeConflict: true, politicalInstability: 50, economicCrisis: 20, healthEmergency: 10 },
    notes: 'Active military operations - regional tensions'
  },
  'SYR': {
    countryCode: 'SYR',
    countryName: 'Syria',
    baseRisk: 90,
    factors: { activeConflict: true, politicalInstability: 95, economicCrisis: 90, healthEmergency: 60 },
    notes: 'Civil war aftermath - fragmented control, ongoing instability'
  },
  'YEM': {
    countryCode: 'YEM',
    countryName: 'Yemen',
    baseRisk: 88,
    factors: { activeConflict: true, politicalInstability: 90, economicCrisis: 95, healthEmergency: 80 },
    notes: 'Civil war - humanitarian catastrophe'
  },
  'SDN': {
    countryCode: 'SDN',
    countryName: 'Sudan',
    baseRisk: 85,
    factors: { activeConflict: true, politicalInstability: 95, economicCrisis: 80, healthEmergency: 70 },
    notes: 'Civil war between military factions since 2023'
  },
  'MMR': {
    countryCode: 'MMR',
    countryName: 'Myanmar',
    baseRisk: 82,
    factors: { activeConflict: true, politicalInstability: 90, economicCrisis: 70, healthEmergency: 50 },
    notes: 'Military coup 2021 - ongoing civil resistance and ethnic conflicts'
  },
  'LBY': {
    countryCode: 'LBY',
    countryName: 'Libya',
    baseRisk: 78,
    factors: { activeConflict: true, politicalInstability: 85, economicCrisis: 50, healthEmergency: 30 },
    notes: 'Divided government - militia conflicts'
  },

  // HIGH (51-75) - Significant instability
  'AFG': {
    countryCode: 'AFG',
    countryName: 'Afghanistan',
    baseRisk: 75,
    factors: { activeConflict: false, politicalInstability: 90, economicCrisis: 95, healthEmergency: 60 },
    notes: 'Taliban control - humanitarian crisis, womens rights violations'
  },
  'HTI': {
    countryCode: 'HTI',
    countryName: 'Haiti',
    baseRisk: 72,
    factors: { activeConflict: true, politicalInstability: 95, economicCrisis: 85, healthEmergency: 70 },
    notes: 'Gang violence - state collapse, humanitarian emergency'
  },
  'VEN': {
    countryCode: 'VEN',
    countryName: 'Venezuela',
    baseRisk: 65,
    factors: { activeConflict: false, politicalInstability: 80, economicCrisis: 90, healthEmergency: 50 },
    notes: 'Economic collapse - political crisis, mass migration'
  },
  'IRQ': {
    countryCode: 'IRQ',
    countryName: 'Iraq',
    baseRisk: 62,
    factors: { activeConflict: false, politicalInstability: 70, economicCrisis: 50, healthEmergency: 30 },
    notes: 'Post-conflict instability - sectarian tensions'
  },
  'SOM': {
    countryCode: 'SOM',
    countryName: 'Somalia',
    baseRisk: 70,
    factors: { activeConflict: true, politicalInstability: 80, economicCrisis: 75, healthEmergency: 60 },
    notes: 'Al-Shabaab insurgency - weak central government'
  },
  'COD': {
    countryCode: 'COD',
    countryName: 'Democratic Republic of Congo',
    baseRisk: 68,
    factors: { activeConflict: true, politicalInstability: 70, economicCrisis: 60, healthEmergency: 55 },
    notes: 'Eastern DRC conflict - M23 and other armed groups'
  },
  'ETH': {
    countryCode: 'ETH',
    countryName: 'Ethiopia',
    baseRisk: 60,
    factors: { activeConflict: false, politicalInstability: 65, economicCrisis: 55, healthEmergency: 40 },
    notes: 'Post-Tigray war - ethnic tensions, drought'
  },
  'PRK': {
    countryCode: 'PRK',
    countryName: 'North Korea',
    baseRisk: 55,
    factors: { activeConflict: false, politicalInstability: 30, economicCrisis: 80, healthEmergency: 60 },
    notes: 'Nuclear tensions - isolated regime, food insecurity'
  },
  'LBN': {
    countryCode: 'LBN',
    countryName: 'Lebanon',
    baseRisk: 58,
    factors: { activeConflict: false, politicalInstability: 75, economicCrisis: 90, healthEmergency: 40 },
    notes: 'Economic collapse - political deadlock, Hezbollah tensions'
  },

  // MEDIUM (26-50) - Elevated concerns
  'IRN': {
    countryCode: 'IRN',
    countryName: 'Iran',
    baseRisk: 50,
    factors: { activeConflict: false, politicalInstability: 60, economicCrisis: 55, healthEmergency: 20 },
    notes: 'Regional tensions - nuclear program, sanctions'
  },
  'PAK': {
    countryCode: 'PAK',
    countryName: 'Pakistan',
    baseRisk: 48,
    factors: { activeConflict: false, politicalInstability: 60, economicCrisis: 65, healthEmergency: 30 },
    notes: 'Political instability - economic crisis, extremism'
  },
  'NGA': {
    countryCode: 'NGA',
    countryName: 'Nigeria',
    baseRisk: 48,
    factors: { activeConflict: false, politicalInstability: 50, economicCrisis: 55, healthEmergency: 35 },
    notes: 'Boko Haram insurgency in north - banditry, kidnappings'
  },
  'RUS': {
    countryCode: 'RUS',
    countryName: 'Russia',
    baseRisk: 45,
    factors: { activeConflict: true, politicalInstability: 40, economicCrisis: 45, healthEmergency: 20 },
    notes: 'War aggressor - international isolation, sanctions impact'
  },
  'CHN': {
    countryCode: 'CHN',
    countryName: 'China',
    baseRisk: 35,
    factors: { activeConflict: false, politicalInstability: 25, economicCrisis: 40, healthEmergency: 15 },
    notes: 'Taiwan tensions - economic slowdown, regional disputes'
  },
  'TWN': {
    countryCode: 'TWN',
    countryName: 'Taiwan',
    baseRisk: 40,
    factors: { activeConflict: false, politicalInstability: 30, economicCrisis: 15, healthEmergency: 10 },
    notes: 'Cross-strait tensions with China - potential flashpoint'
  },
  'KOR': {
    countryCode: 'KOR',
    countryName: 'South Korea',
    baseRisk: 30,
    factors: { activeConflict: false, politicalInstability: 35, economicCrisis: 20, healthEmergency: 10 },
    notes: 'North Korea threat - political tensions'
  },
  'EGY': {
    countryCode: 'EGY',
    countryName: 'Egypt',
    baseRisk: 38,
    factors: { activeConflict: false, politicalInstability: 45, economicCrisis: 60, healthEmergency: 20 },
    notes: 'Economic pressure - regional instability spillover'
  },
  'TUR': {
    countryCode: 'TUR',
    countryName: 'Turkey',
    baseRisk: 35,
    factors: { activeConflict: false, politicalInstability: 40, economicCrisis: 50, healthEmergency: 15 },
    notes: 'Kurdish conflict - economic volatility, regional involvement'
  },
  'MEX': {
    countryCode: 'MEX',
    countryName: 'Mexico',
    baseRisk: 40,
    factors: { activeConflict: false, politicalInstability: 35, economicCrisis: 30, healthEmergency: 15 },
    notes: 'Cartel violence - organized crime, corruption'
  },
  'COL': {
    countryCode: 'COL',
    countryName: 'Colombia',
    baseRisk: 38,
    factors: { activeConflict: false, politicalInstability: 40, economicCrisis: 35, healthEmergency: 15 },
    notes: 'Drug trafficking - armed groups, peace process challenges'
  },
  'UGA': {
    countryCode: 'UGA',
    countryName: 'Uganda',
    baseRisk: 35,
    factors: { activeConflict: false, politicalInstability: 45, economicCrisis: 40, healthEmergency: 30 },
    notes: 'Authoritarian governance - regional instability'
  },
};

// Default risk configuration for countries not in the list
export const DEFAULT_RISK: CountryRiskConfig = {
  countryCode: 'DEFAULT',
  countryName: 'Unknown',
  baseRisk: 15,
  factors: { activeConflict: false, politicalInstability: 10, economicCrisis: 10, healthEmergency: 5 },
  notes: 'No significant alerts'
};

// Utility functions
export function getRiskConfig(countryCode: string): CountryRiskConfig {
  return RISK_ZONES[countryCode] || { ...DEFAULT_RISK, countryCode };
}

export function scoreToTier(score: number): RiskTier {
  if (score >= 76) return 'CRITICAL';
  if (score >= 51) return 'HIGH';
  if (score >= 26) return 'MEDIUM';
  return 'LOW';
}

export function tierToColor(tier: RiskTier): string {
  switch (tier) {
    case 'CRITICAL': return '#ef4444';
    case 'HIGH': return '#f97316';
    case 'MEDIUM': return '#eab308';
    case 'LOW': return '#22c55e';
  }
}

export function tierToLabel(tier: RiskTier): string {
  switch (tier) {
    case 'CRITICAL': return 'Critical Risk';
    case 'HIGH': return 'High Risk';
    case 'MEDIUM': return 'Medium Risk';
    case 'LOW': return 'Low Risk';
  }
}
