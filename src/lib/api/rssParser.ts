import { NewsArticle, NewsCategory } from '@/types';
import { categorizeArticle } from '@/data/categories';
import { RSS_SOURCES, RSSSource } from './rssSources';

interface RSSItem {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  creator?: string;
  author?: string;
}

export async function fetchFromRSS(source: RSSSource): Promise<NewsArticle[]> {
  try {
    const response = await fetch(source.url, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
        'User-Agent': 'SituationMonitor/1.0',
      },
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!response.ok) {
      console.warn(`RSS fetch failed for ${source.name}: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const items = parseRSSXML(xml);

    return items.slice(0, 15).map((item, index) => ({
      id: `rss-${source.id}-${Date.now()}-${index}`,
      title: item.title,
      description: item.description || null,
      source: source.name,
      sourceId: source.id,
      author: item.creator || item.author || null,
      url: item.link,
      imageUrl: null,
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      category: categorizeArticle(item.title, item.description || ''),
    }));
  } catch (error) {
    console.error(`RSS fetch error for ${source.name}:`, error);
    return [];
  }
}

export async function fetchFromAllRSS(options?: {
  category?: NewsCategory;
}): Promise<NewsArticle[]> {
  const { category } = options || {};

  // Filter sources by category if specified
  let sources = RSS_SOURCES;
  if (category) {
    const categoryMap: Record<NewsCategory, string[]> = {
      geopolitics: ['geopolitics', 'general'],
      war: ['war', 'geopolitics', 'general'],
      technology: ['technology', 'general'],
      ai: ['technology', 'general'],
      economy: ['economy', 'general'],
      climate: ['general'],
      health: ['general'],
    };
    const allowedCategories = categoryMap[category] || ['general'];
    sources = RSS_SOURCES.filter(s => allowedCategories.includes(s.category));
  }

  // Fetch from all sources in parallel
  const results = await Promise.allSettled(
    sources.map(source => fetchFromRSS(source))
  );

  const articles: NewsArticle[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    }
  }

  // Sort by date (newest first)
  return articles.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Simple XML parser for RSS (no external dependencies)
function parseRSSXML(xml: string): RSSItem[] {
  const items: RSSItem[] = [];

  // Match all <item> blocks
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link');
    const description = extractTag(itemXml, 'description');
    const pubDate = extractTag(itemXml, 'pubDate');
    const creator = extractTag(itemXml, 'dc:creator');
    const author = extractTag(itemXml, 'author');

    if (title && link) {
      items.push({
        title: decodeHTMLEntities(title),
        link: link.trim(),
        description: description ? cleanDescription(decodeHTMLEntities(description)) : undefined,
        pubDate,
        creator,
        author
      });
    }
  }

  return items;
}

function extractTag(xml: string, tag: string): string | undefined {
  // Handle CDATA sections
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  // Handle regular tags
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : undefined;
}

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ');
}

function cleanDescription(text: string): string {
  // Strip HTML tags and limit length
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300);
}
