import { NewsCategory } from '@/types';

export interface CategoryConfig {
  id: NewsCategory;
  label: string;
  keywords: string[];
  color: string;
  icon: string;
}

export const NEWS_CATEGORIES: CategoryConfig[] = [
  {
    id: 'geopolitics',
    label: 'Geopolitics',
    keywords: ['diplomacy', 'sanctions', 'treaty', 'alliance', 'foreign policy', 'UN', 'NATO', 'summit', 'bilateral', 'geopolitical'],
    color: '#8b5cf6', // purple
    icon: '🌍'
  },
  {
    id: 'war',
    label: 'War & Conflict',
    keywords: ['war', 'military', 'conflict', 'troops', 'attack', 'bombing', 'casualties', 'invasion', 'defense', 'combat', 'missile', 'strike'],
    color: '#ef4444', // red
    icon: '⚔️'
  },
  {
    id: 'technology',
    label: 'Technology',
    keywords: ['tech', 'cyber', 'software', 'hardware', 'innovation', 'startup', 'silicon valley', 'computing', 'digital'],
    color: '#3b82f6', // blue
    icon: '💻'
  },
  {
    id: 'ai',
    label: 'AI',
    keywords: ['artificial intelligence', 'AI', 'machine learning', 'ChatGPT', 'OpenAI', 'Anthropic', 'LLM', 'neural network', 'deep learning', 'AGI'],
    color: '#06b6d4', // cyan
    icon: '🤖'
  },
  {
    id: 'economy',
    label: 'Economy',
    keywords: ['economy', 'market', 'stock', 'inflation', 'recession', 'GDP', 'trade', 'tariff', 'central bank', 'federal reserve', 'interest rate'],
    color: '#22c55e', // green
    icon: '📈'
  },
  {
    id: 'climate',
    label: 'Climate',
    keywords: ['climate', 'environment', 'carbon', 'emissions', 'renewable', 'fossil fuel', 'global warming', 'sustainability', 'green energy'],
    color: '#10b981', // emerald
    icon: '🌡️'
  },
  {
    id: 'health',
    label: 'Health',
    keywords: ['pandemic', 'virus', 'vaccine', 'WHO', 'outbreak', 'disease', 'health crisis', 'epidemic', 'quarantine'],
    color: '#f59e0b', // amber
    icon: '🏥'
  }
];

// Get category from article content/title
export function categorizeArticle(title: string, description: string | null): NewsCategory {
  const text = `${title} ${description || ''}`.toLowerCase();

  // Check each category's keywords
  for (const category of NEWS_CATEGORIES) {
    for (const keyword of category.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return category.id;
      }
    }
  }

  // Default to geopolitics if no match
  return 'geopolitics';
}

export function getCategoryConfig(categoryId: NewsCategory): CategoryConfig {
  return NEWS_CATEGORIES.find(c => c.id === categoryId) || NEWS_CATEGORIES[0];
}
