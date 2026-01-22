export interface RSSSource {
  id: string;
  name: string;
  url: string;
  category: 'geopolitics' | 'war' | 'economy' | 'general' | 'technology';
  reliability: 'high' | 'medium';
}

export const RSS_SOURCES: RSSSource[] = [
  // === WIRE SERVICES (Most Unbiased) ===
  // Reuters
  {
    id: 'reuters-world',
    name: 'Reuters',
    url: 'https://www.reutersagency.com/feed/?best-topics=world&post_type=best',
    category: 'general',
    reliability: 'high'
  },
  // AFP (Agence France-Presse)
  {
    id: 'afp-world',
    name: 'AFP',
    url: 'https://www.france24.com/en/rss',
    category: 'general',
    reliability: 'high'
  },

  // === PUBLIC BROADCASTERS (High Credibility) ===
  // BBC World News
  {
    id: 'bbc-world',
    name: 'BBC World',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'general',
    reliability: 'high'
  },
  {
    id: 'bbc-europe',
    name: 'BBC Europe',
    url: 'https://feeds.bbci.co.uk/news/world/europe/rss.xml',
    category: 'geopolitics',
    reliability: 'high'
  },
  {
    id: 'bbc-middle-east',
    name: 'BBC Middle East',
    url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
    category: 'war',
    reliability: 'high'
  },
  {
    id: 'bbc-asia',
    name: 'BBC Asia',
    url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml',
    category: 'geopolitics',
    reliability: 'high'
  },
  {
    id: 'bbc-africa',
    name: 'BBC Africa',
    url: 'https://feeds.bbci.co.uk/news/world/africa/rss.xml',
    category: 'geopolitics',
    reliability: 'high'
  },
  // Deutsche Welle (Germany)
  {
    id: 'dw-world',
    name: 'DW News',
    url: 'https://rss.dw.com/rdf/rss-en-world',
    category: 'general',
    reliability: 'high'
  },
  // NPR
  {
    id: 'npr-world',
    name: 'NPR World',
    url: 'https://feeds.npr.org/1004/rss.xml',
    category: 'general',
    reliability: 'high'
  },
  // ABC Australia
  {
    id: 'abc-australia',
    name: 'ABC News',
    url: 'https://www.abc.net.au/news/feed/2942460/rss.xml',
    category: 'general',
    reliability: 'high'
  },

  // === INTERNATIONAL PERSPECTIVES ===
  // Al Jazeera (Middle East perspective)
  {
    id: 'aljazeera',
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    category: 'general',
    reliability: 'high'
  },
  // SCMP (Asia perspective)
  {
    id: 'scmp-asia',
    name: 'SCMP Asia',
    url: 'https://www.scmp.com/rss/91/feed',
    category: 'geopolitics',
    reliability: 'high'
  },
  // The Hindu (India perspective)
  {
    id: 'hindu-world',
    name: 'The Hindu',
    url: 'https://www.thehindu.com/news/international/feeder/default.rss',
    category: 'general',
    reliability: 'high'
  },

  // === QUALITY NEWSPAPERS ===
  // The Guardian
  {
    id: 'guardian-world',
    name: 'The Guardian',
    url: 'https://www.theguardian.com/world/rss',
    category: 'general',
    reliability: 'high'
  },
  // NY Times
  {
    id: 'nyt-world',
    name: 'NY Times',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    category: 'general',
    reliability: 'high'
  },
  // Washington Post
  {
    id: 'wapo-world',
    name: 'Washington Post',
    url: 'https://feeds.washingtonpost.com/rss/world',
    category: 'general',
    reliability: 'high'
  },

  // === BUSINESS/ECONOMY ===
  {
    id: 'bbc-business',
    name: 'BBC Business',
    url: 'https://feeds.bbci.co.uk/news/business/rss.xml',
    category: 'economy',
    reliability: 'high'
  },
  {
    id: 'ft-world',
    name: 'Financial Times',
    url: 'https://www.ft.com/world?format=rss',
    category: 'economy',
    reliability: 'high'
  },

  // === DEFENSE/SECURITY ===
  {
    id: 'defense-news',
    name: 'Defense News',
    url: 'https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml',
    category: 'war',
    reliability: 'high'
  },
];
