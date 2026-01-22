import { NextRequest, NextResponse } from 'next/server';
import { newsCache } from '@/lib/cache/newsCache';
import { fetchAggregatedNews } from '@/lib/api/newsAggregator';
import { NewsArticle, NewsCategory } from '@/types';

export const dynamic = 'force-dynamic';

interface CachedData {
  articles: NewsArticle[];
  sources: string[];
  timestamp: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as NewsCategory | null;
    const query = searchParams.get('q');
    const refresh = searchParams.get('refresh') === 'true';

    // Build cache key
    const cacheKey = `news:${category || 'all'}:${query || 'default'}`;

    // Check cache unless refresh is requested
    if (!refresh) {
      const cached = newsCache.get<CachedData>(cacheKey);
      if (cached) {
        const cacheAge = Math.floor((Date.now() - cached.timestamp) / 1000);
        return NextResponse.json({
          articles: cached.articles,
          totalResults: cached.articles.length,
          lastUpdated: new Date(cached.timestamp).toISOString(),
          cached: true,
          cacheAge,
          sources: cached.sources,
        }, {
          headers: {
            'X-Cache': 'HIT',
            'X-Cache-Age': String(cacheAge),
            'Cache-Control': 'public, max-age=60'
          }
        });
      }
    }

    // Fetch from multiple sources
    const { articles, sources, errors, fetchTime } = await fetchAggregatedNews({
      category: category || undefined,
      query: query || undefined,
      maxArticles: 50,
    });

    // Log any errors for monitoring
    if (errors.length > 0) {
      console.warn('News fetch partial errors:', errors);
    }

    // Cache for 90 seconds
    newsCache.set(cacheKey, {
      articles,
      sources,
      timestamp: Date.now(),
    }, 90 * 1000);

    return NextResponse.json({
      articles,
      totalResults: articles.length,
      lastUpdated: new Date().toISOString(),
      cached: false,
      sources,
      fetchTime,
      errors: errors.length > 0 ? errors : undefined,
    }, {
      headers: {
        'X-Cache': 'MISS',
        'X-Sources': sources.join(','),
        'X-Fetch-Time': String(fetchTime),
        'Cache-Control': 'public, max-age=60'
      }
    });
  } catch (error) {
    console.error('News API error:', error);

    // Fallback: return stale cache if available
    const staleCache = newsCache.get<CachedData>('news:all:default');
    if (staleCache) {
      return NextResponse.json({
        articles: staleCache.articles,
        totalResults: staleCache.articles.length,
        lastUpdated: new Date(staleCache.timestamp).toISOString(),
        cached: true,
        stale: true,
        sources: staleCache.sources,
        error: 'Using stale cache due to fetch error'
      }, {
        status: 200,
        headers: {
          'X-Cache': 'STALE',
          'Cache-Control': 'public, max-age=30'
        }
      });
    }

    return NextResponse.json(
      { error: 'Failed to fetch news', articles: [], totalResults: 0 },
      { status: 500 }
    );
  }
}
