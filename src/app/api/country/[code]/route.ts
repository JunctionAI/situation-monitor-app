import { NextRequest, NextResponse } from 'next/server';
import { newsCache } from '@/lib/cache/newsCache';
import { fetchCountryFromRestCountries } from '@/lib/api/restCountriesApi';
import { fetchWikipediaSummary, getWikipediaTitle } from '@/lib/api/wikipediaApi';
import { fetchEconomicIndicators, EXTENDED_COUNTRY_DATA } from '@/lib/api/worldBankApi';
import { getCountryInfo } from '@/data/countries';
import {
  CountryProfileResponse,
  ExtendedCountryProfile,
  EconomicProfile,
  PoliticalProfile,
  HistoricalProfile,
} from '@/types';

export const dynamic = 'force-dynamic';

// Strategic data for key countries (curated)
const STRATEGIC_DATA: Record<string, {
  gdp?: { nominal?: number; perCapita?: number };
  government?: string;
  headOfState?: { title: string; name: string };
  headOfGovernment?: { title: string; name: string };
  internationalOrgs?: string[];
  alliances?: string[];
  economicBlocs?: string[];
  majorExports?: string[];
}> = {
  USA: {
    gdp: { nominal: 25460000000000, perCapita: 76399 },
    government: 'Federal Presidential Constitutional Republic',
    headOfState: { title: 'President', name: 'Donald Trump' },
    internationalOrgs: ['UN', 'NATO', 'G7', 'G20', 'OECD', 'WTO', 'IMF', 'World Bank'],
    alliances: ['NATO', 'Five Eyes', 'AUKUS', 'Quad'],
    economicBlocs: ['USMCA'],
    majorExports: ['Refined petroleum', 'Aircraft', 'Integrated circuits', 'Pharmaceuticals'],
  },
  CHN: {
    gdp: { nominal: 17963000000000, perCapita: 12720 },
    government: 'Unitary One-Party Socialist Republic',
    headOfState: { title: 'President', name: 'Xi Jinping' },
    headOfGovernment: { title: 'Premier', name: 'Li Qiang' },
    internationalOrgs: ['UN', 'G20', 'WTO', 'BRICS', 'SCO'],
    alliances: ['SCO'],
    economicBlocs: ['RCEP'],
    majorExports: ['Electronics', 'Machinery', 'Textiles', 'Steel'],
  },
  RUS: {
    gdp: { nominal: 2240000000000, perCapita: 15345 },
    government: 'Federal Semi-Presidential Republic',
    headOfState: { title: 'President', name: 'Vladimir Putin' },
    headOfGovernment: { title: 'Prime Minister', name: 'Mikhail Mishustin' },
    internationalOrgs: ['UN', 'G20', 'BRICS', 'SCO', 'CIS', 'EAEU'],
    alliances: ['CSTO', 'SCO'],
    economicBlocs: ['EAEU'],
    majorExports: ['Crude petroleum', 'Natural gas', 'Refined petroleum', 'Coal'],
  },
  GBR: {
    gdp: { nominal: 3070000000000, perCapita: 45850 },
    government: 'Unitary Parliamentary Constitutional Monarchy',
    headOfState: { title: 'King', name: 'Charles III' },
    headOfGovernment: { title: 'Prime Minister', name: 'Keir Starmer' },
    internationalOrgs: ['UN', 'NATO', 'G7', 'G20', 'OECD', 'Commonwealth'],
    alliances: ['NATO', 'Five Eyes', 'AUKUS'],
    majorExports: ['Pharmaceuticals', 'Machinery', 'Vehicles', 'Precious metals'],
  },
  DEU: {
    gdp: { nominal: 4072000000000, perCapita: 48756 },
    government: 'Federal Parliamentary Republic',
    headOfState: { title: 'President', name: 'Frank-Walter Steinmeier' },
    headOfGovernment: { title: 'Chancellor', name: 'Friedrich Merz' },
    internationalOrgs: ['UN', 'NATO', 'EU', 'G7', 'G20', 'OECD'],
    alliances: ['NATO', 'EU'],
    economicBlocs: ['EU', 'Eurozone'],
    majorExports: ['Vehicles', 'Machinery', 'Pharmaceuticals', 'Electronics'],
  },
  FRA: {
    gdp: { nominal: 2780000000000, perCapita: 42330 },
    government: 'Unitary Semi-Presidential Republic',
    headOfState: { title: 'President', name: 'Emmanuel Macron' },
    headOfGovernment: { title: 'Prime Minister', name: 'François Bayrou' },
    internationalOrgs: ['UN', 'NATO', 'EU', 'G7', 'G20', 'OECD'],
    alliances: ['NATO', 'EU'],
    economicBlocs: ['EU', 'Eurozone'],
    majorExports: ['Aircraft', 'Pharmaceuticals', 'Vehicles', 'Wine'],
  },
  JPN: {
    gdp: { nominal: 4231000000000, perCapita: 33815 },
    government: 'Unitary Parliamentary Constitutional Monarchy',
    headOfState: { title: 'Emperor', name: 'Naruhito' },
    headOfGovernment: { title: 'Prime Minister', name: 'Shigeru Ishiba' },
    internationalOrgs: ['UN', 'G7', 'G20', 'OECD', 'APEC'],
    alliances: ['US-Japan Alliance', 'Quad'],
    economicBlocs: ['RCEP', 'CPTPP'],
    majorExports: ['Vehicles', 'Machinery', 'Electronics', 'Steel'],
  },
  IND: {
    gdp: { nominal: 3385000000000, perCapita: 2389 },
    government: 'Federal Parliamentary Republic',
    headOfState: { title: 'President', name: 'Droupadi Murmu' },
    headOfGovernment: { title: 'Prime Minister', name: 'Narendra Modi' },
    internationalOrgs: ['UN', 'G20', 'BRICS', 'SCO', 'Commonwealth'],
    alliances: ['Quad'],
    majorExports: ['Refined petroleum', 'Pharmaceuticals', 'Diamonds', 'IT services'],
  },
  UKR: {
    gdp: { nominal: 160000000000, perCapita: 4500 },
    government: 'Unitary Semi-Presidential Republic',
    headOfState: { title: 'President', name: 'Volodymyr Zelenskyy' },
    headOfGovernment: { title: 'Prime Minister', name: 'Denys Shmyhal' },
    internationalOrgs: ['UN', 'OSCE', 'Council of Europe'],
    alliances: ['NATO aspirant', 'EU candidate'],
    majorExports: ['Agricultural products', 'Steel', 'Machinery'],
  },
  ISR: {
    gdp: { nominal: 522000000000, perCapita: 54930 },
    government: 'Unitary Parliamentary Republic',
    headOfState: { title: 'President', name: 'Isaac Herzog' },
    headOfGovernment: { title: 'Prime Minister', name: 'Benjamin Netanyahu' },
    internationalOrgs: ['UN', 'OECD'],
    alliances: ['US ally', 'Abraham Accords'],
    majorExports: ['Diamonds', 'Pharmaceuticals', 'Electronics', 'Machinery'],
  },
  IRN: {
    gdp: { nominal: 388000000000, perCapita: 4500 },
    government: 'Unitary Theocratic-Presidential Islamic Republic',
    headOfState: { title: 'Supreme Leader', name: 'Ali Khamenei' },
    headOfGovernment: { title: 'President', name: 'Masoud Pezeshkian' },
    internationalOrgs: ['UN', 'OPEC', 'SCO'],
    alliances: ['Axis of Resistance'],
    majorExports: ['Crude petroleum', 'Petrochemicals', 'Iron ore'],
  },
  SAU: {
    gdp: { nominal: 1069000000000, perCapita: 30436 },
    government: 'Unitary Islamic Absolute Monarchy',
    headOfState: { title: 'King', name: 'Salman bin Abdulaziz' },
    headOfGovernment: { title: 'Crown Prince', name: 'Mohammed bin Salman' },
    internationalOrgs: ['UN', 'G20', 'OPEC', 'GCC', 'Arab League'],
    alliances: ['GCC', 'US ally'],
    majorExports: ['Crude petroleum', 'Refined petroleum', 'Polymers'],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const upperCode = code.toUpperCase();

    // Check cache first
    const cacheKey = `country:full:${upperCode}`;
    const cached = newsCache.get<CountryProfileResponse>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=900', // 15 min
        },
      });
    }

    // Fetch from REST Countries API
    const basicData = await fetchCountryFromRestCountries(upperCode);

    if (!basicData) {
      // Fallback to local data
      const localData = getCountryInfo(upperCode);
      if (!localData) {
        return NextResponse.json(
          { error: 'Country not found' },
          { status: 404 }
        );
      }

      // Return minimal response from local data
      const minimalResponse: CountryProfileResponse = {
        basic: {
          code: localData.code,
          name: { common: localData.name, official: localData.name },
          capital: [localData.capital],
          region: localData.region,
          subregion: localData.subregion,
          population: parseInt(localData.population?.replace(/[^\d]/g, '') || '0'),
          area: 0,
          borders: [],
          landlocked: false,
          coordinates: { lat: 0, lng: 0 },
          timezones: [],
          languages: {},
          currencies: {},
          flags: { png: '', svg: '' },
          independent: true,
          unMember: true,
        },
        economic: {
          currencies: {},
        },
        political: {
          government: localData.government || 'Unknown',
        },
        historical: {
          summary: 'Historical information not available.',
        },
        lastUpdated: new Date().toISOString(),
        cached: false,
      };

      return NextResponse.json(minimalResponse);
    }

    // Fetch Wikipedia summary and World Bank data in parallel
    const wikiTitle = getWikipediaTitle(upperCode, basicData.name.common);
    const [wikiData, worldBankData] = await Promise.all([
      fetchWikipediaSummary(wikiTitle),
      fetchEconomicIndicators(upperCode),
    ]);

    // Get strategic data if available (primary source)
    const strategic = STRATEGIC_DATA[upperCode];
    // Fall back to extended country data
    const extended = EXTENDED_COUNTRY_DATA[upperCode];

    // Build economic profile - prefer strategic data, then World Bank, then extended
    const economic: EconomicProfile = {
      currencies: basicData.currencies,
      gdp: strategic?.gdp || (worldBankData.gdpNominal ? {
        nominal: worldBankData.gdpNominal,
        perCapita: worldBankData.gdpPerCapita,
      } : undefined),
      gdpGrowth: worldBankData.gdpGrowth,
      inflation: worldBankData.inflation,
      unemployment: worldBankData.unemployment,
      majorExports: strategic?.majorExports || extended?.majorExports,
      economicBlocs: strategic?.economicBlocs || extended?.economicBlocs,
    };

    // Build political profile - prefer strategic data, then extended
    const political: PoliticalProfile = {
      government: strategic?.government || extended?.government || 'Unknown',
      headOfState: strategic?.headOfState || extended?.headOfState,
      headOfGovernment: strategic?.headOfGovernment || extended?.headOfGovernment,
      internationalOrganizations: strategic?.internationalOrgs || extended?.internationalOrgs,
    };

    // Build historical profile
    const historical: HistoricalProfile = {
      summary: wikiData?.summary || 'Historical information not available.',
      extract: wikiData?.extract,
      thumbnail: wikiData?.thumbnail,
    };

    // Build complete response
    const response: CountryProfileResponse = {
      basic: basicData,
      economic,
      political,
      historical,
      strategic: (strategic || extended) ? {
        alliances: strategic?.alliances || extended?.alliances,
      } : undefined,
      lastUpdated: new Date().toISOString(),
      cached: false,
    };

    // Cache for 15 minutes
    newsCache.set(cacheKey, response, 15 * 60 * 1000);

    return NextResponse.json(response, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=900',
      },
    });
  } catch (error) {
    console.error('Country API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch country data' },
      { status: 500 }
    );
  }
}
