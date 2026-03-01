'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Sun, Moon, Monitor, Shield, Globe, Eye, 
  Hash, ExternalLink, Sparkles, Zap, Trash2, History,
  Check
} from 'lucide-react';
import { useSearchStore } from '@/store/searchStore';
import type { ThemeMode } from '@/types';

export default function SettingsPage() {
  const { settings, updateSettings, setTheme, searchHistory, clearHistory } = useSearchStore();
  const [saved, setSaved] = useState(false);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const themes: { value: ThemeMode; label: string; icon: typeof Sun; desc: string }[] = [
    { value: 'light', label: 'Light', icon: Sun, desc: 'Always use light theme' },
    { value: 'dark', label: 'Dark', icon: Moon, desc: 'Always use dark theme' },
    { value: 'system', label: 'System', icon: Monitor, desc: 'Follow system preference' },
  ];

  const regions = [
    { value: 'us', label: '🇺🇸 United States' },
    { value: 'uk', label: '🇬🇧 United Kingdom' },
    { value: 'in', label: '🇮🇳 India' },
    { value: 'de', label: '🇩🇪 Germany' },
    { value: 'fr', label: '🇫🇷 France' },
    { value: 'jp', label: '🇯🇵 Japan' },
    { value: 'au', label: '🇦🇺 Australia' },
    { value: 'ca', label: '🇨🇦 Canada' },
    { value: 'br', label: '🇧🇷 Brazil' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">K</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">KVR Settings</h1>
          </div>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="ml-auto text-sm text-green-500 flex items-center gap-1"
            >
              <Check size={14} /> Saved
            </motion.span>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Appearance */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Sun size={18} /> Appearance
            </h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-3">
              {themes.map(theme => {
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.value}
                    onClick={() => { setTheme(theme.value); showSaved(); }}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      settings.theme === theme.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={24} className={`mx-auto mb-2 ${settings.theme === theme.value ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${settings.theme === theme.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {theme.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{theme.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Search Preferences */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Zap size={18} /> Search Preferences
            </h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {/* Results per page */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Hash size={14} /> Results per page
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Number of results to show</p>
              </div>
              <select
                value={settings.resultsPerPage}
                onChange={(e) => { updateSettings({ resultsPerPage: parseInt(e.target.value) }); showSaved(); }}
                className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[5, 10, 15, 20, 25, 50].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Open in new tab */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <ExternalLink size={14} /> Open links in new tab
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Open search results in a new browser tab</p>
              </div>
              <button
                onClick={() => { updateSettings({ openInNewTab: !settings.openInNewTab }); showSaved(); }}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.openInNewTab ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.openInNewTab ? 'translate-x-5.5 left-[1px]' : 'left-0.5'
                }`} style={{ transform: settings.openInNewTab ? 'translateX(22px)' : 'translateX(0)' }} />
              </button>
            </div>

            {/* AI Answers */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Sparkles size={14} /> AI-powered answers
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Show AI-generated summaries for searches</p>
              </div>
              <button
                onClick={() => { updateSettings({ showAIAnswers: !settings.showAIAnswers }); showSaved(); }}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.showAIAnswers ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                  style={{ transform: settings.showAIAnswers ? 'translateX(22px)' : 'translateX(0)', left: '2px' }} />
              </button>
            </div>

            {/* Instant answers */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Zap size={14} /> Instant answers
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Show quick calculations and conversions</p>
              </div>
              <button
                onClick={() => { updateSettings({ instantAnswers: !settings.instantAnswers }); showSaved(); }}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.instantAnswers ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                  style={{ transform: settings.instantAnswers ? 'translateX(22px)' : 'translateX(0)', left: '2px' }} />
              </button>
            </div>
          </div>
        </section>

        {/* Privacy & Safety */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Shield size={18} /> Privacy & Safety
            </h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {/* Safe Search */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Eye size={14} /> Safe Search
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Filter explicit content from results</p>
              </div>
              <select
                value={settings.safeSearch}
                onChange={(e) => { updateSettings({ safeSearch: e.target.value as 'off' | 'moderate' | 'strict' }); showSaved(); }}
                className="bg-gray-100 dark:bg-gray-700 border-0 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="off">Off</option>
                <option value="moderate">Moderate</option>
                <option value="strict">Strict</option>
              </select>
            </div>

            {/* Search History */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <History size={14} /> Save search history
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Remember your past searches locally</p>
              </div>
              <button
                onClick={() => { updateSettings({ searchHistory: !settings.searchHistory }); showSaved(); }}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.searchHistory ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                  style={{ transform: settings.searchHistory ? 'translateX(22px)' : 'translateX(0)', left: '2px' }} />
              </button>
            </div>

            {/* Clear History */}
            {searchHistory.length > 0 && (
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Trash2 size={14} /> Clear search history
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{searchHistory.length} searches stored locally</p>
                </div>
                <button
                  onClick={() => { clearHistory(); showSaved(); }}
                  className="px-3 py-1.5 text-sm font-medium text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Region */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Globe size={18} /> Region & Language
            </h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {regions.map(region => (
                <button
                  key={region.value}
                  onClick={() => { updateSettings({ region: region.value }); showSaved(); }}
                  className={`px-3 py-2 rounded-lg text-sm text-left transition-all ${
                    settings.region === region.value
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 text-blue-700 dark:text-blue-400 font-medium'
                      : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {region.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-white">KVR Search Engine</h3>
          <p className="text-sm text-gray-500 mt-1">Version 1.0.0</p>
          <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto">
            A privacy-first search engine with AI-powered answers, inspired by Perplexity and Brave Search. 
            Your data stays on your device.
          </p>
        </section>
      </main>
    </div>
  );
}
