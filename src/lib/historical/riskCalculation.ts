import { HistoricalYear, HistoricalRiskZone } from '@/types/historical';
import { getActiveConflicts } from '@/data/historical/contemporary-events';

// Base risk scores for countries during different periods
// These are simplified approximations for demonstration

interface HistoricalRiskData {
  baseRisk: number;
  factors: string[];
}

// Calculate historical risk for a country at a given year
export function calculateHistoricalRisk(
  countryCode: string,
  year: HistoricalYear
): HistoricalRiskData {
  // Default peaceful state
  let baseRisk = 20;
  const factors: string[] = [];

  // Cold War era (1947-1991)
  if (year >= 1947 && year <= 1991) {
    // Superpowers
    if (countryCode === 'USA' || countryCode === 'RUS') {
      baseRisk = 50;
      factors.push('Nuclear superpower');
      factors.push('Cold War tensions');
    }
    // Eastern Bloc
    if (['POL', 'DDR', 'CZE', 'HUN', 'ROM', 'BGR'].includes(countryCode)) {
      baseRisk = 45;
      factors.push('Soviet sphere of influence');
      if (year === 1956 && countryCode === 'HUN') {
        baseRisk = 90;
        factors.push('Hungarian Uprising');
      }
      if (year === 1968 && countryCode === 'CZE') {
        baseRisk = 85;
        factors.push('Prague Spring');
      }
    }
    // Berlin
    if (countryCode === 'DEU') {
      baseRisk = year >= 1961 && year <= 1989 ? 55 : 40;
      factors.push('Cold War frontline');
      if (year === 1961) {
        baseRisk = 70;
        factors.push('Berlin Wall construction');
      }
      if (year === 1989) {
        baseRisk = 60;
        factors.push('Berlin Wall fall');
      }
    }
    // Cuba
    if (countryCode === 'CUB') {
      baseRisk = year === 1962 ? 95 : 60;
      if (year === 1962) factors.push('Cuban Missile Crisis');
    }
  }

  // Korean War (1950-1953)
  if (year >= 1950 && year <= 1953) {
    if (countryCode === 'KOR' || countryCode === 'PRK') {
      baseRisk = 95;
      factors.push('Korean War');
    }
  }

  // Vietnam War (1955-1975)
  if (year >= 1955 && year <= 1975) {
    if (countryCode === 'VNM') {
      baseRisk = year >= 1964 ? 90 : 70;
      factors.push('Vietnam War');
    }
    if (countryCode === 'KHM') {
      baseRisk = year >= 1970 ? 80 : 50;
      factors.push('Indochina conflict spillover');
      if (year >= 1975 && year <= 1979) {
        baseRisk = 95;
        factors.push('Khmer Rouge genocide');
      }
    }
    if (countryCode === 'LAO') {
      baseRisk = 70;
      factors.push('Secret war in Laos');
    }
  }

  // Middle East conflicts
  if (['ISR', 'PSE', 'EGY', 'SYR', 'JOR', 'LBN'].includes(countryCode)) {
    // 1948 Arab-Israeli War
    if (year === 1948) {
      baseRisk = 90;
      factors.push('Arab-Israeli War');
    }
    // Six-Day War
    if (year === 1967) {
      baseRisk = 90;
      factors.push('Six-Day War');
    }
    // Yom Kippur War
    if (year === 1973) {
      baseRisk = 90;
      factors.push('Yom Kippur War');
    }
    // Lebanon Civil War
    if (countryCode === 'LBN' && year >= 1975 && year <= 1990) {
      baseRisk = 85;
      factors.push('Lebanese Civil War');
    }
    // Default elevated risk
    if (baseRisk === 20) {
      baseRisk = 55;
      factors.push('Regional tensions');
    }
  }

  // Iran-Iraq War (1980-1988)
  if (year >= 1980 && year <= 1988) {
    if (countryCode === 'IRN' || countryCode === 'IRQ') {
      baseRisk = 90;
      factors.push('Iran-Iraq War');
    }
  }

  // Gulf War (1990-1991)
  if (year >= 1990 && year <= 1991) {
    if (countryCode === 'IRQ') {
      baseRisk = 95;
      factors.push('Gulf War');
    }
    if (countryCode === 'KWT') {
      baseRisk = year === 1990 ? 95 : 80;
      factors.push('Iraqi invasion');
    }
  }

  // Yugoslav Wars (1991-2001)
  if (year >= 1991 && year <= 2001) {
    if (['SRB', 'HRV', 'BIH', 'SVN', 'MKD', 'MNE', 'XKX'].includes(countryCode)) {
      baseRisk = 85;
      factors.push('Yugoslav Wars');
      if (year === 1995 && countryCode === 'BIH') {
        baseRisk = 95;
        factors.push('Srebrenica massacre');
      }
      if (year === 1999 && (countryCode === 'SRB' || countryCode === 'XKX')) {
        baseRisk = 90;
        factors.push('Kosovo War / NATO intervention');
      }
    }
  }

  // Rwanda Genocide (1994)
  if (year === 1994 && countryCode === 'RWA') {
    baseRisk = 95;
    factors.push('Rwandan Genocide');
  }

  // Soviet-Afghan War (1979-1989)
  if (year >= 1979 && year <= 1989 && countryCode === 'AFG') {
    baseRisk = 90;
    factors.push('Soviet-Afghan War');
  }

  // War on Terror era (2001-2021)
  if (year >= 2001 && year <= 2021) {
    if (countryCode === 'AFG') {
      baseRisk = 85;
      factors.push('US-led war in Afghanistan');
    }
    if (countryCode === 'IRQ' && year >= 2003) {
      baseRisk = year <= 2011 ? 90 : 75;
      factors.push('Iraq War / Insurgency');
    }
  }

  // Syrian Civil War (2011-present)
  if (year >= 2011 && countryCode === 'SYR') {
    baseRisk = 95;
    factors.push('Syrian Civil War');
  }

  // ISIS (2014-2019)
  if (year >= 2014 && year <= 2019) {
    if (countryCode === 'IRQ' || countryCode === 'SYR') {
      baseRisk = Math.max(baseRisk, 90);
      if (!factors.includes('ISIS/Islamic State')) {
        factors.push('ISIS/Islamic State');
      }
    }
  }

  // Ukraine Conflict (2014-present)
  if (countryCode === 'UKR') {
    if (year >= 2014 && year < 2022) {
      baseRisk = 70;
      factors.push('Crimea annexation');
      factors.push('Donbas conflict');
    }
    if (year >= 2022) {
      baseRisk = 95;
      factors.push('Full-scale Russian invasion');
    }
  }

  // Russia sanctions era
  if (countryCode === 'RUS' && year >= 2022) {
    baseRisk = 75;
    factors.push('International sanctions');
    factors.push('Ukraine war aggressor');
  }

  // COVID-19 Pandemic (2020-2022)
  if (year >= 2020 && year <= 2022) {
    baseRisk = Math.max(baseRisk, 40);
    if (!factors.some(f => f.includes('COVID'))) {
      factors.push('COVID-19 pandemic');
    }
  }

  // Gaza 2023
  if (year >= 2023 && (countryCode === 'ISR' || countryCode === 'PSE')) {
    baseRisk = 95;
    factors.push('Israel-Hamas War');
  }

  return { baseRisk, factors };
}

// Get all countries with elevated risk for a given year
export function getHighRiskCountries(year: HistoricalYear): Map<string, HistoricalRiskData> {
  const highRisk = new Map<string, HistoricalRiskData>();
  const conflicts = getActiveConflicts(year);

  // Add countries involved in conflicts
  for (const conflict of conflicts) {
    for (const entity of conflict.involvedEntities) {
      if (!highRisk.has(entity)) {
        highRisk.set(entity, calculateHistoricalRisk(entity, year));
      }
    }
  }

  // Add known high-risk countries for era
  const knownHighRisk = [
    'USA', 'RUS', 'CHN', 'GBR', 'FRA', 'DEU', 'ISR', 'IRN', 'IRQ', 'SYR',
    'AFG', 'PAK', 'UKR', 'PRK', 'KOR', 'VNM', 'CUB', 'YEM', 'LBY', 'SDN'
  ];

  for (const code of knownHighRisk) {
    if (!highRisk.has(code)) {
      const risk = calculateHistoricalRisk(code, year);
      if (risk.baseRisk > 30) {
        highRisk.set(code, risk);
      }
    }
  }

  return highRisk;
}
