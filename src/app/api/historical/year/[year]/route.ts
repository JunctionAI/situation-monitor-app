import { NextRequest, NextResponse } from 'next/server';
import { YearSnapshot, HistoricalRiskZone } from '@/types/historical';
import { getEra } from '@/lib/historical/yearUtils';
import { getEventsForYear, getActiveConflicts } from '@/data/historical/contemporary-events';

export const dynamic = 'force-dynamic';

// Major powers by era (simplified)
const ERA_MAJOR_POWERS: Record<string, string[]> = {
  ANCIENT: ['Egypt', 'Assyria', 'Persia', 'Greece'],
  CLASSICAL: ['Rome', 'Han China', 'Parthia', 'Maurya'],
  MEDIEVAL: ['Byzantine', 'Caliphate', 'Tang China', 'Mongol Empire'],
  EARLY_MODERN: ['Spain', 'Ottoman', 'Ming China', 'Mughal'],
  MODERN: ['GBR', 'FRA', 'DEU', 'USA', 'RUS', 'JPN'],
  CONTEMPORARY: ['USA', 'RUS', 'CHN', 'GBR', 'FRA'],
};

// Generate historical risk zones based on active conflicts
function generateRiskZones(year: number): HistoricalRiskZone[] {
  const conflicts = getActiveConflicts(year);
  const zones: HistoricalRiskZone[] = [];

  for (const conflict of conflicts) {
    if (conflict.coordinates) {
      zones.push({
        id: `risk-${conflict.id}`,
        name: conflict.title,
        coordinates: conflict.coordinates,
        radius: conflict.significance === 'PIVOTAL' ? 500 : 300,
        riskLevel: conflict.significance === 'PIVOTAL' ? 90 : 70,
        type: conflict.type === 'WAR' ? 'conflict' : 'tension',
        description: conflict.description,
      });
    }
  }

  // Add some static historical tension zones based on year
  if (year >= 1947 && year <= 1991) {
    // Cold War Berlin
    zones.push({
      id: 'cold-war-berlin',
      name: 'Berlin - Cold War Flashpoint',
      coordinates: [13.405, 52.520],
      radius: 100,
      riskLevel: year >= 1961 && year <= 1989 ? 85 : 60,
      type: 'tension',
      description: 'Cold War division between East and West',
    });
  }

  if (year >= 1950 && year <= 1953) {
    // Korean War
    zones.push({
      id: 'korean-war-zone',
      name: 'Korean Peninsula',
      coordinates: [127.024, 37.532],
      radius: 400,
      riskLevel: 95,
      type: 'conflict',
      description: 'Active conflict zone during Korean War',
    });
  }

  if (year >= 1955 && year <= 1975) {
    // Vietnam War zone
    zones.push({
      id: 'vietnam-war-zone',
      name: 'Vietnam War Zone',
      coordinates: [106.660, 16.0],
      radius: 500,
      riskLevel: year >= 1964 ? 90 : 70,
      type: 'conflict',
      description: 'Indochina conflict zone',
    });
  }

  if (year >= 2011) {
    // Syrian Civil War
    zones.push({
      id: 'syria-conflict',
      name: 'Syrian Civil War',
      coordinates: [36.278, 33.513],
      radius: 400,
      riskLevel: year <= 2020 ? 95 : 75,
      type: 'conflict',
      description: 'Syrian Civil War and regional instability',
    });
  }

  if (year >= 2022) {
    // Ukraine War
    zones.push({
      id: 'ukraine-war',
      name: 'Russia-Ukraine War',
      coordinates: [30.523, 50.450],
      radius: 600,
      riskLevel: 95,
      type: 'conflict',
      description: 'Full-scale Russian invasion of Ukraine',
    });
  }

  return zones;
}

// Generate year summary
function generateYearSummary(year: number): string {
  const events = getEventsForYear(year);

  if (year >= 1945 && year <= 1950) {
    return 'Post-World War II reconstruction. Formation of United Nations and NATO. Beginning of Cold War tensions between USA and USSR.';
  }
  if (year >= 1950 && year <= 1953) {
    return 'Korean War dominates global affairs. Cold War intensifies with nuclear arms race beginning.';
  }
  if (year >= 1961 && year <= 1962) {
    return 'Height of Cold War tensions. Berlin Wall constructed. Cuban Missile Crisis brings world to brink of nuclear war.';
  }
  if (year >= 1989 && year <= 1991) {
    return 'End of Cold War. Berlin Wall falls. Soviet Union collapses. New world order emerges.';
  }
  if (year >= 2001 && year <= 2003) {
    return 'War on Terror following 9/11 attacks. US invades Afghanistan and Iraq.';
  }
  if (year >= 2020 && year <= 2021) {
    return 'COVID-19 pandemic transforms global society. Economic disruption and political tensions worldwide.';
  }
  if (year >= 2022) {
    return 'Russia invades Ukraine, triggering largest European conflict since WWII. Global energy and food crises.';
  }

  if (events.length > 0) {
    return `Key events: ${events.map(e => e.title).join(', ')}.`;
  }

  return 'Period of relative stability in global affairs.';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year: yearParam } = await params;
    const year = parseInt(yearParam, 10);

    if (isNaN(year) || year < -1000 || year > new Date().getFullYear()) {
      return NextResponse.json(
        { error: 'Invalid year. Must be between 1000 BCE (-1000) and present.' },
        { status: 400 }
      );
    }

    const era = getEra(year);
    const events = getEventsForYear(year);
    const risks = generateRiskZones(year);
    const majorPowers = ERA_MAJOR_POWERS[era] || [];

    const snapshot: YearSnapshot = {
      year,
      era,
      entities: [], // Will be populated with actual entity data later
      events,
      risks,
      majorPowers,
      summary: generateYearSummary(year),
    };

    return NextResponse.json(snapshot, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Historical year API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical data' },
      { status: 500 }
    );
  }
}
