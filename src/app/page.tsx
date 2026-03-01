'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Sparkles, TrendingUp, Clock, Zap, Shield, Globe, 
  Search, Image, Video, Newspaper, Settings, Moon, Sun, Monitor,
  Code, Brain, Rocket, BookOpen, Cpu, Atom
} from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import { useSearchStore } from '@/store/searchStore';
import { cn } from '@/lib/utils';

const TRENDING = [
  { text: 'Artificial Intelligence 2026', icon: Brain },
  { text: 'SpaceX Starship Launch', icon: Rocket },
  { text: 'Quantum Computing', icon: Atom },
  { text: 'Web Development React', icon: Code },
  { text: 'Machine Learning Tutorial', icon: Cpu },
  { text: 'Best Programming Languages', icon: BookOpen },
];

const QUICK_LINKS = [
  { label: 'Images', icon: Image, path: '/images', color: 'from-green-400 to-emerald-500' },
  { label: 'Videos', icon: Video, path: '/videos', color: 'from-red-400 to-rose-500' },
  { label: 'News', icon: Newspaper, path: '/news', color: 'from-orange-400 to-amber-500' },
  { label: 'Settings', icon: Settings, path: '/settings', color: 'from-gray-400 to-gray-500' },
];

export default function Home() {
  const router = useRouter();
  const { settings, setTheme, searchHistory } = useSearchStore();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  }, [settings.theme, mounted]);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const idx = themes.indexOf(settings.theme);
    setTheme(themes[(idx + 1) % 3]);
  };

  const ThemeIcon = settings.theme === 'dark' ? Moon : settings.theme === 'light' ? Sun : Monitor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col relative overflow-hidden">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-pink-200/20 dark:bg-pink-900/10 rounded-full blur-3xl" />
      </div>

      {/* Top bar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Shield size={14} />
            <span>Privacy-first search</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={cycleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
              title={`Theme: ${settings.theme}`}
            >
              <ThemeIcon size={18} />
            </button>
          )}
          <button
            onClick={() => router.push('/settings')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 -mt-16">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-500/20 dark:shadow-blue-500/10"
          >
            <span className="text-white font-bold text-3xl tracking-tight">K</span>
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            KVR
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {greeting()}. What would you like to know?
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-2xl mb-6"
        >
          <SearchBar variant="home" autoFocus />
        </motion.div>

        {/* Quick Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex items-center gap-3 mb-10"
        >
          {QUICK_LINKS.map(link => {
            const Icon = link.icon;
            return (
              <button
                key={link.label}
                onClick={() => router.push(link.path)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all group"
              >
                <div className={cn('w-5 h-5 rounded bg-gradient-to-br flex items-center justify-center', link.color)}>
                  <Icon size={12} className="text-white" />
                </div>
                <span className="group-hover:text-gray-800 dark:group-hover:text-white transition-colors">{link.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Trending & Recent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="w-full max-w-2xl"
        >
          {/* Recent Searches */}
          {searchHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock size={12} /> Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 6).map(item => (
                  <button
                    key={item.id}
                    onClick={() => router.push(`/search?q=${encodeURIComponent(item.query)}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                  >
                    <Clock size={12} className="text-gray-300" />
                    <span className="truncate max-w-[150px]">{item.query}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp size={12} /> Trending Now
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TRENDING.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.text}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    onClick={() => router.push(`/search?q=${encodeURIComponent(item.text)}`)}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50 text-left hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                      <Icon size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white truncate transition-colors">
                      {item.text}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-xs text-gray-400 dark:text-gray-600">
        <div className="flex items-center justify-center gap-3">
          <span>KVR Search Engine v1.0</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Shield size={10} /> Privacy-first
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles size={10} /> AI-powered
          </span>
        </div>
      </footer>
    </div>
  );
}
