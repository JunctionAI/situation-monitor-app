import { RiskTier } from '@/types';

export interface HotspotStats {
  casualties?: string;
  displaced?: string;
  duration?: string;
  territory?: string;
  economic?: string;
}

export interface KeyFact {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface Hotspot {
  id: string;
  name: string;
  label: string;
  coordinates: [number, number]; // [longitude, latitude]
  tier: RiskTier;
  type: 'conflict' | 'tension' | 'strategic' | 'nuclear' | 'economic';
  description: string;
  countries: string[]; // ISO codes of involved countries
  active: boolean;
  keywords: string[]; // For matching news articles
  // New fields for detailed stats
  startDate?: string;
  stats?: HotspotStats;
  keyFacts?: KeyFact[];
  parties?: string[]; // Main parties involved
  status?: string; // Current status summary
}

export const HOTSPOTS: Hotspot[] = [
  // Active Conflicts
  {
    id: 'ukraine-conflict',
    name: 'Ukraine War',
    label: 'UKRAINE CONFLICT',
    coordinates: [30.5, 50.4],
    tier: 'CRITICAL',
    type: 'conflict',
    description: 'Full-scale Russian invasion of Ukraine. Active frontlines in Donetsk, Luhansk, Zaporizhzhia, and Kherson oblasts. Daily missile and drone strikes on Ukrainian cities.',
    countries: ['UKR', 'RUS'],
    active: true,
    keywords: ['ukraine', 'kyiv', 'kiev', 'zelensky', 'russian invasion', 'donbas', 'crimea', 'kharkiv', 'odesa', 'zaporizhzhia', 'drone strike', 'missile strike', 'frontline'],
    startDate: '2022-02-24',
    parties: ['Ukraine Armed Forces', 'Russian Federation', 'Wagner Group'],
    status: 'Active combat operations - War of attrition',
    stats: {
      casualties: '500,000+ (est. both sides)',
      displaced: '6.5M+ refugees, 5M+ internal',
      duration: '2+ years',
      territory: '~18% of Ukraine occupied',
    },
    keyFacts: [
      { label: 'Front Line', value: '~1,000 km', trend: 'stable' },
      { label: 'Daily Strikes', value: '50-100+', trend: 'up' },
      { label: 'Western Aid', value: '$200B+ pledged', trend: 'stable' },
      { label: 'Threat Level', value: 'CRITICAL', trend: 'stable' },
    ]
  },
  {
    id: 'gaza-conflict',
    name: 'Gaza War',
    label: 'GAZA CONFLICT',
    coordinates: [34.47, 31.5],
    tier: 'CRITICAL',
    type: 'conflict',
    description: 'Israeli military operations in Gaza following Oct 7 Hamas attack. Massive humanitarian crisis with severe civilian casualties and infrastructure destruction.',
    countries: ['ISR', 'PSE'],
    active: true,
    keywords: ['gaza', 'israel', 'hamas', 'idf', 'netanyahu', 'palestinian', 'tel aviv', 'hostage', 'ceasefire', 'rafah', 'khan younis', 'humanitarian'],
    startDate: '2023-10-07',
    parties: ['Israel Defense Forces', 'Hamas', 'Palestinian Islamic Jihad'],
    status: 'Active military operations - Humanitarian emergency',
    stats: {
      casualties: '45,000+ Palestinian deaths reported',
      displaced: '1.9M+ (85% of Gaza population)',
      duration: '15+ months',
      territory: 'Gaza Strip (365 km²)',
    },
    keyFacts: [
      { label: 'Aid Access', value: 'Severely limited', trend: 'down' },
      { label: 'Hostages', value: '100+ held', trend: 'stable' },
      { label: 'Infrastructure', value: '60%+ destroyed', trend: 'down' },
      { label: 'Food Security', value: 'Famine conditions', trend: 'down' },
    ]
  },
  {
    id: 'sudan-civil-war',
    name: 'Sudan Civil War',
    label: 'SUDAN CIVIL WAR',
    coordinates: [32.5, 15.6],
    tier: 'CRITICAL',
    type: 'conflict',
    description: 'Civil war between Sudanese Armed Forces (SAF) and Rapid Support Forces (RSF). Ethnic violence in Darfur. One of world\'s worst humanitarian crises.',
    countries: ['SDN'],
    active: true,
    keywords: ['sudan', 'khartoum', 'rsf', 'rapid support forces', 'darfur', 'saf', 'burhan', 'hemedti', 'sudanese'],
    startDate: '2023-04-15',
    parties: ['Sudanese Armed Forces (SAF)', 'Rapid Support Forces (RSF)'],
    status: 'Active civil war - Ethnic cleansing reported in Darfur',
    stats: {
      casualties: '15,000+ deaths (est.)',
      displaced: '10M+ (world\'s largest displacement)',
      duration: '20+ months',
      territory: 'Nationwide conflict',
    },
    keyFacts: [
      { label: 'Displaced', value: '10M+ people', trend: 'up' },
      { label: 'Food Crisis', value: '25M need aid', trend: 'up' },
      { label: 'Health System', value: '70% collapsed', trend: 'down' },
      { label: 'Media Coverage', value: 'Minimal', trend: 'stable' },
    ]
  },
  {
    id: 'yemen-war',
    name: 'Yemen War',
    label: 'YEMEN CONFLICT',
    coordinates: [44.2, 15.4],
    tier: 'CRITICAL',
    type: 'conflict',
    description: 'Ongoing civil war and Houthi insurgency. Red Sea shipping attacks causing global trade disruption. World\'s worst humanitarian crisis.',
    countries: ['YEM'],
    active: true,
    keywords: ['yemen', 'houthi', 'sanaa', 'red sea', 'saudi', 'aden', 'shipping attack', 'ansar allah'],
    startDate: '2014-09-21',
    parties: ['Houthis (Ansar Allah)', 'Yemeni Government', 'Saudi-led Coalition'],
    status: 'Fragile truce on land - Active Red Sea attacks',
    stats: {
      casualties: '150,000+ conflict deaths',
      displaced: '4.5M+ internally displaced',
      duration: '10+ years',
      economic: '$200B+ in damages',
    },
    keyFacts: [
      { label: 'Famine Risk', value: '17M food insecure', trend: 'up' },
      { label: 'Red Sea Attacks', value: '100+ ships targeted', trend: 'up' },
      { label: 'Child Malnutrition', value: '2.2M children', trend: 'up' },
      { label: 'Healthcare', value: '50% facilities closed', trend: 'down' },
    ]
  },
  {
    id: 'myanmar-civil-war',
    name: 'Myanmar Civil War',
    label: 'MYANMAR CONFLICT',
    coordinates: [96.2, 21.9],
    tier: 'HIGH',
    type: 'conflict',
    description: 'Post-coup civil war. Military junta vs resistance forces and ethnic armed organizations. Resistance gaining ground in multiple regions.',
    countries: ['MMR'],
    active: true,
    keywords: ['myanmar', 'burma', 'junta', 'military coup', 'rohingya', 'resistance', 'pdf', 'nug', 'ethnic armed'],
    startDate: '2021-02-01',
    parties: ['Military Junta (Tatmadaw)', 'National Unity Government', 'Ethnic Armed Orgs'],
    status: 'Junta losing territory - Resistance advancing',
    stats: {
      casualties: '50,000+ deaths (est.)',
      displaced: '2.6M+ internally displaced',
      duration: '3+ years since coup',
      territory: 'Junta controls ~40% territory',
    },
    keyFacts: [
      { label: 'Junta Control', value: '~40% territory', trend: 'down' },
      { label: 'Airstrikes', value: '1,500+ on civilians', trend: 'up' },
      { label: 'Political Prisoners', value: '20,000+', trend: 'up' },
      { label: 'Economy', value: 'Collapsed', trend: 'down' },
    ]
  },
  {
    id: 'syria-conflict',
    name: 'Syria Situation',
    label: 'SYRIA',
    coordinates: [36.3, 33.5],
    tier: 'HIGH',
    type: 'conflict',
    description: 'Post-civil war fragmentation. Assad regime fell in late 2024. Multiple armed groups control different regions. Uncertain transition period.',
    countries: ['SYR'],
    active: true,
    keywords: ['syria', 'damascus', 'assad', 'syrian', 'hts', 'idlib', 'kurdish', 'sdf'],
    startDate: '2011-03-15',
    parties: ['HTS-led Government', 'Kurdish SDF', 'Various Militias'],
    status: 'Post-Assad transition - Fragmented control',
    stats: {
      casualties: '500,000+ total deaths',
      displaced: '6.8M refugees abroad',
      duration: '13+ years of conflict',
      territory: 'Fragmented control',
    },
    keyFacts: [
      { label: 'Refugees', value: '6.8M abroad', trend: 'stable' },
      { label: 'Internal IDPs', value: '6.9M', trend: 'stable' },
      { label: 'Infrastructure', value: '40% destroyed', trend: 'stable' },
      { label: 'Transition', value: 'Ongoing', trend: 'stable' },
    ]
  },

  // Tensions / Strategic Flashpoints
  {
    id: 'taiwan-strait',
    name: 'Taiwan Strait',
    label: 'TAIWAN STRAIT',
    coordinates: [121.5, 25.0],
    tier: 'HIGH',
    type: 'tension',
    description: 'Escalating cross-strait tensions. China increasing military pressure with frequent incursions. US commitment to Taiwan defense.',
    countries: ['TWN', 'CHN'],
    active: true,
    keywords: ['taiwan', 'taipei', 'china', 'pla', 'strait', 'tsai', 'chinese military', 'incursion', 'lai', 'median line'],
    parties: ['Taiwan (ROC)', 'China (PRC)', 'United States'],
    status: 'Elevated tensions - No active conflict',
    stats: {
      territory: 'Taiwan Strait (180 km wide)',
      economic: 'Global chip supply at risk',
    },
    keyFacts: [
      { label: 'PLA Incursions', value: 'Daily', trend: 'up' },
      { label: 'US Arms Sales', value: '$20B+ backlog', trend: 'up' },
      { label: 'Chip Production', value: '90% advanced chips', trend: 'stable' },
      { label: 'Invasion Risk', value: 'Medium-term', trend: 'up' },
    ]
  },
  {
    id: 'korea-dmz',
    name: 'Korean Peninsula',
    label: 'KOREAN DMZ',
    coordinates: [127.0, 38.0],
    tier: 'MEDIUM',
    type: 'tension',
    description: 'Ongoing tensions between North and South Korea. DPRK nuclear weapons program and missile tests. Diplomatic channels largely frozen.',
    countries: ['PRK', 'KOR'],
    active: true,
    keywords: ['north korea', 'pyongyang', 'kim jong', 'korean peninsula', 'dmz', 'icbm', 'nuclear test', 'south korea', 'dprk'],
    parties: ['North Korea (DPRK)', 'South Korea (ROK)', 'United States'],
    status: 'Frozen conflict - Nuclear standoff',
    stats: {
      duration: '70+ years since armistice',
      territory: 'DMZ: 250 km long, 4 km wide',
    },
    keyFacts: [
      { label: 'DPRK Nukes', value: '50+ warheads (est.)', trend: 'up' },
      { label: 'Missile Tests', value: '100+ since 2022', trend: 'up' },
      { label: 'Troops at DMZ', value: '1M+ combined', trend: 'stable' },
      { label: 'Diplomacy', value: 'Stalled', trend: 'stable' },
    ]
  },
  {
    id: 'iran-tensions',
    name: 'Iran Tensions',
    label: 'IRAN',
    coordinates: [51.4, 35.7],
    tier: 'HIGH',
    type: 'tension',
    description: 'Nuclear program tensions. Regional proxy conflicts via Hezbollah, Houthis, Iraqi militias. Domestic protests and regime instability.',
    countries: ['IRN'],
    active: true,
    keywords: ['iran', 'tehran', 'irgc', 'nuclear', 'khamenei', 'sanctions', 'hezbollah', 'proxy', 'enrichment', 'protest'],
    parties: ['Islamic Republic of Iran', 'United States', 'Israel', 'IAEA'],
    status: 'Nuclear threshold state - Regional proxy wars active',
    stats: {
      economic: '$150B+ in sanctions impact',
    },
    keyFacts: [
      { label: 'Enrichment', value: '60%+ purity', trend: 'up' },
      { label: 'Breakout Time', value: 'Weeks (est.)', trend: 'down' },
      { label: 'Proxy Forces', value: '200,000+ fighters', trend: 'stable' },
      { label: 'Regime Stability', value: 'Under pressure', trend: 'down' },
    ]
  },
  {
    id: 'strait-of-hormuz',
    name: 'Strait of Hormuz',
    label: 'STRAIT OF HORMUZ',
    coordinates: [56.5, 26.5],
    tier: 'MEDIUM',
    type: 'strategic',
    description: 'Critical oil chokepoint. 20% of global oil passes through. Periodic Iranian threats and tanker seizures.',
    countries: ['IRN', 'OMN', 'ARE'],
    active: true,
    keywords: ['hormuz', 'strait', 'oil tanker', 'persian gulf', 'tanker seizure', 'oil shipping'],
    status: 'Tense but open - Periodic incidents',
    stats: {
      territory: '33 km wide at narrowest',
      economic: '20% of global oil transit',
    },
    keyFacts: [
      { label: 'Oil Transit', value: '20M barrels/day', trend: 'stable' },
      { label: 'Tanker Seizures', value: 'Periodic', trend: 'stable' },
      { label: 'US Naval Presence', value: '5th Fleet', trend: 'stable' },
      { label: 'Closure Impact', value: '$100+ oil/barrel', trend: 'stable' },
    ]
  },
  {
    id: 'south-china-sea',
    name: 'South China Sea',
    label: 'SOUTH CHINA SEA',
    coordinates: [114.0, 12.0],
    tier: 'MEDIUM',
    type: 'tension',
    description: 'Territorial disputes over islands and reefs. Chinese militarization and aggressive coast guard actions. Philippine tensions escalating.',
    countries: ['CHN', 'PHL', 'VNM', 'MYS'],
    active: true,
    keywords: ['south china sea', 'spratly', 'paracel', 'philippines', 'nine-dash', 'scarborough', 'second thomas shoal'],
    parties: ['China', 'Philippines', 'Vietnam', 'Malaysia', 'United States'],
    status: 'Escalating incidents - No armed conflict',
    stats: {
      territory: '3.5M km² disputed area',
      economic: '$5T+ annual trade passes through',
    },
    keyFacts: [
      { label: 'Trade Route', value: '$5T+/year', trend: 'stable' },
      { label: 'China Bases', value: '7 artificial islands', trend: 'up' },
      { label: 'Incidents', value: 'Weekly', trend: 'up' },
      { label: 'US FONOPs', value: 'Monthly', trend: 'stable' },
    ]
  },
  {
    id: 'venezuela-crisis',
    name: 'Venezuela Crisis',
    label: 'VENEZUELA',
    coordinates: [-66.9, 10.5],
    tier: 'HIGH',
    type: 'tension',
    description: 'Political crisis and disputed election. Economic collapse driving mass migration. US intervention discussions ongoing.',
    countries: ['VEN'],
    active: true,
    keywords: ['venezuela', 'maduro', 'caracas', 'guaido', 'bolivar', 'opposition', 'migration', 'oil'],
    startDate: '2019-01-23',
    parties: ['Maduro Government', 'Opposition', 'United States'],
    status: 'Political standoff - Humanitarian emergency',
    stats: {
      displaced: '7.7M+ refugees/migrants',
      economic: '80% GDP collapse since 2013',
    },
    keyFacts: [
      { label: 'Migration', value: '7.7M+ fled', trend: 'up' },
      { label: 'Inflation', value: '400%+ annual', trend: 'up' },
      { label: 'Oil Production', value: '90% decline', trend: 'down' },
      { label: 'Poverty Rate', value: '94%+', trend: 'up' },
    ]
  },
  {
    id: 'haiti-crisis',
    name: 'Haiti Crisis',
    label: 'HAITI',
    coordinates: [-72.3, 18.5],
    tier: 'HIGH',
    type: 'conflict',
    description: 'Gang control of Port-au-Prince. State collapse with no functioning government. Kenyan-led multinational force deployed.',
    countries: ['HTI'],
    active: true,
    keywords: ['haiti', 'port-au-prince', 'gang', 'haitian', 'barbecue', 'msss', 'kenya force'],
    parties: ['Armed Gangs', 'Transitional Government', 'Kenya-led MSS Force'],
    status: 'State collapse - Gangs control 80% of capital',
    stats: {
      displaced: '700,000+ internally displaced',
      territory: 'Gangs control 80% of Port-au-Prince',
    },
    keyFacts: [
      { label: 'Gang Control', value: '80% of capital', trend: 'up' },
      { label: 'Kidnappings', value: '4,000+/year', trend: 'up' },
      { label: 'Food Insecurity', value: '5M+ people', trend: 'up' },
      { label: 'MSS Force', value: '2,500+ deployed', trend: 'up' },
    ]
  },
  {
    id: 'drc-conflict',
    name: 'DRC Eastern Conflict',
    label: 'EASTERN DRC',
    coordinates: [29.0, -1.5],
    tier: 'HIGH',
    type: 'conflict',
    description: 'M23 rebel advance with alleged Rwandan support. Multiple armed groups active. Rich mineral resources fueling conflict.',
    countries: ['COD', 'RWA'],
    active: true,
    keywords: ['congo', 'drc', 'm23', 'goma', 'kivu', 'rwanda', 'rebel', 'monusco', 'cobalt'],
    parties: ['DRC Armed Forces (FARDC)', 'M23 Rebels', 'Rwanda (alleged support)'],
    status: 'Active combat - M23 advancing',
    stats: {
      casualties: '6M+ deaths since 1996',
      displaced: '7M+ internally displaced',
      territory: 'North/South Kivu provinces',
    },
    keyFacts: [
      { label: 'Displaced', value: '7M+ people', trend: 'up' },
      { label: 'Armed Groups', value: '100+ active', trend: 'stable' },
      { label: 'Minerals', value: '70% global cobalt', trend: 'stable' },
      { label: 'UN Mission', value: 'MONUSCO withdrawing', trend: 'down' },
    ]
  },

  // Strategic/Nuclear
  {
    id: 'russia-nato',
    name: 'NATO-Russia Border',
    label: 'NATO EASTERN FLANK',
    coordinates: [24.0, 55.0],
    tier: 'MEDIUM',
    type: 'tension',
    description: 'NATO reinforcement of eastern flank. Russian posturing and hybrid threats. Finland and Sweden joined NATO.',
    countries: ['RUS', 'POL', 'LTU', 'LVA', 'EST'],
    active: true,
    keywords: ['nato', 'baltic', 'poland', 'kaliningrad', 'suwalki gap', 'finland', 'sweden', 'article 5'],
    parties: ['NATO Alliance', 'Russian Federation'],
    status: 'Heightened readiness - No direct conflict',
    stats: {
      territory: 'Suwalki Gap: 65 km corridor',
    },
    keyFacts: [
      { label: 'NATO Troops', value: '300,000+ ready', trend: 'up' },
      { label: 'New Members', value: 'Finland, Sweden', trend: 'up' },
      { label: 'Russian Threats', value: 'Regular', trend: 'stable' },
      { label: 'Nuclear Risk', value: 'Elevated', trend: 'up' },
    ]
  },
  {
    id: 'greenland-tensions',
    name: 'Greenland Crisis',
    label: 'GREENLAND',
    coordinates: [-42.0, 72.0],
    tier: 'CRITICAL',
    type: 'tension',
    description: 'US interest in acquiring Greenland creating major diplomatic crisis with Denmark. Strategic importance for Arctic control, rare earth minerals, military positioning, and NATO northern flank. Trump administration pushing for territorial acquisition.',
    countries: ['GRL', 'DNK', 'USA'],
    active: true,
    keywords: ['greenland', 'denmark', 'trump', 'arctic', 'nuuk', 'rare earth', 'thule', 'pituffik', 'greenlandic', 'danish', 'acquisition', 'purchase', 'mute egede'],
    parties: ['United States', 'Denmark', 'Greenland Government'],
    status: 'Diplomatic crisis - US pushing for acquisition',
    stats: {
      territory: '2.166M km² (world\'s largest island)',
      economic: '$13B+ rare earth deposits',
    },
    keyFacts: [
      { label: 'US Interest', value: 'Acquisition push', trend: 'up' },
      { label: 'Rare Earths', value: 'Critical reserves', trend: 'up' },
      { label: 'NATO Base', value: 'Pituffik Space Base', trend: 'stable' },
      { label: 'Danish Response', value: 'Strong opposition', trend: 'stable' },
    ]
  },
  {
    id: 'arctic-dispute',
    name: 'Arctic Claims',
    label: 'ARCTIC',
    coordinates: [-10.0, 85.0],
    tier: 'MEDIUM',
    type: 'strategic',
    description: 'Competing territorial claims as ice melts. Resource competition and new shipping routes. Russia increasing military presence.',
    countries: ['RUS', 'USA', 'CAN', 'NOR'],
    active: true,
    keywords: ['arctic', 'northern sea route', 'polar', 'ice melt', 'arctic council'],
    parties: ['Russia', 'United States', 'Canada', 'Norway'],
    status: 'Strategic competition - No active conflict',
    keyFacts: [
      { label: 'Ice Loss', value: '13%/decade', trend: 'up' },
      { label: 'Resources', value: '22% undiscovered oil', trend: 'stable' },
      { label: 'Shipping Routes', value: 'Opening', trend: 'up' },
      { label: 'Military Buildup', value: 'All parties', trend: 'up' },
    ]
  },
  {
    id: 'red-sea-shipping',
    name: 'Red Sea Shipping',
    label: 'RED SEA',
    coordinates: [42.0, 15.0],
    tier: 'HIGH',
    type: 'strategic',
    description: 'Houthi attacks on commercial shipping. Major trade disruption forcing route changes around Africa. US/UK strikes on Yemen.',
    countries: ['YEM', 'SAU', 'ERI'],
    active: true,
    keywords: ['red sea', 'houthi', 'shipping', 'suez', 'bab el-mandeb', 'container ship', 'maritime attack'],
    startDate: '2023-11-19',
    parties: ['Houthis', 'US/UK Coalition', 'Commercial Shipping'],
    status: 'Active attacks - Global trade disrupted',
    stats: {
      economic: '90% drop in Suez traffic',
      territory: 'Bab el-Mandeb Strait: 26 km wide',
    },
    keyFacts: [
      { label: 'Ships Attacked', value: '100+', trend: 'up' },
      { label: 'Suez Traffic', value: '90% drop', trend: 'down' },
      { label: 'Shipping Costs', value: '300%+ increase', trend: 'up' },
      { label: 'Route Change', value: 'Africa detour +10 days', trend: 'stable' },
    ]
  },
];

// Get hotspots by type
export function getHotspotsByType(type: Hotspot['type']): Hotspot[] {
  return HOTSPOTS.filter(h => h.type === type && h.active);
}

// Get hotspots by tier
export function getHotspotsByTier(tier: RiskTier): Hotspot[] {
  return HOTSPOTS.filter(h => h.tier === tier && h.active);
}

// Find hotspots matching article keywords
export function findMatchingHotspots(title: string, description: string | null): Hotspot[] {
  const text = `${title} ${description || ''}`.toLowerCase();
  return HOTSPOTS.filter(hotspot =>
    hotspot.keywords.some(keyword => text.includes(keyword.toLowerCase()))
  );
}

// Get all active hotspots
export function getActiveHotspots(): Hotspot[] {
  return HOTSPOTS.filter(h => h.active);
}

// Get hotspot by ID
export function getHotspotById(id: string): Hotspot | undefined {
  return HOTSPOTS.find(h => h.id === id);
}
