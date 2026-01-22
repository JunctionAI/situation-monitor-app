import { NewsArticle, NewsAPIResponse, NewsCategory } from '@/types';
import { categorizeArticle } from '@/data/categories';

const NEWS_API_BASE = 'https://newsapi.org/v2';

interface FetchNewsOptions {
  category?: string;
  country?: string;
  query?: string;
  pageSize?: number;
}

export async function fetchFromNewsAPI(options: FetchNewsOptions = {}): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY;

  if (!apiKey) {
    console.warn('NewsAPI key not configured, using mock data');
    return getMockNews();
  }

  const { category, country, query, pageSize = 50 } = options;

  try {
    // Use top-headlines for category/country filtering
    // Use everything endpoint for keyword search
    const endpoint = query ? 'everything' : 'top-headlines';

    const params = new URLSearchParams({
      apiKey,
      pageSize: String(pageSize),
    });

    if (endpoint === 'top-headlines') {
      // Top headlines requires country or category
      params.set('country', country || 'us');
      if (category) {
        params.set('category', mapCategoryToNewsAPI(category));
      }
    } else {
      // Everything endpoint for search
      params.set('q', query || 'world news');
      params.set('sortBy', 'publishedAt');
      params.set('language', 'en');
    }

    const response = await fetch(`${NEWS_API_BASE}/${endpoint}?${params}`, {
      headers: {
        'User-Agent': 'SituationMonitor/1.0'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data: NewsAPIResponse = await response.json();

    if (data.status !== 'ok') {
      throw new Error('NewsAPI returned error status');
    }

    return normalizeArticles(data.articles);
  } catch (error) {
    console.error('Failed to fetch from NewsAPI:', error);
    return getMockNews();
  }
}

function mapCategoryToNewsAPI(category: string): string {
  // NewsAPI categories: business, entertainment, general, health, science, sports, technology
  const mapping: Record<string, string> = {
    'geopolitics': 'general',
    'war': 'general',
    'technology': 'technology',
    'ai': 'technology',
    'economy': 'business',
    'climate': 'science',
    'health': 'health'
  };
  return mapping[category] || 'general';
}

function normalizeArticles(articles: NewsAPIResponse['articles']): NewsArticle[] {
  return articles
    .filter(article => article.title && article.title !== '[Removed]')
    .map((article, index) => ({
      id: `${article.source.id || 'unknown'}-${Date.now()}-${index}`,
      title: article.title,
      description: article.description,
      source: article.source.name,
      sourceId: article.source.id || 'unknown',
      author: article.author,
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: article.publishedAt,
      category: categorizeArticle(article.title, article.description)
    }));
}

// Mock news data for development/demo
function getMockNews(): NewsArticle[] {
  const now = new Date();
  return [
    {
      id: 'mock-1',
      title: 'Ukraine Forces Report Gains in Eastern Front Operations',
      description: 'Ukrainian military forces have made tactical advances in the Donetsk region, according to the latest battlefield assessments.',
      source: 'Reuters',
      sourceId: 'reuters',
      author: 'John Smith',
      url: '#',
      imageUrl: null,
      publishedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      category: 'war',
      relatedCountries: ['UKR', 'RUS']
    },
    {
      id: 'mock-2',
      title: 'UN Security Council Convenes Emergency Session on Gaza Crisis',
      description: 'The United Nations Security Council held an emergency meeting to discuss the humanitarian situation in Gaza.',
      source: 'AP News',
      sourceId: 'associated-press',
      author: 'Jane Doe',
      url: '#',
      imageUrl: null,
      publishedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      category: 'geopolitics',
      relatedCountries: ['PSE', 'ISR']
    },
    {
      id: 'mock-3',
      title: 'OpenAI Announces Major Breakthrough in Reasoning Capabilities',
      description: 'The AI company revealed new model improvements that significantly enhance logical reasoning and problem-solving.',
      source: 'TechCrunch',
      sourceId: 'techcrunch',
      author: 'Tech Reporter',
      url: '#',
      imageUrl: null,
      publishedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      category: 'ai'
    },
    {
      id: 'mock-4',
      title: 'Sudan Conflict Displaces Another 500,000 People',
      description: 'The ongoing civil war between military factions has created one of the worlds worst humanitarian crises.',
      source: 'BBC News',
      sourceId: 'bbc-news',
      author: 'Africa Correspondent',
      url: '#',
      imageUrl: null,
      publishedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      category: 'war',
      relatedCountries: ['SDN']
    },
    {
      id: 'mock-5',
      title: 'Federal Reserve Signals Potential Rate Cut in Coming Months',
      description: 'The central bank indicated it may begin reducing interest rates as inflation shows signs of cooling.',
      source: 'Wall Street Journal',
      sourceId: 'wsj',
      author: 'Finance Editor',
      url: '#',
      imageUrl: null,
      publishedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      category: 'economy'
    },
    {
      id: 'mock-6',
      title: 'Taiwan Reports Increased Chinese Military Activity Near Strait',
      description: 'The Taiwanese defense ministry detected multiple aircraft and naval vessels in the region over the past 24 hours.',
      source: 'Reuters',
      sourceId: 'reuters',
      author: 'Asia Bureau',
      url: '#',
      imageUrl: null,
      publishedAt: new Date(now.getTime() - 7 * 60 * 60 * 1000).toISOString(),
      category: 'geopolitics',
      relatedCountries: ['TWN', 'CHN']
    },
    {
      id: 'mock-7',
      title: 'Anthropic Releases Claude 4 with Enhanced Safety Features',
      description: 'The AI safety company unveiled its latest model with improved capabilities and stronger safety guardrails.',
      source: 'Wired',
      sourceId: 'wired',
      author: 'AI Reporter',
      url: '#',
      imageUrl: null,
      publishedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      category: 'ai'
    },
    {
      id: 'mock-8',
      title: 'Venezuela Opposition Leader Calls for International Support',
      description: 'Political tensions continue as opposition figures appeal to the international community amid ongoing crisis.',
      source: 'AP News',
      sourceId: 'associated-press',
      author: 'Latin America Desk',
      url: '#',
      imageUrl: null,
      publishedAt: new Date(now.getTime() - 9 * 60 * 60 * 1000).toISOString(),
      category: 'geopolitics',
      relatedCountries: ['VEN']
    },
    {
      id: 'mock-9',
      title: 'New Cybersecurity Threat Targets Critical Infrastructure',
      description: 'Security researchers have identified a sophisticated attack campaign aimed at power grids and water systems.',
      source: 'The Verge',
      sourceId: 'the-verge',
      author: 'Security Team',
      url: '#',
      imageUrl: null,
      publishedAt: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString(),
      category: 'technology'
    },
    {
      id: 'mock-10',
      title: 'Yemen Peace Talks Show Signs of Progress',
      description: 'Negotiators report cautious optimism as warring parties continue discussions in Oman.',
      source: 'Al Jazeera',
      sourceId: 'al-jazeera-english',
      author: 'Middle East Bureau',
      url: '#',
      imageUrl: null,
      publishedAt: new Date(now.getTime() - 11 * 60 * 60 * 1000).toISOString(),
      category: 'war',
      relatedCountries: ['YEM']
    }
  ];
}

// Export for fetching multiple categories
export async function fetchAllCategories(): Promise<NewsArticle[]> {
  const queries = [
    'war conflict military',
    'geopolitics diplomacy international relations',
    'artificial intelligence AI technology',
    'economy markets finance'
  ];

  const results = await Promise.allSettled(
    queries.map(q => fetchFromNewsAPI({ query: q, pageSize: 15 }))
  );

  const articles: NewsArticle[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    }
  }

  // Deduplicate by title
  const seen = new Set<string>();
  return articles.filter(article => {
    if (seen.has(article.title)) return false;
    seen.add(article.title);
    return true;
  }).sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
