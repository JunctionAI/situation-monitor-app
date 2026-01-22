import Anthropic from '@anthropic-ai/sdk';
import { NewsArticle, RiskScore, RiskTier } from '@/types';
import { getRiskConfig, scoreToTier } from '@/data/riskZones';

interface SentimentResult {
  score: number; // -1 (very negative) to +1 (very positive)
  confidence: number; // 0-1
  riskIndicators: string[];
  summary: string;
}

let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }
  return anthropicClient;
}

export async function analyzeCountrySentiment(
  countryCode: string,
  countryName: string,
  articles: NewsArticle[]
): Promise<SentimentResult | null> {
  const client = getAnthropicClient();

  if (!client || articles.length === 0) {
    return null;
  }

  const headlines = articles.slice(0, 10).map(a => `- ${a.title}`).join('\n');

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Analyze the following news headlines about ${countryName} (${countryCode}) for geopolitical risk indicators.

Headlines:
${headlines}

Provide a JSON response with:
- sentiment_score: float from -1 (very negative/dangerous) to +1 (positive/stable)
- confidence: float 0-1
- risk_indicators: array of specific concerning phrases or events (max 3)
- summary: one sentence situation summary (max 100 chars)

Respond with only valid JSON, no markdown.`
      }]
    });

    const content = response.content[0];
    if (content.type !== 'text') return null;

    const parsed = JSON.parse(content.text);
    return {
      score: Math.max(-1, Math.min(1, parsed.sentiment_score)),
      confidence: Math.max(0, Math.min(1, parsed.confidence)),
      riskIndicators: parsed.risk_indicators || [],
      summary: parsed.summary || ''
    };
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return null;
  }
}

export async function calculateDynamicRisk(
  countryCode: string,
  countryName: string,
  recentNews: NewsArticle[]
): Promise<RiskScore> {
  // Get base risk from predefined zones
  const baseConfig = getRiskConfig(countryCode);

  // Try to get AI sentiment analysis
  const sentiment = await analyzeCountrySentiment(countryCode, countryName, recentNews);

  // Calculate final score
  let finalScore = baseConfig.baseRisk;
  let summary = baseConfig.notes;
  let trend: 'IMPROVING' | 'STABLE' | 'DETERIORATING' = 'STABLE';

  if (sentiment) {
    // Convert sentiment (-1 to +1) to risk adjustment (-20 to +20)
    const sentimentAdjustment = Math.round((1 - sentiment.score) * 20 - 10);
    finalScore = Math.max(0, Math.min(100, baseConfig.baseRisk + sentimentAdjustment));

    // Determine trend based on sentiment
    if (sentiment.score < -0.3) {
      trend = 'DETERIORATING';
    } else if (sentiment.score > 0.3) {
      trend = 'IMPROVING';
    }

    // Use AI summary if available
    if (sentiment.summary) {
      summary = sentiment.summary;
    }
  }

  const tier = scoreToTier(finalScore);

  return {
    countryCode,
    countryName,
    tier,
    score: finalScore,
    factors: baseConfig.factors.activeConflict
      ? [{ type: 'CONFLICT', severity: 80, description: 'Active military conflict' }]
      : [],
    lastUpdated: new Date().toISOString(),
    trend,
    summary
  };
}

// Batch analyze multiple countries
export async function batchAnalyzeRisks(
  countries: Array<{ code: string; name: string }>,
  newsMap: Map<string, NewsArticle[]>
): Promise<Map<string, RiskScore>> {
  const results = new Map<string, RiskScore>();

  // Process in parallel with rate limiting
  const batchSize = 5;
  for (let i = 0; i < countries.length; i += batchSize) {
    const batch = countries.slice(i, i + batchSize);
    const promises = batch.map(({ code, name }) =>
      calculateDynamicRisk(code, name, newsMap.get(code) || [])
    );

    const batchResults = await Promise.all(promises);
    batchResults.forEach(result => {
      results.set(result.countryCode, result);
    });

    // Small delay between batches to avoid rate limits
    if (i + batchSize < countries.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}
