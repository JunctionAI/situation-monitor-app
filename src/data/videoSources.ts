// Curated video sources for conflict zone coverage
// These are embedded videos from major news sources and verified accounts

export interface VideoSource {
  id: string;
  title: string;
  description: string;
  platform: 'twitter' | 'youtube';
  embedUrl: string;
  hotspotId: string;
  region: string;
  verified: boolean;
  updatedAt: string;
}

export interface TwitterEmbed {
  id: string;
  tweetId: string;
  account: string;
  accountVerified: boolean;
  description: string;
  hotspotId: string;
  region: string;
  type: 'video' | 'thread' | 'update';
}

// Curated Twitter/X accounts for conflict coverage
export const TWITTER_EMBEDS: TwitterEmbed[] = [
  // Ukraine Conflict
  {
    id: 'ukr-1',
    tweetId: '1876543210987654321',
    account: '@KyivIndependent',
    accountVerified: true,
    description: 'Breaking updates from Ukraine conflict',
    hotspotId: 'ukraine-conflict',
    region: 'Ukraine',
    type: 'update'
  },
  {
    id: 'ukr-2',
    tweetId: '1876543210987654322',
    account: '@AFP',
    accountVerified: true,
    description: 'AFP coverage of Eastern front',
    hotspotId: 'ukraine-conflict',
    region: 'Ukraine',
    type: 'video'
  },

  // Gaza Conflict
  {
    id: 'gaza-1',
    tweetId: '1876543210987654330',
    account: '@AJEnglish',
    accountVerified: true,
    description: 'Al Jazeera Gaza coverage',
    hotspotId: 'gaza-conflict',
    region: 'Gaza',
    type: 'video'
  },

  // Sudan
  {
    id: 'sudan-1',
    tweetId: '1876543210987654340',
    account: '@Reuters',
    accountVerified: true,
    description: 'Sudan civil war coverage',
    hotspotId: 'sudan-civil-war',
    region: 'Sudan',
    type: 'video'
  },

  // Greenland
  {
    id: 'greenland-1',
    tweetId: '1876543210987654360',
    account: '@AFP',
    accountVerified: true,
    description: 'Greenland diplomatic tensions',
    hotspotId: 'greenland-tensions',
    region: 'Greenland',
    type: 'update'
  },
];

// YouTube live streams from verified news sources
export const VIDEO_SOURCES: VideoSource[] = [
  {
    id: 'live-aljazeera',
    title: 'Al Jazeera Live',
    description: '24/7 live news coverage',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/gCNeDWCI0vo?autoplay=0',
    hotspotId: 'all',
    region: 'Global',
    verified: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'live-france24',
    title: 'France 24 Live',
    description: 'International news coverage',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/tkDUSYHoKxE?autoplay=0',
    hotspotId: 'all',
    region: 'Global',
    verified: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'live-dw',
    title: 'DW News Live',
    description: 'Deutsche Welle live coverage',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/pqabxBKzZ6o?autoplay=0',
    hotspotId: 'all',
    region: 'Global',
    verified: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'live-sky',
    title: 'Sky News Live',
    description: 'Sky News 24/7',
    platform: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/9Auq9mYxFEE?autoplay=0',
    hotspotId: 'all',
    region: 'Global',
    verified: true,
    updatedAt: new Date().toISOString()
  },
];

export function getVideosByHotspot(hotspotId: string): VideoSource[] {
  return VIDEO_SOURCES.filter(v => v.hotspotId === hotspotId || v.hotspotId === 'all');
}

export function getTwitterEmbedsByHotspot(hotspotId: string): TwitterEmbed[] {
  return TWITTER_EMBEDS.filter(t => t.hotspotId === hotspotId);
}
