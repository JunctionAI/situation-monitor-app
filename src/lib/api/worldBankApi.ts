// World Bank API client for economic indicators

interface WorldBankIndicator {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

interface WorldBankResponse {
  page: number;
  pages: number;
  per_page: number;
  total: number;
  sourceid: string;
  lastupdated: string;
}

export interface EconomicIndicators {
  gdpNominal?: number;
  gdpPerCapita?: number;
  gdpGrowth?: number;
  inflation?: number;
  unemployment?: number;
  population?: number;
  year?: string;
}

// Indicator codes
const INDICATORS = {
  GDP_NOMINAL: 'NY.GDP.MKTP.CD',        // GDP (current US$)
  GDP_PER_CAPITA: 'NY.GDP.PCAP.CD',     // GDP per capita (current US$)
  GDP_GROWTH: 'NY.GDP.MKTP.KD.ZG',      // GDP growth (annual %)
  INFLATION: 'FP.CPI.TOTL.ZG',          // Inflation, consumer prices (annual %)
  UNEMPLOYMENT: 'SL.UEM.TOTL.ZS',       // Unemployment, total (% of total labor force)
  POPULATION: 'SP.POP.TOTL',            // Population, total
};

// ISO2 to ISO3 mapping for common countries (World Bank uses ISO2)
const ISO3_TO_ISO2: Record<string, string> = {
  USA: 'US', GBR: 'GB', DEU: 'DE', FRA: 'FR', JPN: 'JP', CHN: 'CN',
  IND: 'IN', BRA: 'BR', CAN: 'CA', AUS: 'AU', RUS: 'RU', KOR: 'KR',
  MEX: 'MX', ESP: 'ES', ITA: 'IT', NLD: 'NL', SAU: 'SA', TUR: 'TR',
  CHE: 'CH', POL: 'PL', SWE: 'SE', BEL: 'BE', ARG: 'AR', NOR: 'NO',
  AUT: 'AT', IRN: 'IR', ARE: 'AE', NGA: 'NG', ISR: 'IL', ZAF: 'ZA',
  IRL: 'IE', DNK: 'DK', SGP: 'SG', MYS: 'MY', PHL: 'PH', COL: 'CO',
  PAK: 'PK', CHL: 'CL', FIN: 'FI', EGY: 'EG', PRT: 'PT', CZE: 'CZ',
  VNM: 'VN', ROU: 'RO', NZL: 'NZ', PER: 'PE', IRQ: 'IQ', GRC: 'GR',
  QAT: 'QA', DZA: 'DZ', KAZ: 'KZ', HUN: 'HU', KWT: 'KW', MAR: 'MA',
  UKR: 'UA', ETH: 'ET', ECU: 'EC', PRI: 'PR', CUB: 'CU', DOM: 'DO',
  GTM: 'GT', OMN: 'OM', LKA: 'LK', KEN: 'KE', MMR: 'MM', LUX: 'LU',
  BGR: 'BG', AGO: 'AO', HRV: 'HR', TUN: 'TN', UZB: 'UZ', SVK: 'SK',
  GHA: 'GH', LBY: 'LY', SRB: 'RS', AZE: 'AZ', JOR: 'JO', TZA: 'TZ',
  SDN: 'SD', LBN: 'LB', THA: 'TH', IDN: 'ID', VEN: 'VE', AFG: 'AF',
  PRK: 'KP', YEM: 'YE', SYR: 'SY', SOM: 'SO', HTI: 'HT', COD: 'CD',
};

async function fetchIndicator(
  countryCode: string,
  indicator: string
): Promise<number | null> {
  try {
    // Convert ISO3 to ISO2 if needed
    const iso2 = ISO3_TO_ISO2[countryCode] || countryCode.substring(0, 2);

    // Fetch last 5 years to find most recent data
    const url = `https://api.worldbank.org/v2/country/${iso2}/indicator/${indicator}?format=json&per_page=5&mrv=1`;

    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) return null;

    const data = await response.json();

    // World Bank API returns [metadata, data[]]
    if (!Array.isArray(data) || data.length < 2 || !Array.isArray(data[1])) {
      return null;
    }

    // Find most recent non-null value
    const values = data[1] as WorldBankIndicator[];
    for (const item of values) {
      if (item.value !== null) {
        return item.value;
      }
    }

    return null;
  } catch (error) {
    console.error(`World Bank API error for ${countryCode}/${indicator}:`, error);
    return null;
  }
}

export async function fetchEconomicIndicators(
  countryCode: string
): Promise<EconomicIndicators> {
  // Fetch key indicators in parallel
  const [gdpNominal, gdpPerCapita, gdpGrowth, inflation, unemployment] =
    await Promise.all([
      fetchIndicator(countryCode, INDICATORS.GDP_NOMINAL),
      fetchIndicator(countryCode, INDICATORS.GDP_PER_CAPITA),
      fetchIndicator(countryCode, INDICATORS.GDP_GROWTH),
      fetchIndicator(countryCode, INDICATORS.INFLATION),
      fetchIndicator(countryCode, INDICATORS.UNEMPLOYMENT),
    ]);

  return {
    gdpNominal: gdpNominal ?? undefined,
    gdpPerCapita: gdpPerCapita ?? undefined,
    gdpGrowth: gdpGrowth ?? undefined,
    inflation: inflation ?? undefined,
    unemployment: unemployment ?? undefined,
  };
}

// Country-specific curated political and economic data
// This covers countries NOT in the main STRATEGIC_DATA
export const EXTENDED_COUNTRY_DATA: Record<string, {
  government?: string;
  headOfState?: { title: string; name: string };
  headOfGovernment?: { title: string; name: string };
  internationalOrgs?: string[];
  alliances?: string[];
  economicBlocs?: string[];
  majorExports?: string[];
}> = {
  // Europe
  ITA: {
    government: 'Unitary Parliamentary Republic',
    headOfState: { title: 'President', name: 'Sergio Mattarella' },
    headOfGovernment: { title: 'Prime Minister', name: 'Giorgia Meloni' },
    internationalOrgs: ['UN', 'NATO', 'EU', 'G7', 'G20', 'OECD'],
    alliances: ['NATO', 'EU'],
    economicBlocs: ['EU', 'Eurozone'],
    majorExports: ['Machinery', 'Vehicles', 'Pharmaceuticals', 'Fashion'],
  },
  ESP: {
    government: 'Unitary Parliamentary Constitutional Monarchy',
    headOfState: { title: 'King', name: 'Felipe VI' },
    headOfGovernment: { title: 'Prime Minister', name: 'Pedro Sánchez' },
    internationalOrgs: ['UN', 'NATO', 'EU', 'G20', 'OECD'],
    alliances: ['NATO', 'EU'],
    economicBlocs: ['EU', 'Eurozone'],
    majorExports: ['Vehicles', 'Machinery', 'Food products', 'Pharmaceuticals'],
  },
  POL: {
    government: 'Unitary Semi-Presidential Republic',
    headOfState: { title: 'President', name: 'Andrzej Duda' },
    headOfGovernment: { title: 'Prime Minister', name: 'Donald Tusk' },
    internationalOrgs: ['UN', 'NATO', 'EU', 'OECD'],
    alliances: ['NATO', 'EU'],
    economicBlocs: ['EU'],
    majorExports: ['Machinery', 'Vehicles', 'Furniture', 'Electronics'],
  },
  NLD: {
    government: 'Unitary Parliamentary Constitutional Monarchy',
    headOfState: { title: 'King', name: 'Willem-Alexander' },
    headOfGovernment: { title: 'Prime Minister', name: 'Dick Schoof' },
    internationalOrgs: ['UN', 'NATO', 'EU', 'OECD', 'Benelux'],
    alliances: ['NATO', 'EU'],
    economicBlocs: ['EU', 'Eurozone'],
    majorExports: ['Machinery', 'Chemicals', 'Mineral fuels', 'Food'],
  },
  SWE: {
    government: 'Unitary Parliamentary Constitutional Monarchy',
    headOfState: { title: 'King', name: 'Carl XVI Gustaf' },
    headOfGovernment: { title: 'Prime Minister', name: 'Ulf Kristersson' },
    internationalOrgs: ['UN', 'NATO', 'EU', 'OECD'],
    alliances: ['NATO', 'EU'],
    economicBlocs: ['EU'],
    majorExports: ['Machinery', 'Vehicles', 'Pharmaceuticals', 'Iron ore'],
  },
  NOR: {
    government: 'Unitary Parliamentary Constitutional Monarchy',
    headOfState: { title: 'King', name: 'Harald V' },
    headOfGovernment: { title: 'Prime Minister', name: 'Jonas Gahr Støre' },
    internationalOrgs: ['UN', 'NATO', 'EFTA', 'OECD'],
    alliances: ['NATO'],
    economicBlocs: ['EEA', 'EFTA'],
    majorExports: ['Petroleum', 'Natural gas', 'Fish', 'Machinery'],
  },
  FIN: {
    government: 'Unitary Parliamentary Republic',
    headOfState: { title: 'President', name: 'Alexander Stubb' },
    headOfGovernment: { title: 'Prime Minister', name: 'Petteri Orpo' },
    internationalOrgs: ['UN', 'NATO', 'EU', 'OECD'],
    alliances: ['NATO', 'EU'],
    economicBlocs: ['EU', 'Eurozone'],
    majorExports: ['Machinery', 'Paper', 'Chemicals', 'Electronics'],
  },
  GRC: {
    government: 'Unitary Parliamentary Republic',
    headOfState: { title: 'President', name: 'Katerina Sakellaropoulou' },
    headOfGovernment: { title: 'Prime Minister', name: 'Kyriakos Mitsotakis' },
    internationalOrgs: ['UN', 'NATO', 'EU', 'OECD'],
    alliances: ['NATO', 'EU'],
    economicBlocs: ['EU', 'Eurozone'],
    majorExports: ['Petroleum', 'Pharmaceuticals', 'Aluminum', 'Food'],
  },
  TUR: {
    government: 'Unitary Presidential Republic',
    headOfState: { title: 'President', name: 'Recep Tayyip Erdoğan' },
    internationalOrgs: ['UN', 'NATO', 'G20', 'OECD', 'OIC'],
    alliances: ['NATO'],
    economicBlocs: ['Turkey-EU Customs Union'],
    majorExports: ['Vehicles', 'Machinery', 'Steel', 'Textiles'],
  },
  // Middle East
  EGY: {
    government: 'Unitary Semi-Presidential Republic',
    headOfState: { title: 'President', name: 'Abdel Fattah el-Sisi' },
    headOfGovernment: { title: 'Prime Minister', name: 'Mostafa Madbouly' },
    internationalOrgs: ['UN', 'Arab League', 'African Union', 'OIC'],
    alliances: ['US ally'],
    majorExports: ['Petroleum', 'Natural gas', 'Cotton', 'Textiles'],
  },
  IRQ: {
    government: 'Federal Parliamentary Republic',
    headOfState: { title: 'President', name: 'Abdul Latif Rashid' },
    headOfGovernment: { title: 'Prime Minister', name: 'Mohammed Shia al-Sudani' },
    internationalOrgs: ['UN', 'Arab League', 'OPEC', 'OIC'],
    majorExports: ['Crude petroleum'],
  },
  SYR: {
    government: 'Transitional Government',
    headOfState: { title: 'Interim President', name: 'Ahmad al-Sharaa' },
    internationalOrgs: ['UN', 'Arab League (suspended)'],
    majorExports: ['Petroleum', 'Cotton', 'Phosphates'],
  },
  LBN: {
    government: 'Unitary Parliamentary Confessionalist Republic',
    headOfState: { title: 'President', name: 'Joseph Aoun' },
    headOfGovernment: { title: 'Prime Minister', name: 'Nawaf Salam' },
    internationalOrgs: ['UN', 'Arab League', 'OIF'],
    majorExports: ['Jewelry', 'Chemicals', 'Food products'],
  },
  JOR: {
    government: 'Unitary Parliamentary Constitutional Monarchy',
    headOfState: { title: 'King', name: 'Abdullah II' },
    headOfGovernment: { title: 'Prime Minister', name: 'Jafar Hassan' },
    internationalOrgs: ['UN', 'Arab League', 'OIC'],
    alliances: ['US ally'],
    majorExports: ['Pharmaceuticals', 'Potash', 'Fertilizers', 'Textiles'],
  },
  ARE: {
    government: 'Federal Elective Constitutional Monarchy',
    headOfState: { title: 'President', name: 'Mohamed bin Zayed Al Nahyan' },
    headOfGovernment: { title: 'Prime Minister', name: 'Mohammed bin Rashid Al Maktoum' },
    internationalOrgs: ['UN', 'GCC', 'Arab League', 'OPEC', 'OIC'],
    alliances: ['Abraham Accords', 'GCC', 'US ally'],
    majorExports: ['Crude petroleum', 'Natural gas', 'Refined petroleum', 'Gold'],
  },
  QAT: {
    government: 'Unitary Semi-Constitutional Monarchy',
    headOfState: { title: 'Emir', name: 'Tamim bin Hamad Al Thani' },
    headOfGovernment: { title: 'Prime Minister', name: 'Mohammed bin Abdulrahman Al Thani' },
    internationalOrgs: ['UN', 'GCC', 'Arab League', 'OPEC', 'OIC'],
    alliances: ['GCC', 'US ally'],
    majorExports: ['Natural gas (LNG)', 'Crude petroleum', 'Petrochemicals'],
  },
  YEM: {
    government: 'Transitional Government / Civil War',
    internationalOrgs: ['UN', 'Arab League', 'OIC'],
    majorExports: ['Crude petroleum', 'Coffee', 'Fish'],
  },
  // Asia Pacific
  KOR: {
    government: 'Unitary Presidential Republic',
    headOfState: { title: 'Acting President', name: 'Choi Sang-mok' },
    internationalOrgs: ['UN', 'G20', 'OECD', 'APEC'],
    alliances: ['US-ROK Alliance'],
    economicBlocs: ['RCEP'],
    majorExports: ['Semiconductors', 'Vehicles', 'Ships', 'Electronics'],
  },
  PRK: {
    government: 'Unitary One-Party Juche Republic',
    headOfState: { title: 'Supreme Leader', name: 'Kim Jong Un' },
    internationalOrgs: ['UN'],
    alliances: ['China ally', 'Russia ally'],
    majorExports: ['Coal', 'Textiles', 'Minerals'],
  },
  TWN: {
    government: 'Unitary Semi-Presidential Republic',
    headOfState: { title: 'President', name: 'Lai Ching-te' },
    headOfGovernment: { title: 'Premier', name: 'Cho Jung-tai' },
    internationalOrgs: ['WTO', 'APEC'],
    alliances: ['US partner (Taiwan Relations Act)'],
    majorExports: ['Semiconductors', 'Electronics', 'Machinery', 'Plastics'],
  },
  VNM: {
    government: 'Unitary One-Party Socialist Republic',
    headOfState: { title: 'President', name: 'Lương Cường' },
    headOfGovernment: { title: 'Prime Minister', name: 'Phạm Minh Chính' },
    internationalOrgs: ['UN', 'ASEAN', 'WTO', 'APEC'],
    economicBlocs: ['ASEAN', 'RCEP', 'CPTPP'],
    majorExports: ['Electronics', 'Textiles', 'Footwear', 'Seafood'],
  },
  THA: {
    government: 'Unitary Parliamentary Constitutional Monarchy',
    headOfState: { title: 'King', name: 'Vajiralongkorn' },
    headOfGovernment: { title: 'Prime Minister', name: 'Paetongtarn Shinawatra' },
    internationalOrgs: ['UN', 'ASEAN', 'WTO', 'APEC'],
    alliances: ['US ally'],
    economicBlocs: ['ASEAN', 'RCEP'],
    majorExports: ['Electronics', 'Vehicles', 'Machinery', 'Rubber'],
  },
  IDN: {
    government: 'Unitary Presidential Republic',
    headOfState: { title: 'President', name: 'Prabowo Subianto' },
    internationalOrgs: ['UN', 'G20', 'ASEAN', 'WTO', 'OPEC', 'OIC'],
    economicBlocs: ['ASEAN', 'RCEP'],
    majorExports: ['Palm oil', 'Coal', 'Petroleum gas', 'Rubber'],
  },
  PHL: {
    government: 'Unitary Presidential Republic',
    headOfState: { title: 'President', name: 'Bongbong Marcos' },
    internationalOrgs: ['UN', 'ASEAN', 'WTO', 'APEC'],
    alliances: ['US-Philippines Alliance'],
    economicBlocs: ['ASEAN', 'RCEP'],
    majorExports: ['Semiconductors', 'Electronics', 'Copper', 'Coconut oil'],
  },
  MYS: {
    government: 'Federal Parliamentary Constitutional Elective Monarchy',
    headOfState: { title: 'King', name: 'Ibrahim Iskandar' },
    headOfGovernment: { title: 'Prime Minister', name: 'Anwar Ibrahim' },
    internationalOrgs: ['UN', 'ASEAN', 'WTO', 'OIC', 'Commonwealth'],
    economicBlocs: ['ASEAN', 'RCEP', 'CPTPP'],
    majorExports: ['Electronics', 'Petroleum', 'Palm oil', 'LNG'],
  },
  SGP: {
    government: 'Unitary Parliamentary Republic',
    headOfState: { title: 'President', name: 'Tharman Shanmugaratnam' },
    headOfGovernment: { title: 'Prime Minister', name: 'Lawrence Wong' },
    internationalOrgs: ['UN', 'ASEAN', 'WTO', 'APEC', 'Commonwealth'],
    economicBlocs: ['ASEAN', 'RCEP', 'CPTPP'],
    majorExports: ['Refined petroleum', 'Electronics', 'Machinery', 'Pharmaceuticals'],
  },
  PAK: {
    government: 'Federal Parliamentary Republic',
    headOfState: { title: 'President', name: 'Asif Ali Zardari' },
    headOfGovernment: { title: 'Prime Minister', name: 'Shehbaz Sharif' },
    internationalOrgs: ['UN', 'SCO', 'OIC', 'Commonwealth'],
    alliances: ['China ally'],
    majorExports: ['Textiles', 'Rice', 'Leather', 'Sports goods'],
  },
  BGD: {
    government: 'Interim Government',
    headOfGovernment: { title: 'Chief Adviser', name: 'Muhammad Yunus' },
    internationalOrgs: ['UN', 'Commonwealth', 'OIC'],
    majorExports: ['Textiles', 'Garments', 'Leather', 'Jute'],
  },
  AFG: {
    government: 'Unitary Theocratic Islamic Emirate',
    headOfState: { title: 'Supreme Leader', name: 'Hibatullah Akhundzada' },
    headOfGovernment: { title: 'Prime Minister', name: 'Hasan Akhund' },
    internationalOrgs: ['UN (limited)', 'OIC'],
    majorExports: ['Dried fruits', 'Carpets', 'Coal'],
  },
  MMR: {
    government: 'Military Junta / Civil War',
    headOfState: { title: 'SAC Chairman', name: 'Min Aung Hlaing' },
    internationalOrgs: ['UN', 'ASEAN'],
    majorExports: ['Natural gas', 'Garments', 'Jade', 'Rice'],
  },
  // Americas
  CAN: {
    government: 'Federal Parliamentary Constitutional Monarchy',
    headOfState: { title: 'King', name: 'Charles III' },
    headOfGovernment: { title: 'Prime Minister', name: 'Mark Carney' },
    internationalOrgs: ['UN', 'NATO', 'G7', 'G20', 'OECD', 'Commonwealth'],
    alliances: ['NATO', 'Five Eyes', 'NORAD'],
    economicBlocs: ['USMCA'],
    majorExports: ['Crude petroleum', 'Vehicles', 'Machinery', 'Gold'],
  },
  MEX: {
    government: 'Federal Presidential Republic',
    headOfState: { title: 'President', name: 'Claudia Sheinbaum' },
    internationalOrgs: ['UN', 'G20', 'OECD', 'WTO'],
    economicBlocs: ['USMCA'],
    majorExports: ['Vehicles', 'Electronics', 'Machinery', 'Petroleum'],
  },
  BRA: {
    government: 'Federal Presidential Republic',
    headOfState: { title: 'President', name: 'Luiz Inácio Lula da Silva' },
    internationalOrgs: ['UN', 'G20', 'BRICS', 'Mercosur', 'WTO'],
    economicBlocs: ['Mercosur'],
    majorExports: ['Soybeans', 'Iron ore', 'Crude petroleum', 'Sugar'],
  },
  ARG: {
    government: 'Federal Presidential Republic',
    headOfState: { title: 'President', name: 'Javier Milei' },
    internationalOrgs: ['UN', 'G20', 'Mercosur', 'WTO'],
    economicBlocs: ['Mercosur'],
    majorExports: ['Soybeans', 'Corn', 'Wheat', 'Beef'],
  },
  COL: {
    government: 'Unitary Presidential Republic',
    headOfState: { title: 'President', name: 'Gustavo Petro' },
    internationalOrgs: ['UN', 'OAS', 'WTO', 'Pacific Alliance'],
    economicBlocs: ['Pacific Alliance', 'Andean Community'],
    majorExports: ['Crude petroleum', 'Coal', 'Coffee', 'Cut flowers'],
  },
  VEN: {
    government: 'Federal Presidential Republic (disputed)',
    headOfState: { title: 'President', name: 'Nicolás Maduro (disputed)' },
    internationalOrgs: ['UN', 'OPEC', 'Mercosur (suspended)'],
    majorExports: ['Crude petroleum'],
  },
  CHL: {
    government: 'Unitary Presidential Republic',
    headOfState: { title: 'President', name: 'Gabriel Boric' },
    internationalOrgs: ['UN', 'OECD', 'WTO', 'APEC', 'Pacific Alliance'],
    economicBlocs: ['Pacific Alliance', 'CPTPP'],
    majorExports: ['Copper', 'Lithium', 'Fruits', 'Fish'],
  },
  PER: {
    government: 'Unitary Presidential Republic',
    headOfState: { title: 'President', name: 'Dina Boluarte' },
    internationalOrgs: ['UN', 'WTO', 'APEC', 'Pacific Alliance'],
    economicBlocs: ['Pacific Alliance', 'Andean Community'],
    majorExports: ['Copper', 'Gold', 'Zinc', 'Fish meal'],
  },
  CUB: {
    government: 'Unitary One-Party Socialist Republic',
    headOfState: { title: 'President', name: 'Miguel Díaz-Canel' },
    internationalOrgs: ['UN'],
    majorExports: ['Sugar', 'Nickel', 'Tobacco', 'Pharmaceuticals'],
  },
  // Africa
  ZAF: {
    government: 'Unitary Parliamentary Republic',
    headOfState: { title: 'President', name: 'Cyril Ramaphosa' },
    internationalOrgs: ['UN', 'G20', 'BRICS', 'African Union', 'Commonwealth'],
    economicBlocs: ['SADC', 'AfCFTA'],
    majorExports: ['Gold', 'Platinum', 'Iron ore', 'Vehicles'],
  },
  NGA: {
    government: 'Federal Presidential Republic',
    headOfState: { title: 'President', name: 'Bola Tinubu' },
    internationalOrgs: ['UN', 'OPEC', 'African Union', 'Commonwealth', 'ECOWAS'],
    economicBlocs: ['ECOWAS', 'AfCFTA'],
    majorExports: ['Crude petroleum', 'Natural gas'],
  },
  ETH: {
    government: 'Federal Parliamentary Republic',
    headOfState: { title: 'President', name: 'Taye Atske Selassie' },
    headOfGovernment: { title: 'Prime Minister', name: 'Abiy Ahmed' },
    internationalOrgs: ['UN', 'African Union'],
    economicBlocs: ['AfCFTA'],
    majorExports: ['Coffee', 'Gold', 'Oilseeds', 'Cut flowers'],
  },
  KEN: {
    government: 'Unitary Presidential Republic',
    headOfState: { title: 'President', name: 'William Ruto' },
    internationalOrgs: ['UN', 'African Union', 'Commonwealth', 'EAC'],
    economicBlocs: ['EAC', 'AfCFTA'],
    majorExports: ['Tea', 'Coffee', 'Cut flowers', 'Vegetables'],
  },
  SDN: {
    government: 'Transitional / Civil War',
    internationalOrgs: ['UN', 'African Union', 'Arab League'],
    majorExports: ['Gold', 'Petroleum', 'Livestock'],
  },
  COD: {
    government: 'Unitary Semi-Presidential Republic',
    headOfState: { title: 'President', name: 'Félix Tshisekedi' },
    headOfGovernment: { title: 'Prime Minister', name: 'Judith Suminwa' },
    internationalOrgs: ['UN', 'African Union', 'SADC'],
    majorExports: ['Cobalt', 'Copper', 'Diamonds', 'Coltan'],
  },
  MAR: {
    government: 'Unitary Parliamentary Constitutional Monarchy',
    headOfState: { title: 'King', name: 'Mohammed VI' },
    headOfGovernment: { title: 'Prime Minister', name: 'Aziz Akhannouch' },
    internationalOrgs: ['UN', 'Arab League', 'African Union', 'OIF'],
    economicBlocs: ['AfCFTA'],
    majorExports: ['Vehicles', 'Phosphates', 'Electronics', 'Textiles'],
  },
  DZA: {
    government: 'Unitary Semi-Presidential Republic',
    headOfState: { title: 'President', name: 'Abdelmadjid Tebboune' },
    headOfGovernment: { title: 'Prime Minister', name: 'Nadir Larbaoui' },
    internationalOrgs: ['UN', 'OPEC', 'Arab League', 'African Union'],
    majorExports: ['Natural gas', 'Crude petroleum', 'Refined petroleum'],
  },
  AUS: {
    government: 'Federal Parliamentary Constitutional Monarchy',
    headOfState: { title: 'King', name: 'Charles III' },
    headOfGovernment: { title: 'Prime Minister', name: 'Anthony Albanese' },
    internationalOrgs: ['UN', 'G20', 'OECD', 'APEC', 'Commonwealth'],
    alliances: ['AUKUS', 'Five Eyes', 'Quad', 'ANZUS'],
    economicBlocs: ['RCEP', 'CPTPP'],
    majorExports: ['Iron ore', 'Coal', 'Natural gas', 'Gold'],
  },
  NZL: {
    government: 'Unitary Parliamentary Constitutional Monarchy',
    headOfState: { title: 'King', name: 'Charles III' },
    headOfGovernment: { title: 'Prime Minister', name: 'Christopher Luxon' },
    internationalOrgs: ['UN', 'OECD', 'APEC', 'Commonwealth'],
    alliances: ['Five Eyes', 'ANZUS'],
    economicBlocs: ['RCEP', 'CPTPP'],
    majorExports: ['Dairy', 'Meat', 'Wood', 'Fruits'],
  },
};
