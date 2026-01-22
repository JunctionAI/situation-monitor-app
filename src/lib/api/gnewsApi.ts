import { NewsArticle, NewsCategory } from '@/types';
import { categorizeArticle } from '@/data/categories';

const GNEWS_BASE = 'https://gnews.io/api/v4';

interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

export async function fetchFromGNews(options: {
  query?: string;
  category?: NewsCategory;
  maxResults?: number;
}): Promise<NewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    // GNews not configured - return empty (will use other sources)
    return [];
  }

  const { query, category, maxResults = 20 } = options;

  try {
    const params = new URLSearchParams({
      apikey: apiKey,
      lang: 'en',
      max: String(maxResults),
    });

    // GNews supports: search (with q) or top-headlines (with topic)
    let endpoint = 'top-headlines';

    if (query) {
      endpoint = 'search';
      params.set('q', query);
    } else if (category) {
      // GNews topics: breaking-news, world, nation, business, technology,
      // entertainment, sports, science, health
      const topicMap: Record<NewsCategory, string> = {
        geopolitics: 'world',
        war: 'world',
        technology: 'technology',
        ai: 'technology',
        economy: 'business',
        climate: 'science',
        health: 'health',
      };
      params.set('topic', topicMap[category] || 'world');
    } else {
      params.set('topic', 'world');
    }

    const response = await fetch(`${GNEWS_BASE}/${endpoint}?${params}`, {
      headers: {
        'User-Agent': 'SituationMonitor/1.0'
      },
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!response.ok) {
      if (response.status === 403) {
        console.warn('GNews rate limit reached');
      }
      return [];
    }

    const data: GNewsResponse = await response.json();

    return data.articles.map((article, index) => ({
      id: `gnews-${Date.now()}-${index}`,
      title: article.title,
      description: article.description,
      source: article.source.name,
      sourceId: 'gnews-' + article.source.name.toLowerCase().replace(/\s/g, '-'),
      author: null,
      url: article.url,
      imageUrl: article.image,
      publishedAt: article.publishedAt,
      category: category || categorizeArticle(article.title, article.description),
    }));
  } catch (error) {
    console.error('GNews fetch error:', error);
    return [];
  }
}
