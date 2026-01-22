// Country metadata for the interactive map
export interface CountryInfo {
  code: string;
  name: string;
  region: string;
  subregion: string;
  capital: string;
  population?: string;
  government?: string;
  keywords: string[]; // For news matching
}

// Common countries with metadata
export const COUNTRY_DATA: Record<string, CountryInfo> = {
  // Major Powers
  'USA': { code: 'USA', name: 'United States', region: 'Americas', subregion: 'North America', capital: 'Washington D.C.', population: '331M', government: 'Federal Republic', keywords: ['united states', 'america', 'biden', 'trump', 'washington', 'us ', 'u.s.'] },
  'CHN': { code: 'CHN', name: 'China', region: 'Asia', subregion: 'East Asia', capital: 'Beijing', population: '1.4B', government: 'Communist Party State', keywords: ['china', 'chinese', 'beijing', 'xi jinping', 'prc'] },
  'RUS': { code: 'RUS', name: 'Russia', region: 'Europe/Asia', subregion: 'Eastern Europe', capital: 'Moscow', population: '144M', government: 'Federal Republic', keywords: ['russia', 'russian', 'moscow', 'putin', 'kremlin'] },
  'GBR': { code: 'GBR', name: 'United Kingdom', region: 'Europe', subregion: 'Western Europe', capital: 'London', population: '67M', government: 'Constitutional Monarchy', keywords: ['uk', 'britain', 'british', 'london', 'england'] },
  'FRA': { code: 'FRA', name: 'France', region: 'Europe', subregion: 'Western Europe', capital: 'Paris', population: '67M', government: 'Republic', keywords: ['france', 'french', 'paris', 'macron'] },
  'DEU': { code: 'DEU', name: 'Germany', region: 'Europe', subregion: 'Western Europe', capital: 'Berlin', population: '83M', government: 'Federal Republic', keywords: ['germany', 'german', 'berlin', 'scholz'] },
  'JPN': { code: 'JPN', name: 'Japan', region: 'Asia', subregion: 'East Asia', capital: 'Tokyo', population: '125M', government: 'Constitutional Monarchy', keywords: ['japan', 'japanese', 'tokyo'] },
  'IND': { code: 'IND', name: 'India', region: 'Asia', subregion: 'South Asia', capital: 'New Delhi', population: '1.4B', government: 'Federal Republic', keywords: ['india', 'indian', 'delhi', 'modi'] },

  // Middle East
  'ISR': { code: 'ISR', name: 'Israel', region: 'Middle East', subregion: 'Levant', capital: 'Jerusalem (disputed)', population: '9M', government: 'Parliamentary Democracy', keywords: ['israel', 'israeli', 'tel aviv', 'jerusalem', 'netanyahu', 'idf'] },
  'IRN': { code: 'IRN', name: 'Iran', region: 'Middle East', subregion: 'Persian Gulf', capital: 'Tehran', population: '87M', government: 'Islamic Republic', keywords: ['iran', 'iranian', 'tehran', 'khamenei', 'irgc'] },
  'SAU': { code: 'SAU', name: 'Saudi Arabia', region: 'Middle East', subregion: 'Arabian Peninsula', capital: 'Riyadh', population: '35M', government: 'Absolute Monarchy', keywords: ['saudi', 'arabia', 'riyadh', 'mbs'] },
  'TUR': { code: 'TUR', name: 'Turkey', region: 'Europe/Asia', subregion: 'Anatolia', capital: 'Ankara', population: '85M', government: 'Presidential Republic', keywords: ['turkey', 'turkish', 'ankara', 'erdogan'] },
  'EGY': { code: 'EGY', name: 'Egypt', region: 'Africa', subregion: 'North Africa', capital: 'Cairo', population: '104M', government: 'Presidential Republic', keywords: ['egypt', 'egyptian', 'cairo', 'sisi'] },
  'IRQ': { code: 'IRQ', name: 'Iraq', region: 'Middle East', subregion: 'Mesopotamia', capital: 'Baghdad', population: '42M', government: 'Federal Republic', keywords: ['iraq', 'iraqi', 'baghdad'] },
  'SYR': { code: 'SYR', name: 'Syria', region: 'Middle East', subregion: 'Levant', capital: 'Damascus', population: '22M', government: 'Transitional', keywords: ['syria', 'syrian', 'damascus'] },
  'LBN': { code: 'LBN', name: 'Lebanon', region: 'Middle East', subregion: 'Levant', capital: 'Beirut', population: '5M', government: 'Parliamentary Republic', keywords: ['lebanon', 'lebanese', 'beirut', 'hezbollah'] },
  'JOR': { code: 'JOR', name: 'Jordan', region: 'Middle East', subregion: 'Levant', capital: 'Amman', population: '11M', government: 'Constitutional Monarchy', keywords: ['jordan', 'jordanian', 'amman'] },
  'ARE': { code: 'ARE', name: 'United Arab Emirates', region: 'Middle East', subregion: 'Arabian Peninsula', capital: 'Abu Dhabi', population: '10M', government: 'Federation of Monarchies', keywords: ['uae', 'emirates', 'dubai', 'abu dhabi'] },
  'QAT': { code: 'QAT', name: 'Qatar', region: 'Middle East', subregion: 'Arabian Peninsula', capital: 'Doha', population: '3M', government: 'Absolute Monarchy', keywords: ['qatar', 'doha'] },
  'YEM': { code: 'YEM', name: 'Yemen', region: 'Middle East', subregion: 'Arabian Peninsula', capital: 'Sanaa', population: '33M', government: 'Transitional', keywords: ['yemen', 'yemeni', 'sanaa', 'houthi'] },

  // Europe
  'UKR': { code: 'UKR', name: 'Ukraine', region: 'Europe', subregion: 'Eastern Europe', capital: 'Kyiv', population: '41M', government: 'Republic', keywords: ['ukraine', 'ukrainian', 'kyiv', 'kiev', 'zelensky'] },
  'POL': { code: 'POL', name: 'Poland', region: 'Europe', subregion: 'Central Europe', capital: 'Warsaw', population: '38M', government: 'Parliamentary Republic', keywords: ['poland', 'polish', 'warsaw'] },
  'ITA': { code: 'ITA', name: 'Italy', region: 'Europe', subregion: 'Southern Europe', capital: 'Rome', population: '60M', government: 'Parliamentary Republic', keywords: ['italy', 'italian', 'rome'] },
  'ESP': { code: 'ESP', name: 'Spain', region: 'Europe', subregion: 'Southern Europe', capital: 'Madrid', population: '47M', government: 'Parliamentary Monarchy', keywords: ['spain', 'spanish', 'madrid'] },
  'NLD': { code: 'NLD', name: 'Netherlands', region: 'Europe', subregion: 'Western Europe', capital: 'Amsterdam', population: '17M', government: 'Constitutional Monarchy', keywords: ['netherlands', 'dutch', 'amsterdam'] },
  'BEL': { code: 'BEL', name: 'Belgium', region: 'Europe', subregion: 'Western Europe', capital: 'Brussels', population: '11M', government: 'Federal Monarchy', keywords: ['belgium', 'belgian', 'brussels'] },
  'SWE': { code: 'SWE', name: 'Sweden', region: 'Europe', subregion: 'Northern Europe', capital: 'Stockholm', population: '10M', government: 'Constitutional Monarchy', keywords: ['sweden', 'swedish', 'stockholm'] },
  'NOR': { code: 'NOR', name: 'Norway', region: 'Europe', subregion: 'Northern Europe', capital: 'Oslo', population: '5M', government: 'Constitutional Monarchy', keywords: ['norway', 'norwegian', 'oslo'] },
  'FIN': { code: 'FIN', name: 'Finland', region: 'Europe', subregion: 'Northern Europe', capital: 'Helsinki', population: '5.5M', government: 'Republic', keywords: ['finland', 'finnish', 'helsinki'] },
  'GRC': { code: 'GRC', name: 'Greece', region: 'Europe', subregion: 'Southern Europe', capital: 'Athens', population: '10M', government: 'Parliamentary Republic', keywords: ['greece', 'greek', 'athens'] },

  // Asia Pacific
  'KOR': { code: 'KOR', name: 'South Korea', region: 'Asia', subregion: 'East Asia', capital: 'Seoul', population: '52M', government: 'Presidential Republic', keywords: ['south korea', 'korean', 'seoul'] },
  'PRK': { code: 'PRK', name: 'North Korea', region: 'Asia', subregion: 'East Asia', capital: 'Pyongyang', population: '26M', government: 'Juche One-Party State', keywords: ['north korea', 'dprk', 'pyongyang', 'kim jong'] },
  'TWN': { code: 'TWN', name: 'Taiwan', region: 'Asia', subregion: 'East Asia', capital: 'Taipei', population: '24M', government: 'Republic', keywords: ['taiwan', 'taiwanese', 'taipei'] },
  'VNM': { code: 'VNM', name: 'Vietnam', region: 'Asia', subregion: 'Southeast Asia', capital: 'Hanoi', population: '98M', government: 'Communist Party State', keywords: ['vietnam', 'vietnamese', 'hanoi'] },
  'THA': { code: 'THA', name: 'Thailand', region: 'Asia', subregion: 'Southeast Asia', capital: 'Bangkok', population: '70M', government: 'Constitutional Monarchy', keywords: ['thailand', 'thai', 'bangkok'] },
  'PHL': { code: 'PHL', name: 'Philippines', region: 'Asia', subregion: 'Southeast Asia', capital: 'Manila', population: '114M', government: 'Presidential Republic', keywords: ['philippines', 'filipino', 'manila', 'marcos'] },
  'IDN': { code: 'IDN', name: 'Indonesia', region: 'Asia', subregion: 'Southeast Asia', capital: 'Jakarta', population: '277M', government: 'Presidential Republic', keywords: ['indonesia', 'indonesian', 'jakarta'] },
  'MYS': { code: 'MYS', name: 'Malaysia', region: 'Asia', subregion: 'Southeast Asia', capital: 'Kuala Lumpur', population: '33M', government: 'Federal Monarchy', keywords: ['malaysia', 'malaysian', 'kuala lumpur'] },
  'SGP': { code: 'SGP', name: 'Singapore', region: 'Asia', subregion: 'Southeast Asia', capital: 'Singapore', population: '5.5M', government: 'Parliamentary Republic', keywords: ['singapore'] },
  'MMR': { code: 'MMR', name: 'Myanmar', region: 'Asia', subregion: 'Southeast Asia', capital: 'Naypyidaw', population: '55M', government: 'Military Junta', keywords: ['myanmar', 'burma', 'burmese'] },
  'PAK': { code: 'PAK', name: 'Pakistan', region: 'Asia', subregion: 'South Asia', capital: 'Islamabad', population: '231M', government: 'Federal Republic', keywords: ['pakistan', 'pakistani', 'islamabad'] },
  'BGD': { code: 'BGD', name: 'Bangladesh', region: 'Asia', subregion: 'South Asia', capital: 'Dhaka', population: '169M', government: 'Parliamentary Republic', keywords: ['bangladesh', 'bangladeshi', 'dhaka'] },
  'AFG': { code: 'AFG', name: 'Afghanistan', region: 'Asia', subregion: 'South Asia', capital: 'Kabul', population: '40M', government: 'Taliban Emirate', keywords: ['afghanistan', 'afghan', 'kabul', 'taliban'] },
  'AUS': { code: 'AUS', name: 'Australia', region: 'Oceania', subregion: 'Australasia', capital: 'Canberra', population: '26M', government: 'Federal Monarchy', keywords: ['australia', 'australian', 'canberra', 'sydney'] },
  'NZL': { code: 'NZL', name: 'New Zealand', region: 'Oceania', subregion: 'Australasia', capital: 'Wellington', population: '5M', government: 'Constitutional Monarchy', keywords: ['new zealand', 'kiwi', 'wellington'] },

  // Africa
  'ZAF': { code: 'ZAF', name: 'South Africa', region: 'Africa', subregion: 'Southern Africa', capital: 'Pretoria', population: '60M', government: 'Parliamentary Republic', keywords: ['south africa', 'pretoria', 'johannesburg'] },
  'NGA': { code: 'NGA', name: 'Nigeria', region: 'Africa', subregion: 'West Africa', capital: 'Abuja', population: '218M', government: 'Federal Republic', keywords: ['nigeria', 'nigerian', 'lagos', 'abuja'] },
  'ETH': { code: 'ETH', name: 'Ethiopia', region: 'Africa', subregion: 'East Africa', capital: 'Addis Ababa', population: '120M', government: 'Federal Republic', keywords: ['ethiopia', 'ethiopian', 'addis ababa'] },
  'KEN': { code: 'KEN', name: 'Kenya', region: 'Africa', subregion: 'East Africa', capital: 'Nairobi', population: '54M', government: 'Presidential Republic', keywords: ['kenya', 'kenyan', 'nairobi'] },
  'SDN': { code: 'SDN', name: 'Sudan', region: 'Africa', subregion: 'North Africa', capital: 'Khartoum', population: '46M', government: 'Transitional', keywords: ['sudan', 'sudanese', 'khartoum', 'darfur'] },
  'COD': { code: 'COD', name: 'DR Congo', region: 'Africa', subregion: 'Central Africa', capital: 'Kinshasa', population: '99M', government: 'Republic', keywords: ['congo', 'drc', 'kinshasa', 'goma'] },
  'MAR': { code: 'MAR', name: 'Morocco', region: 'Africa', subregion: 'North Africa', capital: 'Rabat', population: '37M', government: 'Constitutional Monarchy', keywords: ['morocco', 'moroccan', 'rabat'] },
  'DZA': { code: 'DZA', name: 'Algeria', region: 'Africa', subregion: 'North Africa', capital: 'Algiers', population: '45M', government: 'Republic', keywords: ['algeria', 'algerian', 'algiers'] },
  'LBY': { code: 'LBY', name: 'Libya', region: 'Africa', subregion: 'North Africa', capital: 'Tripoli', population: '7M', government: 'Transitional', keywords: ['libya', 'libyan', 'tripoli'] },
  'SOM': { code: 'SOM', name: 'Somalia', region: 'Africa', subregion: 'East Africa', capital: 'Mogadishu', population: '17M', government: 'Federal Republic', keywords: ['somalia', 'somali', 'mogadishu'] },

  // Americas
  'CAN': { code: 'CAN', name: 'Canada', region: 'Americas', subregion: 'North America', capital: 'Ottawa', population: '38M', government: 'Federal Monarchy', keywords: ['canada', 'canadian', 'ottawa', 'trudeau'] },
  'MEX': { code: 'MEX', name: 'Mexico', region: 'Americas', subregion: 'North America', capital: 'Mexico City', population: '130M', government: 'Federal Republic', keywords: ['mexico', 'mexican', 'mexico city'] },
  'BRA': { code: 'BRA', name: 'Brazil', region: 'Americas', subregion: 'South America', capital: 'Brasilia', population: '215M', government: 'Federal Republic', keywords: ['brazil', 'brazilian', 'brasilia', 'lula'] },
  'ARG': { code: 'ARG', name: 'Argentina', region: 'Americas', subregion: 'South America', capital: 'Buenos Aires', population: '46M', government: 'Federal Republic', keywords: ['argentina', 'argentine', 'buenos aires', 'milei'] },
  'COL': { code: 'COL', name: 'Colombia', region: 'Americas', subregion: 'South America', capital: 'Bogota', population: '52M', government: 'Presidential Republic', keywords: ['colombia', 'colombian', 'bogota'] },
  'VEN': { code: 'VEN', name: 'Venezuela', region: 'Americas', subregion: 'South America', capital: 'Caracas', population: '28M', government: 'Federal Republic', keywords: ['venezuela', 'venezuelan', 'caracas', 'maduro'] },
  'CHL': { code: 'CHL', name: 'Chile', region: 'Americas', subregion: 'South America', capital: 'Santiago', population: '19M', government: 'Presidential Republic', keywords: ['chile', 'chilean', 'santiago'] },
  'PER': { code: 'PER', name: 'Peru', region: 'Americas', subregion: 'South America', capital: 'Lima', population: '34M', government: 'Presidential Republic', keywords: ['peru', 'peruvian', 'lima'] },
  'CUB': { code: 'CUB', name: 'Cuba', region: 'Americas', subregion: 'Caribbean', capital: 'Havana', population: '11M', government: 'Communist Party State', keywords: ['cuba', 'cuban', 'havana'] },
  'HTI': { code: 'HTI', name: 'Haiti', region: 'Americas', subregion: 'Caribbean', capital: 'Port-au-Prince', population: '12M', government: 'Transitional', keywords: ['haiti', 'haitian', 'port-au-prince'] },
};

// Get country info by ISO code
export function getCountryInfo(code: string): CountryInfo | null {
  return COUNTRY_DATA[code] || null;
}

// Find news matching a country
export function findCountryNews(code: string, articles: Array<{ title: string; description: string | null }>): number[] {
  const country = COUNTRY_DATA[code];
  if (!country) return [];

  const matchingIndices: number[] = [];
  articles.forEach((article, index) => {
    const text = `${article.title} ${article.description || ''}`.toLowerCase();
    if (country.keywords.some(kw => text.includes(kw.toLowerCase()))) {
      matchingIndices.push(index);
    }
  });
  return matchingIndices;
}

// Get all country codes
export function getAllCountryCodes(): string[] {
  return Object.keys(COUNTRY_DATA);
}

// Mapping from UN M49 numeric codes to ISO 3166-1 alpha-3 codes
// Used because world-atlas TopoJSON uses numeric IDs
export const NUMERIC_TO_ISO: Record<string, string> = {
  '004': 'AFG', // Afghanistan
  '008': 'ALB', // Albania
  '012': 'DZA', // Algeria
  '020': 'AND', // Andorra
  '024': 'AGO', // Angola
  '028': 'ATG', // Antigua and Barbuda
  '032': 'ARG', // Argentina
  '051': 'ARM', // Armenia
  '036': 'AUS', // Australia
  '040': 'AUT', // Austria
  '031': 'AZE', // Azerbaijan
  '044': 'BHS', // Bahamas
  '048': 'BHR', // Bahrain
  '050': 'BGD', // Bangladesh
  '052': 'BRB', // Barbados
  '112': 'BLR', // Belarus
  '056': 'BEL', // Belgium
  '084': 'BLZ', // Belize
  '204': 'BEN', // Benin
  '064': 'BTN', // Bhutan
  '068': 'BOL', // Bolivia
  '070': 'BIH', // Bosnia and Herzegovina
  '072': 'BWA', // Botswana
  '076': 'BRA', // Brazil
  '096': 'BRN', // Brunei
  '100': 'BGR', // Bulgaria
  '854': 'BFA', // Burkina Faso
  '108': 'BDI', // Burundi
  '116': 'KHM', // Cambodia
  '120': 'CMR', // Cameroon
  '124': 'CAN', // Canada
  '132': 'CPV', // Cape Verde
  '140': 'CAF', // Central African Republic
  '148': 'TCD', // Chad
  '152': 'CHL', // Chile
  '156': 'CHN', // China
  '170': 'COL', // Colombia
  '174': 'COM', // Comoros
  '178': 'COG', // Congo
  '180': 'COD', // DR Congo
  '188': 'CRI', // Costa Rica
  '384': 'CIV', // Ivory Coast
  '191': 'HRV', // Croatia
  '192': 'CUB', // Cuba
  '196': 'CYP', // Cyprus
  '203': 'CZE', // Czech Republic
  '208': 'DNK', // Denmark
  '262': 'DJI', // Djibouti
  '212': 'DMA', // Dominica
  '214': 'DOM', // Dominican Republic
  '218': 'ECU', // Ecuador
  '818': 'EGY', // Egypt
  '222': 'SLV', // El Salvador
  '226': 'GNQ', // Equatorial Guinea
  '232': 'ERI', // Eritrea
  '233': 'EST', // Estonia
  '748': 'SWZ', // Eswatini
  '231': 'ETH', // Ethiopia
  '242': 'FJI', // Fiji
  '246': 'FIN', // Finland
  '250': 'FRA', // France
  '266': 'GAB', // Gabon
  '270': 'GMB', // Gambia
  '268': 'GEO', // Georgia
  '276': 'DEU', // Germany
  '288': 'GHA', // Ghana
  '300': 'GRC', // Greece
  '308': 'GRD', // Grenada
  '320': 'GTM', // Guatemala
  '324': 'GIN', // Guinea
  '624': 'GNB', // Guinea-Bissau
  '328': 'GUY', // Guyana
  '332': 'HTI', // Haiti
  '340': 'HND', // Honduras
  '348': 'HUN', // Hungary
  '352': 'ISL', // Iceland
  '356': 'IND', // India
  '360': 'IDN', // Indonesia
  '364': 'IRN', // Iran
  '368': 'IRQ', // Iraq
  '372': 'IRL', // Ireland
  '376': 'ISR', // Israel
  '380': 'ITA', // Italy
  '388': 'JAM', // Jamaica
  '392': 'JPN', // Japan
  '400': 'JOR', // Jordan
  '398': 'KAZ', // Kazakhstan
  '404': 'KEN', // Kenya
  '296': 'KIR', // Kiribati
  '408': 'PRK', // North Korea
  '410': 'KOR', // South Korea
  '414': 'KWT', // Kuwait
  '417': 'KGZ', // Kyrgyzstan
  '418': 'LAO', // Laos
  '428': 'LVA', // Latvia
  '422': 'LBN', // Lebanon
  '426': 'LSO', // Lesotho
  '430': 'LBR', // Liberia
  '434': 'LBY', // Libya
  '438': 'LIE', // Liechtenstein
  '440': 'LTU', // Lithuania
  '442': 'LUX', // Luxembourg
  '450': 'MDG', // Madagascar
  '454': 'MWI', // Malawi
  '458': 'MYS', // Malaysia
  '462': 'MDV', // Maldives
  '466': 'MLI', // Mali
  '470': 'MLT', // Malta
  '584': 'MHL', // Marshall Islands
  '478': 'MRT', // Mauritania
  '480': 'MUS', // Mauritius
  '484': 'MEX', // Mexico
  '583': 'FSM', // Micronesia
  '498': 'MDA', // Moldova
  '492': 'MCO', // Monaco
  '496': 'MNG', // Mongolia
  '499': 'MNE', // Montenegro
  '504': 'MAR', // Morocco
  '508': 'MOZ', // Mozambique
  '104': 'MMR', // Myanmar
  '516': 'NAM', // Namibia
  '520': 'NRU', // Nauru
  '524': 'NPL', // Nepal
  '528': 'NLD', // Netherlands
  '554': 'NZL', // New Zealand
  '558': 'NIC', // Nicaragua
  '562': 'NER', // Niger
  '566': 'NGA', // Nigeria
  '807': 'MKD', // North Macedonia
  '578': 'NOR', // Norway
  '512': 'OMN', // Oman
  '586': 'PAK', // Pakistan
  '585': 'PLW', // Palau
  '591': 'PAN', // Panama
  '598': 'PNG', // Papua New Guinea
  '600': 'PRY', // Paraguay
  '604': 'PER', // Peru
  '608': 'PHL', // Philippines
  '616': 'POL', // Poland
  '620': 'PRT', // Portugal
  '634': 'QAT', // Qatar
  '642': 'ROU', // Romania
  '643': 'RUS', // Russia
  '646': 'RWA', // Rwanda
  '659': 'KNA', // Saint Kitts and Nevis
  '662': 'LCA', // Saint Lucia
  '670': 'VCT', // Saint Vincent and the Grenadines
  '882': 'WSM', // Samoa
  '674': 'SMR', // San Marino
  '678': 'STP', // Sao Tome and Principe
  '682': 'SAU', // Saudi Arabia
  '686': 'SEN', // Senegal
  '688': 'SRB', // Serbia
  '690': 'SYC', // Seychelles
  '694': 'SLE', // Sierra Leone
  '702': 'SGP', // Singapore
  '703': 'SVK', // Slovakia
  '705': 'SVN', // Slovenia
  '090': 'SLB', // Solomon Islands
  '706': 'SOM', // Somalia
  '710': 'ZAF', // South Africa
  '728': 'SSD', // South Sudan
  '724': 'ESP', // Spain
  '144': 'LKA', // Sri Lanka
  '729': 'SDN', // Sudan
  '740': 'SUR', // Suriname
  '752': 'SWE', // Sweden
  '756': 'CHE', // Switzerland
  '760': 'SYR', // Syria
  '158': 'TWN', // Taiwan
  '762': 'TJK', // Tajikistan
  '834': 'TZA', // Tanzania
  '764': 'THA', // Thailand
  '626': 'TLS', // Timor-Leste
  '768': 'TGO', // Togo
  '776': 'TON', // Tonga
  '780': 'TTO', // Trinidad and Tobago
  '788': 'TUN', // Tunisia
  '792': 'TUR', // Turkey
  '795': 'TKM', // Turkmenistan
  '798': 'TUV', // Tuvalu
  '800': 'UGA', // Uganda
  '804': 'UKR', // Ukraine
  '784': 'ARE', // United Arab Emirates
  '826': 'GBR', // United Kingdom
  '840': 'USA', // United States
  '858': 'URY', // Uruguay
  '860': 'UZB', // Uzbekistan
  '548': 'VUT', // Vanuatu
  '336': 'VAT', // Vatican City
  '862': 'VEN', // Venezuela
  '704': 'VNM', // Vietnam
  '887': 'YEM', // Yemen
  '894': 'ZMB', // Zambia
  '716': 'ZWE', // Zimbabwe
  '275': 'PSE', // Palestine
  '732': 'ESH', // Western Sahara
  '-99': '',    // Invalid/no country
};

// Convert numeric ID to ISO code
export function numericToIso(numericId: string): string {
  return NUMERIC_TO_ISO[numericId] || '';
}
