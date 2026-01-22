import { NewsArticle, NewsCategory } from '@/types';
import { fetchFromNewsAPI } from './newsApi';
import { fetchFromGNews } from './gnewsApi';
import { fetchFromAllRSS } from './rssParser';

export interface AggregatorOptions {
  category?: NewsCategory;
  query?: string;
  maxArticles?: number;
}

export interface AggregatedNewsResult {
  articles: NewsArticle[];
  sources: string[];
  errors: string[];
  fetchTime: number;
}

// Track source health for smart rotation
interface SourceHealth {
  lastSuccess: number;
  errorCount: number;
  lastUsed: number;
}

const sourceHealth: Map<string, SourceHealth> = new Map();

export async function fetchAggregatedNews(
  options: AggregatorOptions = {}
): Promise<AggregatedNewsResult> {
  const { category, query, maxArticles = 50 } = options;
  const startTime = Date.now();

  const articles: NewsArticle[] = [];
  const usedSources: string[] = [];
  const errors: string[] = [];

  // Define fetch operations
  const fetchOperations = [
    {
      id: 'rss',
      name: 'RSS Feeds',
      fn: () => fetchFromAllRSS({ category }),
      priority: 1, // Always try RSS first (no rate limits)
    },
    {
      id: 'newsapi',
      name: 'NewsAPI',
      fn: () => fetchFromNewsAPI({ category, query, pageSize: 30 }),
      priority: 2,
    },
    {
      id: 'gnews',
      name: 'GNews',
      fn: () => fetchFromGNews({ category, query, maxResults: 20 }),
      priority: 3,
    },
  ];

  // Sort by health and priority
  const sortedOps = fetchOperations.sort((a, b) => {
    const healthA = sourceHealth.get(a.id);
    const healthB = sourceHealth.get(b.id);

    // Deprioritize sources with recent errors
    if (healthA?.errorCount && healthA.errorCount >= 3) return 1;
    if (healthB?.errorCount && healthB.errorCount >= 3) return -1;

    return a.priority - b.priority;
  });

  // Fetch from all sources in parallel with timeout
  const results = await Promise.allSettled(
    sortedOps.map(async (op) => {
      try {
        const result = await Promise.race([
          op.fn(),
          new Promise<NewsArticle[]>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 10000)
          ),
        ]);
        updateSourceHealth(op.id, true);
        return { id: op.id, name: op.name, articles: result };
      } catch (error) {
        updateSourceHealth(op.id, false);
        throw { id: op.id, name: op.name, error: String(error) };
      }
    })
  );

  // Process results
  for (const result of results) {
    if (result.status === 'fulfilled') {
      articles.push(...result.value.articles);
      if (result.value.articles.length > 0) {
        usedSources.push(result.value.name);
      }
    } else {
      const reason = result.reason as { id: string; name: string; error: string };
      errors.push(`${reason.name}: ${reason.error}`);
    }
  }

  // Deduplicate articles
  const deduplicated = deduplicateArticles(articles);

  // Sort by date (newest first) and limit
  const sorted = deduplicated
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, maxArticles);

  return {
    articles: sorted,
    sources: usedSources,
    errors,
    fetchTime: Date.now() - startTime,
  };
}

function updateSourceHealth(id: string, success: boolean) {
  const current = sourceHealth.get(id) || {
    lastSuccess: 0,
    errorCount: 0,
    lastUsed: 0,
  };

  sourceHealth.set(id, {
    lastSuccess: success ? Date.now() : current.lastSuccess,
    errorCount: success ? 0 : current.errorCount + 1,
    lastUsed: Date.now(),
  });
}

// Deduplication using title similarity
function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Map<string, NewsArticle>();

  for (const article of articles) {
    const normalizedTitle = normalizeTitle(article.title);

    // Skip if exact match exists
    if (seen.has(normalizedTitle)) {
      continue;
    }

    // Check for fuzzy match (similar titles)
    let isDuplicate = false;
    for (const [existingTitle, existingArticle] of seen) {
      if (similarity(normalizedTitle, existingTitle) > 0.75) {
        // Keep the one with more info (has description, image, etc.)
        const existingScore = scoreArticle(existingArticle);
        const newScore = scoreArticle(article);
        if (newScore > existingScore) {
          seen.delete(existingTitle);
          seen.set(normalizedTitle, article);
        }
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      seen.set(normalizedTitle, article);
    }
  }

  return Array.from(seen.values());
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Jaccard similarity on words
function similarity(a: string, b: string): number {
  const wordsA = new Set(a.split(' ').filter(w => w.length > 2));
  const wordsB = new Set(b.split(' ').filter(w => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);

  return intersection.size / union.size;
}

// Score article by completeness (for dedup preference)
function scoreArticle(article: NewsArticle): number {
  let score = 0;
  if (article.description) score += 2;
  if (article.imageUrl) score += 1;
  if (article.author) score += 1;
  // Prefer newer articles
  score += Math.max(0, 5 - (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60));
  return score;
}

// Get health status for debugging/display
export function getSourceHealth(): Record<string, SourceHealth> {
  const health: Record<string, SourceHealth> = {};
  for (const [id, data] of sourceHealth) {
    health[id] = data;
  }
  return health;
}
