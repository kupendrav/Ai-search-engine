import type { SearchResult, ImageResult, VideoResult, NewsResult, SearchSuggestion } from '@/types';

// Simulated search data for demo - in production, connect to Brave Search API / SearXNG
const MOCK_RESULTS: Record<string, SearchResult[]> = {};
const TRENDING_TOPICS = [
  'Artificial Intelligence breakthroughs 2026',
  'SpaceX Mars mission update',
  'Quantum computing latest news',
  'Climate change solutions technology',
  'Web development trends 2026',
  'Cybersecurity best practices',
  'Electric vehicles comparison',
  'Machine learning tutorials',
  'Blockchain technology applications',
  'Remote work productivity tools',
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function generateSearchResults(query: string, page: number = 1, count: number = 10): SearchResult[] {
  if (MOCK_RESULTS[query]) return MOCK_RESULTS[query];

  const domains = [
    'wikipedia.org', 'github.com', 'stackoverflow.com', 'medium.com',
    'dev.to', 'docs.microsoft.com', 'developer.mozilla.org', 'arxiv.org',
    'techcrunch.com', 'theverge.com', 'wired.com', 'arstechnica.com',
    'bbc.com', 'reuters.com', 'nytimes.com', 'nature.com',
  ];

  const results: SearchResult[] = [];
  const startIndex = (page - 1) * count;

  for (let i = 0; i < count; i++) {
    const domain = domains[(startIndex + i) % domains.length];
    const index = startIndex + i + 1;
    results.push({
      id: generateId(),
      title: `${query} - ${getContextTitle(query, index)} | ${capitalize(domain.split('.')[0])}`,
      url: `https://${domain}/${query.toLowerCase().replace(/\s+/g, '-')}-${index}`,
      displayUrl: `${domain} › ${query.toLowerCase().replace(/\s+/g, '-')}`,
      description: generateDescription(query, index),
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      datePublished: getRandomDate(),
      siteName: capitalize(domain.split('.')[0]),
    });
  }

  return results;
}

export function generateImageResults(query: string): ImageResult[] {
  const results: ImageResult[] = [];
  for (let i = 0; i < 20; i++) {
    const w = 200 + Math.floor(Math.random() * 400);
    const h = 200 + Math.floor(Math.random() * 300);
    results.push({
      id: generateId(),
      title: `${query} - Image ${i + 1}`,
      url: `https://picsum.photos/seed/${query.replace(/\s/g, '')}${i}/${w}/${h}`,
      thumbnailUrl: `https://picsum.photos/seed/${query.replace(/\s/g, '')}${i}/300/200`,
      sourceUrl: `https://example.com/images/${query.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      width: w,
      height: h,
      source: ['Unsplash', 'Pexels', 'Pixabay', 'Flickr', 'DeviantArt'][i % 5],
    });
  }
  return results;
}

export function generateVideoResults(query: string): VideoResult[] {
  const channels = ['TechExplained', 'AI Academy', 'CodeMaster', 'ScienceDaily', 'Digital Trends', 'Fireship', 'Traversy Media', 'The Coding Train'];
  const results: VideoResult[] = [];
  for (let i = 0; i < 12; i++) {
    results.push({
      id: generateId(),
      title: `${getVideoTitle(query, i)}`,
      url: `https://youtube.com/watch?v=${generateId()}`,
      thumbnailUrl: `https://picsum.photos/seed/vid${query.replace(/\s/g, '')}${i}/480/270`,
      duration: `${Math.floor(Math.random() * 30 + 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      channel: channels[i % channels.length],
      views: `${Math.floor(Math.random() * 900 + 100)}K views`,
      datePublished: getRandomDate(),
      source: 'YouTube',
    });
  }
  return results;
}

export function generateNewsResults(query: string): NewsResult[] {
  const sources = ['TechCrunch', 'The Verge', 'Wired', 'BBC News', 'Reuters', 'Ars Technica', 'MIT Technology Review', 'Bloomberg'];
  const results: NewsResult[] = [];
  for (let i = 0; i < 10; i++) {
    results.push({
      id: generateId(),
      title: `${getNewsTitle(query, i)}`,
      url: `https://example.com/news/${query.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      description: generateDescription(query, i),
      source: sources[i % sources.length],
      imageUrl: `https://picsum.photos/seed/news${query.replace(/\s/g, '')}${i}/400/225`,
      datePublished: getRecentDate(i),
      category: ['Technology', 'Science', 'Business', 'World'][i % 4],
    });
  }
  return results;
}

export function generateSuggestions(query: string): SearchSuggestion[] {
  if (!query.trim()) {
    return TRENDING_TOPICS.slice(0, 8).map(t => ({
      text: t,
      type: 'suggestion' as const,
    }));
  }

  const suffixes = [
    '', ' tutorial', ' explained', ' vs', ' examples',
    ' best practices', ' 2026', ' how to', ' guide', ' alternatives',
  ];

  // Check for math expressions
  const mathResult = evaluateMath(query);
  const suggestions: SearchSuggestion[] = [];

  if (mathResult !== null) {
    suggestions.push({
      text: `${query} = ${mathResult}`,
      type: 'calculation',
    });
  }

  suffixes.forEach(suffix => {
    if (suffix === '' || !query.toLowerCase().endsWith(suffix.trim())) {
      suggestions.push({
        text: `${query}${suffix}`,
        type: 'suggestion',
      });
    }
  });

  return suggestions.slice(0, 8);
}

export function generateAIAnswer(query: string): string {
  return `## About "${query}"

Based on comprehensive analysis from multiple sources, here's what you need to know:

**Overview**
${query} is a topic that has gained significant attention recently. It encompasses several key areas that are important to understand for anyone looking to learn more.

**Key Points**
1. **Fundamentals**: The core concepts behind ${query} are well-established and continue to evolve with new research and development.
2. **Recent Developments**: In 2026, there have been several notable advancements in this area, including new tools, frameworks, and methodologies.
3. **Applications**: ${query} has practical applications across multiple domains including technology, science, business, and education.
4. **Future Outlook**: Experts predict continued growth and innovation in this space, with emerging trends pointing toward more accessible and powerful solutions.

**Important Considerations**
- Always verify information from multiple authoritative sources
- Stay updated with the latest developments as this field evolves rapidly
- Consider both the benefits and potential challenges when exploring ${query}

> *This answer was synthesized from multiple web sources to provide a comprehensive overview. Click on the sources below for more detailed information.*`;
}

// Helper functions
function getContextTitle(query: string, index: number): string {
  const templates = [
    'Comprehensive Guide and Overview',
    'Everything You Need to Know',
    'Complete Tutorial and Examples',
    'In-Depth Analysis and Review',
    'Latest Updates and News',
    'Best Practices and Tips',
    'Expert Guide for Beginners',
    'Advanced Concepts Explained',
    'Comparison and Alternatives',
    'Step-by-Step Instructions',
    'Research Papers and Studies',
    'Community Discussion and Insights',
    'Official Documentation',
    'Case Studies and Applications',
    'History and Evolution',
    'Tools and Resources',
  ];
  return templates[(index - 1) % templates.length];
}

function getVideoTitle(query: string, index: number): string {
  const templates = [
    `${query} Explained in 10 Minutes`,
    `Complete ${query} Tutorial for Beginners`,
    `${query}: What You Need to Know in 2026`,
    `The Future of ${query} - Deep Dive`,
    `${query} vs Alternatives - Which is Best?`,
    `How ${query} Actually Works`,
    `${query} Crash Course - Full Guide`,
    `Top 10 Things About ${query}`,
    `${query} - Expert Interview & Analysis`,
    `Why ${query} Matters More Than Ever`,
    `Building with ${query} - Live Demo`,
    `${query} Masterclass - Advanced Techniques`,
  ];
  return templates[index % templates.length];
}

function getNewsTitle(query: string, index: number): string {
  const templates = [
    `Breaking: Major Developments in ${query}`,
    `${query} Industry Sees Record Growth in 2026`,
    `New Study Reveals Surprising Facts About ${query}`,
    `${query}: What Experts Are Saying`,
    `Government Announces New Regulations for ${query}`,
    `${query} Revolution: How It's Changing Everything`,
    `Investors Pour Billions Into ${query} Startups`,
    `${query} Breakthrough Could Transform Industry`,
    `The Global Impact of ${query} in Modern Society`,
    `${query}: A Complete Analysis of Current Trends`,
  ];
  return templates[index % templates.length];
}

function generateDescription(query: string, index: number): string {
  const templates = [
    `Discover comprehensive information about ${query}. This detailed resource covers all essential aspects, from fundamentals to advanced topics, helping you understand the key concepts and latest developments.`,
    `Learn everything about ${query} with this in-depth guide. Explore real-world examples, best practices, and expert insights that will enhance your understanding and practical knowledge.`,
    `${query} has become an increasingly important topic. This resource provides up-to-date information, analysis, and practical guidance for both beginners and experienced practitioners.`,
    `Explore the latest trends and developments in ${query}. Our comprehensive coverage includes expert opinions, research findings, and practical applications across various domains.`,
    `A thorough examination of ${query} covering key aspects, historical context, current state, and future predictions. Essential reading for anyone interested in this subject area.`,
  ];
  return templates[(index - 1) % templates.length];
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getRandomDate(): string {
  const days = Math.floor(Math.random() * 365);
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function getRecentDate(index: number): string {
  const date = new Date();
  date.setHours(date.getHours() - (index * 3 + Math.floor(Math.random() * 12)));
  return date.toISOString();
}

function evaluateMath(expr: string): number | null {
  try {
    const cleaned = expr.replace(/[^0-9+\-*/().%\s^]/g, '');
    if (cleaned.length < 2) return null;
    if (!/[+\-*/^%]/.test(cleaned)) return null;
    const result = Function('"use strict"; return (' + cleaned.replace('^', '**') + ')')();
    if (typeof result === 'number' && isFinite(result)) return result;
    return null;
  } catch {
    return null;
  }
}
