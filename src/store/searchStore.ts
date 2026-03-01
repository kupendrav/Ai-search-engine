import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchHistory, UserSettings, ThemeMode } from '@/types';

interface SearchStore {
  // Search state
  query: string;
  isSearching: boolean;
  activeTab: string;
  searchHistory: SearchHistory[];
  
  // Settings
  settings: UserSettings;
  
  // Actions
  setQuery: (query: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  setActiveTab: (tab: string) => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setTheme: (theme: ThemeMode) => void;
}

const defaultSettings: UserSettings = {
  theme: 'system',
  resultsPerPage: 10,
  openInNewTab: false,
  showAIAnswers: true,
  safeSearch: 'moderate',
  region: 'us',
  language: 'en',
  searchHistory: true,
  instantAnswers: true,
};

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      query: '',
      isSearching: false,
      activeTab: 'all',
      searchHistory: [],
      settings: defaultSettings,

      setQuery: (query) => set({ query }),
      setIsSearching: (isSearching) => set({ isSearching }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      addToHistory: (query) => {
        if (!get().settings.searchHistory) return;
        const history = get().searchHistory;
        const existing = history.find(h => h.query.toLowerCase() === query.toLowerCase());
        if (existing) {
          set({
            searchHistory: [
              { ...existing, timestamp: Date.now() },
              ...history.filter(h => h.id !== existing.id),
            ].slice(0, 100),
          });
        } else {
          set({
            searchHistory: [
              { id: crypto.randomUUID(), query, timestamp: Date.now() },
              ...history,
            ].slice(0, 100),
          });
        }
      },
      
      clearHistory: () => set({ searchHistory: [] }),
      removeFromHistory: (id) =>
        set({ searchHistory: get().searchHistory.filter(h => h.id !== id) }),
      
      updateSettings: (newSettings) =>
        set({ settings: { ...get().settings, ...newSettings } }),
      
      setTheme: (theme) =>
        set({ settings: { ...get().settings, theme } }),
    }),
    {
      name: 'kvr-search-storage',
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        settings: state.settings,
      }),
    }
  )
);
