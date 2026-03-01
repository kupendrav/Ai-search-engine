'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Mic, Camera, Clock, TrendingUp,
  ArrowRight, Calculator, Sparkles
} from 'lucide-react';
import { useSearchStore } from '@/store/searchStore';
import { cn } from '@/lib/utils';
import type { SearchSuggestion } from '@/types';

interface SearchBarProps {
  variant?: 'home' | 'header';
  autoFocus?: boolean;
  defaultValue?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ variant = 'home', autoFocus = false, defaultValue = '', onSearch }: SearchBarProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToHistory, searchHistory } = useSearchStore();

  const fetchSuggestions = useCallback(async (query: string) => {
    try {
      const res = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim()) {
        fetchSuggestions(inputValue);
      } else {
        // Show recent searches when empty
        const historyItems: SearchSuggestion[] = searchHistory.slice(0, 5).map(h => ({
          text: h.query,
          type: 'history' as const,
        }));
        setSuggestions(historyItems);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [inputValue, fetchSuggestions, searchHistory]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = (query: string) => {
    if (!query.trim()) return;
    addToHistory(query.trim());
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(query.trim());
    } else {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const query = selectedIndex >= 0 ? suggestions[selectedIndex].text : inputValue;
      performSearch(query);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser');
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      if (event.results[0].isFinal) {
        performSearch(transcript);
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'history': return <Clock size={16} className="text-gray-400" />;
      case 'calculation': return <Calculator size={16} className="text-green-500" />;
      case 'instant': return <Sparkles size={16} className="text-purple-500" />;
      default: return <Search size={16} className="text-gray-400" />;
    }
  };

  const isHome = variant === 'home';

  return (
    <div ref={containerRef} className={cn('relative w-full', isHome ? 'max-w-2xl' : 'max-w-xl')}>
      <div
        className={cn(
          'flex items-center gap-2 rounded-full border transition-all duration-200',
          'bg-white dark:bg-gray-800',
          showSuggestions && suggestions.length > 0
            ? 'rounded-b-none rounded-t-2xl border-gray-300 dark:border-gray-600 shadow-lg'
            : 'border-gray-200 dark:border-gray-700 hover:shadow-md focus-within:shadow-lg focus-within:border-blue-400 dark:focus-within:border-blue-500',
          isHome ? 'px-5 py-3.5' : 'px-4 py-2.5'
        )}
      >
        <Search size={isHome ? 20 : 18} className="text-blue-500 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setSelectedIndex(-1);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search the web with KVR..."
          autoFocus={autoFocus}
          className={cn(
            'flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400',
            isHome ? 'text-lg' : 'text-base'
          )}
          autoComplete="off"
          spellCheck={false}
        />
        <AnimatePresence>
          {inputValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => {
                setInputValue('');
                inputRef.current?.focus();
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={18} className="text-gray-400" />
            </motion.button>
          )}
        </AnimatePresence>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-600" />
        <button
          onClick={startVoiceSearch}
          className={cn(
            'p-1.5 rounded-full transition-all',
            isListening
              ? 'bg-red-100 dark:bg-red-900/30 text-red-500 animate-pulse'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500'
          )}
          title="Voice search"
        >
          <Mic size={18} />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute w-full bg-white dark:bg-gray-800 border border-t-0 border-gray-300 dark:border-gray-600 rounded-b-2xl shadow-lg z-50 overflow-hidden"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.text}-${index}`}
                onClick={() => {
                  setInputValue(suggestion.text);
                  performSearch(suggestion.text);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  'flex items-center gap-3 w-full px-5 py-2.5 text-left transition-colors',
                  index === selectedIndex
                    ? 'bg-gray-50 dark:bg-gray-700/50'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                )}
              >
                {getSuggestionIcon(suggestion.type)}
                <span className="flex-1 text-gray-700 dark:text-gray-200 truncate">
                  {suggestion.type === 'calculation' ? (
                    <span className="font-mono text-green-600 dark:text-green-400">{suggestion.text}</span>
                  ) : (
                    suggestion.text
                  )}
                </span>
                {suggestion.type === 'history' && (
                  <span className="text-xs text-gray-400">Recent</span>
                )}
                <ArrowRight size={14} className="text-gray-300 dark:text-gray-600" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Search Overlay */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
            onClick={() => setIsListening(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mx-auto animate-pulse">
                  <Mic size={32} className="text-white" />
                </div>
                <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-red-300 mx-auto animate-ping" />
              </div>
              <p className="text-xl font-medium text-gray-800 dark:text-white mb-2">Listening...</p>
              <p className="text-gray-500">Speak now to search</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
