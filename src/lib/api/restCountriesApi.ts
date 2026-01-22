import { ExtendedCountryProfile } from '@/types';

const REST_COUNTRIES_BASE = 'https://restcountries.com/v3.1';

// Fields to request for efficiency
const FIELDS = [
  'name', 'capital', 'region', 'subregion', 'population', 'area',
  'borders', 'landlocked', 'latlng', 'timezones', 'continents',
  'languages', 'currencies', 'flags', 'coatOfArms',
  'tld', 'idd', 'independent', 'unMember', 'cca3'
].join(',');

interface RestCountriesResponse {
  name: {
    common: string;
    official: string;
  };
  cca3: string;
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area: number;
  borders?: string[];
  landlocked: boolean;
  latlng: [number, number];
  timezones: string[];
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol: string }>;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  coatOfArms?: { png: string; svg: string };
  tld?: string[];
  idd?: { root: string; suffixes?: string[] };
  independent: boolean;
  unMember: boolean;
}

export async function fetchCountryFromRestCountries(
  code: string
): Promise<ExtendedCountryProfile | null> {
  try {
    const response = await fetch(
      `${REST_COUNTRIES_BASE}/alpha/${code}?fields=${FIELDS}`,
      {
        headers: {
          'User-Agent': 'SituationMonitor/1.0',
        },
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Country not found: ${code}`);
        return null;
      }
      throw new Error(`REST Countries API error: ${response.status}`);
    }

    const data: RestCountriesResponse = await response.json();

    // Transform to our format
    return {
      code: data.cca3,
      name: {
        common: data.name.common,
        official: data.name.official,
      },
      capital: data.capital || [],
      region: data.region,
      subregion: data.subregion || data.region,
      population: data.population,
      area: data.area,
      borders: data.borders || [],
      landlocked: data.landlocked,
      coordinates: {
        lat: data.latlng[0],
        lng: data.latlng[1],
      },
      timezones: data.timezones,
      languages: data.languages || {},
      currencies: data.currencies || {},
      flags: data.flags,
      coatOfArms: data.coatOfArms,
      independent: data.independent,
      unMember: data.unMember,
      tld: data.tld,
      callingCode: data.idd?.root
        ? `${data.idd.root}${data.idd.suffixes?.[0] || ''}`
        : undefined,
    };
  } catch (error) {
    console.error('REST Countries API error:', error);
    return null;
  }
}

// Fetch multiple countries at once (for borders display)
export async function fetchMultipleCountries(
  codes: string[]
): Promise<Map<string, ExtendedCountryProfile>> {
  if (codes.length === 0) return new Map();

  try {
    const response = await fetch(
      `${REST_COUNTRIES_BASE}/alpha?codes=${codes.join(',')}&fields=${FIELDS}`,
      {
        headers: {
          'User-Agent': 'SituationMonitor/1.0',
        },
        next: { revalidate: 86400 },
      }
    );

    if (!response.ok) {
      throw new Error(`REST Countries API error: ${response.status}`);
    }

    const data: RestCountriesResponse[] = await response.json();
    const result = new Map<string, ExtendedCountryProfile>();

    for (const country of data) {
      result.set(country.cca3, {
        code: country.cca3,
        name: {
          common: country.name.common,
          official: country.name.official,
        },
        capital: country.capital || [],
        region: country.region,
        subregion: country.subregion || country.region,
        population: country.population,
        area: country.area,
        borders: country.borders || [],
        landlocked: country.landlocked,
        coordinates: {
          lat: country.latlng[0],
          lng: country.latlng[1],
        },
        timezones: country.timezones,
        languages: country.languages || {},
        currencies: country.currencies || {},
        flags: country.flags,
        coatOfArms: country.coatOfArms,
        independent: country.independent,
        unMember: country.unMember,
        tld: country.tld,
        callingCode: country.idd?.root
          ? `${country.idd.root}${country.idd.suffixes?.[0] || ''}`
          : undefined,
      });
    }

    return result;
  } catch (error) {
    console.error('REST Countries API error:', error);
    return new Map();
  }
}
