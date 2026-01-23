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

    return items.slice(0, 15).map((item, index) => {
      // Parse the date properly, keeping the original if valid
      let publishedAt: string;
      if (item.pubDate) {
        try {
          const parsed = new Date(item.pubDate);
          publishedAt = !isNaN(parsed.getTime()) ? parsed.toISOString() : item.pubDate;
        } catch {
          publishedAt = item.pubDate;
        }
      } else {
        // No date found - use current time minus a random offset to avoid all showing "1 minute ago"
        const randomOffset = Math.floor(Math.random() * 3600000); // up to 1 hour
        publishedAt = new Date(Date.now() - randomOffset).toISOString();
      }

      return {
        id: `rss-${source.id}-${Date.now()}-${index}`,
        title: item.title,
        description: item.description || null,
        source: source.name,
        sourceId: source.id,
        author: item.creator || item.author || null,
        url: item.link,
        imageUrl: null,
        publishedAt,
        category: categorizeArticle(item.title, item.description || ''),
      };
    });
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

  // Match all <item> blocks (RSS) or <entry> blocks (Atom)
  const itemRegex = /<(?:item|entry)[^>]*>([\s\S]*?)<\/(?:item|entry)>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = extractTag(itemXml, 'title');
    const link = extractLink(itemXml);
    const description = extractTag(itemXml, 'description') ||
                        extractTag(itemXml, 'summary') ||
                        extractTag(itemXml, 'content');
    // Try multiple date formats
    const pubDate = extractTag(itemXml, 'pubDate') ||
                    extractTag(itemXml, 'published') ||
                    extractTag(itemXml, 'updated') ||
                    extractTag(itemXml, 'dc:date') ||
                    extractTag(itemXml, 'date');
    const creator = extractTag(itemXml, 'dc:creator');
    const author = extractTag(itemXml, 'author') || extractTag(itemXml, 'name');

    if (title && link) {
      items.push({
        title: decodeHTMLEntities(title),
        link: link.trim(),
        description: description ? cleanDescription(decodeHTMLEntities(description)) : undefined,
        pubDate: pubDate ? normalizeDate(pubDate) : undefined,
        creator,
        author
      });
    }
  }

  return items;
}

// Extract link - handles both RSS <link> and Atom <link href="...">
function extractLink(xml: string): string | undefined {
  // Try Atom style first: <link href="..." />
  const atomLinkMatch = xml.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i);
  if (atomLinkMatch) return atomLinkMatch[1];

  // Try RSS style: <link>url</link>
  return extractTag(xml, 'link');
}

// Normalize various date formats to ISO string
function normalizeDate(dateStr: string): string {
  try {
    // Try parsing as-is first
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }

    // Handle some common non-standard formats
    // e.g., "22 Jan 2026 14:30:00"
    const parts = dateStr.match(/(\d{1,2})\s+(\w{3})\s+(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
    if (parts) {
      const [, day, month, year, hour, min, sec] = parts;
      const monthMap: Record<string, number> = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
      };
      const monthNum = monthMap[month.toLowerCase()];
      if (monthNum !== undefined) {
        return new Date(+year, monthNum, +day, +hour, +min, +sec).toISOString();
      }
    }

    return dateStr; // Return original if can't parse
  } catch {
    return dateStr;
  }
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
