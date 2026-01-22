import { HistoricalYear, HistoricalEra, EraDefinition } from '@/types/historical';
import { MIN_YEAR, MAX_YEAR } from '@/store/timelineStore';

// Era definitions with colors and date ranges
export const ERAS: EraDefinition[] = [
  {
    id: 'ANCIENT',
    name: 'Ancient',
    startYear: -1000,
    endYear: -500,
    color: '#8B4513', // Saddle brown
    description: 'Rise of early civilizations and empires',
  },
  {
    id: 'CLASSICAL',
    name: 'Classical',
    startYear: -500,
    endYear: 500,
    color: '#DAA520', // Goldenrod
    description: 'Greek, Roman, and Han Chinese civilizations',
  },
  {
    id: 'MEDIEVAL',
    name: 'Medieval',
    startYear: 500,
    endYear: 1500,
    color: '#4B0082', // Indigo
    description: 'Feudalism, Crusades, and Mongol Empire',
  },
  {
    id: 'EARLY_MODERN',
    name: 'Early Modern',
    startYear: 1500,
    endYear: 1800,
    color: '#006400', // Dark green
    description: 'Age of Exploration and colonial expansion',
  },
  {
    id: 'MODERN',
    name: 'Modern',
    startYear: 1800,
    endYear: 1945,
    color: '#B22222', // Fire brick
    description: 'Industrial age through World Wars',
  },
  {
    id: 'CONTEMPORARY',
    name: 'Contemporary',
    startYear: 1945,
    endYear: MAX_YEAR,
    color: '#1E90FF', // Dodger blue
    description: 'Cold War to present day',
  },
];

/**
 * Format a year for display with BCE/CE notation
 */
export function formatYear(year: HistoricalYear): string {
  if (year < 0) {
    return `${Math.abs(year)} BCE`;
  } else if (year === 0) {
    return '1 BCE'; // There is no year 0
  } else {
    return `${year} CE`;
  }
}

/**
 * Format a year compactly (for tight spaces)
 */
export function formatYearCompact(year: HistoricalYear): string {
  if (year < 0) {
    return `${Math.abs(year)}BC`;
  }
  return `${year}`;
}

/**
 * Get the era for a given year
 */
export function getEra(year: HistoricalYear): HistoricalEra {
  for (const era of ERAS) {
    if (year >= era.startYear && year < era.endYear) {
      return era.id;
    }
  }
  // Default to contemporary for current year
  return 'CONTEMPORARY';
}

/**
 * Get era definition for a given year
 */
export function getEraDefinition(year: HistoricalYear): EraDefinition {
  return ERAS.find((era) => year >= era.startYear && year < era.endYear) || ERAS[ERAS.length - 1];
}

/**
 * Get era definition by ID
 */
export function getEraById(eraId: HistoricalEra): EraDefinition {
  return ERAS.find((era) => era.id === eraId) || ERAS[ERAS.length - 1];
}

/**
 * Convert year to slider position (0-1) using non-linear scale
 * More space for recent history (logarithmic-ish for ancient)
 */
export function yearToSliderPosition(year: HistoricalYear): number {
  const totalSpan = MAX_YEAR - MIN_YEAR;

  // Use a piecewise function to give more space to recent eras
  // Ancient/Classical (1000 BCE - 500 CE): 15% of slider
  // Medieval (500-1500 CE): 15% of slider
  // Early Modern (1500-1800 CE): 15% of slider
  // Modern (1800-1945 CE): 25% of slider
  // Contemporary (1945-present): 30% of slider

  if (year < -500) {
    // Ancient: 1000 BCE to 500 BCE = 0% to 7.5%
    const progress = (year - MIN_YEAR) / 500;
    return progress * 0.075;
  } else if (year < 500) {
    // Classical: 500 BCE to 500 CE = 7.5% to 15%
    const progress = (year - (-500)) / 1000;
    return 0.075 + progress * 0.075;
  } else if (year < 1500) {
    // Medieval: 500 CE to 1500 CE = 15% to 30%
    const progress = (year - 500) / 1000;
    return 0.15 + progress * 0.15;
  } else if (year < 1800) {
    // Early Modern: 1500 CE to 1800 CE = 30% to 45%
    const progress = (year - 1500) / 300;
    return 0.30 + progress * 0.15;
  } else if (year < 1945) {
    // Modern: 1800 CE to 1945 CE = 45% to 70%
    const progress = (year - 1800) / 145;
    return 0.45 + progress * 0.25;
  } else {
    // Contemporary: 1945 CE to present = 70% to 100%
    const progress = (year - 1945) / (MAX_YEAR - 1945);
    return 0.70 + progress * 0.30;
  }
}

/**
 * Convert slider position (0-1) to year using non-linear scale
 */
export function sliderPositionToYear(position: number): HistoricalYear {
  const clampedPos = Math.max(0, Math.min(1, position));

  if (clampedPos < 0.075) {
    // Ancient: 0% to 7.5% = 1000 BCE to 500 BCE
    const progress = clampedPos / 0.075;
    return Math.round(MIN_YEAR + progress * 500);
  } else if (clampedPos < 0.15) {
    // Classical: 7.5% to 15% = 500 BCE to 500 CE
    const progress = (clampedPos - 0.075) / 0.075;
    return Math.round(-500 + progress * 1000);
  } else if (clampedPos < 0.30) {
    // Medieval: 15% to 30% = 500 CE to 1500 CE
    const progress = (clampedPos - 0.15) / 0.15;
    return Math.round(500 + progress * 1000);
  } else if (clampedPos < 0.45) {
    // Early Modern: 30% to 45% = 1500 CE to 1800 CE
    const progress = (clampedPos - 0.30) / 0.15;
    return Math.round(1500 + progress * 300);
  } else if (clampedPos < 0.70) {
    // Modern: 45% to 70% = 1800 CE to 1945 CE
    const progress = (clampedPos - 0.45) / 0.25;
    return Math.round(1800 + progress * 145);
  } else {
    // Contemporary: 70% to 100% = 1945 CE to present
    const progress = (clampedPos - 0.70) / 0.30;
    return Math.round(1945 + progress * (MAX_YEAR - 1945));
  }
}

/**
 * Get step size for a given year (smaller steps for recent history)
 */
export function getYearStep(year: HistoricalYear): number {
  if (year < -500) return 100; // Ancient: century steps
  if (year < 500) return 50;   // Classical: half-century
  if (year < 1500) return 25;  // Medieval: quarter-century
  if (year < 1800) return 10;  // Early Modern: decade
  if (year < 1945) return 5;   // Modern: 5-year
  return 1;                     // Contemporary: annual
}

/**
 * Get available years with data for a given era
 * Returns snapshot years that have boundary data
 */
export function getAvailableYears(era: HistoricalEra): HistoricalYear[] {
  const eraDef = getEraById(era);
  const step = era === 'CONTEMPORARY' ? 1 :
               era === 'MODERN' ? 5 :
               era === 'EARLY_MODERN' ? 10 :
               era === 'MEDIEVAL' ? 25 :
               era === 'CLASSICAL' ? 50 : 100;

  const years: HistoricalYear[] = [];
  for (let y = eraDef.startYear; y < eraDef.endYear; y += step) {
    years.push(y);
  }
  return years;
}

/**
 * Find the nearest year with available boundary data
 */
export function getNearestAvailableYear(year: HistoricalYear, availableYears: HistoricalYear[]): HistoricalYear {
  if (availableYears.length === 0) return year;

  return availableYears.reduce((nearest, current) => {
    return Math.abs(current - year) < Math.abs(nearest - year) ? current : nearest;
  });
}

/**
 * Calculate century for display
 */
export function getCentury(year: HistoricalYear): string {
  if (year < 0) {
    const century = Math.ceil(Math.abs(year) / 100);
    return `${century}${getOrdinalSuffix(century)} century BCE`;
  }
  const century = Math.ceil(year / 100);
  return `${century}${getOrdinalSuffix(century)} century CE`;
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
