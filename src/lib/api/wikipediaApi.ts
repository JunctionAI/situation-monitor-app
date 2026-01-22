import { HistoricalProfile } from '@/types';

const WIKIPEDIA_BASE = 'https://en.wikipedia.org/api/rest_v1';

interface WikipediaSummaryResponse {
  title: string;
  extract: string;
  description?: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
}

export async function fetchWikipediaSummary(
  countryName: string
): Promise<HistoricalProfile | null> {
  try {
    // Format country name for Wikipedia URL (spaces to underscores)
    const formattedName = countryName.replace(/ /g, '_');

    const response = await fetch(
      `${WIKIPEDIA_BASE}/page/summary/${encodeURIComponent(formattedName)}`,
      {
        headers: {
          'User-Agent': 'SituationMonitor/1.0 (https://github.com/situation-monitor)',
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        // Try with "_country" suffix for disambiguation
        return await fetchWithSuffix(countryName, 'country');
      }
      console.warn(`Wikipedia API error for ${countryName}: ${response.status}`);
      return null;
    }

    const data: WikipediaSummaryResponse = await response.json();

    // Check if this is a disambiguation page
    if (data.description?.toLowerCase().includes('disambiguation')) {
      return await fetchWithSuffix(countryName, 'country');
    }

    return {
      summary: data.extract,
      extract: data.extract,
      thumbnail: data.thumbnail,
    };
  } catch (error) {
    console.error('Wikipedia API error:', error);
    return null;
  }
}

async function fetchWithSuffix(
  countryName: string,
  suffix: string
): Promise<HistoricalProfile | null> {
  try {
    const formattedName = `${countryName.replace(/ /g, '_')}_(${suffix})`;

    const response = await fetch(
      `${WIKIPEDIA_BASE}/page/summary/${encodeURIComponent(formattedName)}`,
      {
        headers: {
          'User-Agent': 'SituationMonitor/1.0',
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: WikipediaSummaryResponse = await response.json();

    return {
      summary: data.extract,
      extract: data.extract,
      thumbnail: data.thumbnail,
    };
  } catch (error) {
    console.error('Wikipedia fallback error:', error);
    return null;
  }
}

// Country name mappings for better Wikipedia lookup
const WIKIPEDIA_NAME_OVERRIDES: Record<string, string> = {
  'USA': 'United_States',
  'GBR': 'United_Kingdom',
  'RUS': 'Russia',
  'CHN': 'China',
  'KOR': 'South_Korea',
  'PRK': 'North_Korea',
  'TWN': 'Taiwan',
  'PSE': 'State_of_Palestine',
  'COD': 'Democratic_Republic_of_the_Congo',
  'COG': 'Republic_of_the_Congo',
  'CIV': "Ivory_Coast",
  'TZA': 'Tanzania',
  'VNM': 'Vietnam',
  'LAO': 'Laos',
  'MMR': 'Myanmar',
  'SYR': 'Syria',
  'IRN': 'Iran',
  'ARE': 'United_Arab_Emirates',
  'SAU': 'Saudi_Arabia',
};

export function getWikipediaTitle(code: string, commonName: string): string {
  return WIKIPEDIA_NAME_OVERRIDES[code] || commonName.replace(/ /g, '_');
}
