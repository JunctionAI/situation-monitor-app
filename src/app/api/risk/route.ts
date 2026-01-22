import { NextResponse } from 'next/server';
import { newsCache } from '@/lib/cache/newsCache';
import { RISK_ZONES, getRiskConfig, scoreToTier } from '@/data/riskZones';
import { RiskScore } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cacheKey = 'risk:all';

    // Check cache (risk data changes less frequently)
    const cached = newsCache.get<Record<string, RiskScore>>(cacheKey);
    if (cached) {
      return NextResponse.json({
        risks: cached,
        lastUpdated: new Date().toISOString(),
        cached: true
      }, {
        headers: { 'X-Cache': 'HIT' }
      });
    }

    // Generate risk scores for all predefined zones
    const risks: Record<string, RiskScore> = {};

    for (const [code, config] of Object.entries(RISK_ZONES)) {
      const tier = scoreToTier(config.baseRisk);
      risks[code] = {
        countryCode: code,
        countryName: config.countryName,
        tier,
        score: config.baseRisk,
        factors: config.factors.activeConflict
          ? [{ type: 'CONFLICT', severity: 80, description: 'Active military conflict' }]
          : [],
        lastUpdated: new Date().toISOString(),
        trend: 'STABLE',
        summary: config.notes
      };
    }

    // Cache for 15 minutes
    newsCache.set(cacheKey, risks, 15 * 60 * 1000);

    return NextResponse.json({
      risks,
      lastUpdated: new Date().toISOString(),
      cached: false
    }, {
      headers: { 'X-Cache': 'MISS' }
    });
  } catch (error) {
    console.error('Risk API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch risk data', risks: {} },
      { status: 500 }
    );
  }
}
