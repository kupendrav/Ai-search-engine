'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Settings, Moon, Sun, Monitor, Menu, X, History, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/components/search/SearchBar';
import { useSearchStore } from '@/store/searchStore';
import { cn } from '@/lib/utils';

interface HeaderProps {
  showSearch?: boolean;
  query?: string;
}

export default function Header({ showSearch = false, query = '' }: HeaderProps) {
  const router = useRouter();
  const { settings, setTheme, searchHistory, clearHistory, removeFromHistory } = useSearchStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  }, [settings.theme]);

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(settings.theme);
    setTheme(themes[(currentIndex + 1) % themes.length]);
  };

  const ThemeIcon = settings.theme === 'dark' ? Moon : settings.theme === 'light' ? Sun : Monitor;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-4 px-4 py-2.5 max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:block">
            KVR
          </span>
        </Link>

        {/* Search Bar */}
        {showSearch && (
          <div className="flex-1 max-w-2xl">
            <SearchBar
              variant="header"
              defaultValue={query}
              onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)}
            />
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1 ml-auto">
          {/* History Button */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors relative"
            title="Search History"
          >
            <History size={20} />
            {searchHistory.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {searchHistory.length > 9 ? '9+' : searchHistory.length}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={cycleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              title={`Theme: ${settings.theme}`}
            >
              <ThemeIcon size={20} />
            </button>
          )}

          {/* Settings */}
          <Link
            href="/settings"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            title="Settings"
          >
            <Settings size={20} />
          </Link>
        </div>
      </div>

      {/* History Dropdown */}
      <AnimatePresence>
        {showHistory && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowHistory(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute right-4 top-full mt-1 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Search History</h3>
                {searchHistory.length > 0 && (
                  <button
                    onClick={() => { clearHistory(); setShowHistory(false); }}
                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Clear all
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {searchHistory.length === 0 ? (
                  <p className="p-4 text-center text-gray-400 text-sm">No search history</p>
                ) : (
                  searchHistory.slice(0, 15).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 group"
                    >
                      <History size={14} className="text-gray-400 shrink-0" />
                      <button
                        onClick={() => {
                          setShowHistory(false);
                          router.push(`/search?q=${encodeURIComponent(item.query)}`);
                        }}
                        className="flex-1 text-left text-sm text-gray-700 dark:text-gray-300 truncate"
                      >
                        {item.query}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-all"
                      >
                        <X size={12} className="text-gray-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
