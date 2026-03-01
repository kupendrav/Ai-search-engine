export interface SearchResult {
  id: string;
  title: string;
  url: string;
  displayUrl: string;
  description: string;
  favicon?: string;
  datePublished?: string;
  siteName?: string;
}

export interface ImageResult {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  sourceUrl: string;
  width: number;
  height: number;
  source: string;
}

export interface VideoResult {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  duration: string;
  channel: string;
  views: string;
  datePublished: string;
  source: string;
}

export interface NewsResult {
  id: string;
  title: string;
  url: string;
  description: string;
  source: string;
  imageUrl?: string;
  datePublished: string;
  category?: string;
}

export interface AIAnswer {
  content: string;
  sources: { title: string; url: string }[];
  followUpQuestions: string[];
  isStreaming: boolean;
}

export interface SearchSuggestion {
  text: string;
  type: 'suggestion' | 'instant' | 'calculation' | 'history';
  icon?: string;
}

export interface SearchFilters {
  timeRange: 'all' | 'day' | 'week' | 'month' | 'year';
  region: string;
  safeSearch: 'off' | 'moderate' | 'strict';
  language: string;
}

export interface SearchTab {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: number;
  resultCount?: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserSettings {
  theme: ThemeMode;
  resultsPerPage: number;
  openInNewTab: boolean;
  showAIAnswers: boolean;
  safeSearch: 'off' | 'moderate' | 'strict';
  region: string;
  language: string;
  searchHistory: boolean;
  instantAnswers: boolean;
}
