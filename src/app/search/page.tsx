'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchTabs from '@/components/search/SearchTabs';
import AIAnswer from '@/components/ai/AIAnswer';
import WebResult from '@/components/results/WebResult';
import Pagination from '@/components/ui/Pagination';
import { SearchSkeleton } from '@/components/ui/Skeletons';
import { useSearchStore } from '@/store/searchStore';
import type { SearchResult } from '@/types';
import { Clock, Filter, ChevronDown } from 'lucide-react';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTime, setSearchTime] = useState('0');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all');
  const { settings } = useSearchStore();

  const fetchResults = useCallback(async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${page}&count=${settings.resultsPerPage}`);
      const data = await res.json();
      setResults(data.results || []);
      setTotalResults(data.total || 0);
      setSearchTime(data.searchTime || '0');
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, page, settings.resultsPerPage]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const totalPages = Math.min(Math.ceil(totalResults / settings.resultsPerPage), 20);

  const handlePageChange = (newPage: number) => {
    router.push(`/search?q=${encodeURIComponent(query)}&page=${newPage}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!query) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Enter a search query to get started</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <SearchTabs />
      
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        {/* Search stats & filters */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            About <span className="font-medium">{totalResults.toLocaleString()}</span> results ({searchTime} seconds)
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            <Filter size={14} />
            Tools
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters bar */}
        {showFilters && (
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 flex-wrap">
            {[
              { value: 'all', label: 'Any time' },
              { value: 'day', label: 'Past 24 hours' },
              { value: 'week', label: 'Past week' },
              { value: 'month', label: 'Past month' },
              { value: 'year', label: 'Past year' },
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setTimeFilter(filter.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  timeFilter === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          {/* Main results column */}
          <div className="flex-1 min-w-0">
            {/* AI Answer */}
            {settings.showAIAnswers && page === 1 && (
              <AIAnswer query={query} />
            )}

            {/* Web Results */}
            {loading ? (
              <SearchSkeleton />
            ) : (
              <div className="space-y-6">
                {results.map((result, index) => (
                  <WebResult
                    key={result.id}
                    result={result}
                    index={index}
                    query={query}
                    openInNewTab={settings.openInNewTab}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && results.length > 0 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          {/* Sidebar - Knowledge Panel */}
          <aside className="hidden lg:block w-80 shrink-0">
            {!loading && results.length > 0 && (
              <div className="sticky top-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="w-full h-40 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${query.replace(/\s/g, '')}/320/160`}
                    alt=""
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 capitalize">{query}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                  {query} is a widely discussed topic with extensive resources available across the web. 
                  Explore the search results for comprehensive information from trusted sources.
                </p>
                <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Results found</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{totalResults.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Search time</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{searchTime}s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Safe search</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{settings.safeSearch}</span>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Suspense>
        <SearchPageInner />
      </Suspense>
    </div>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  return (
    <>
      <Header showSearch query={query} />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><SearchSkeleton /></div>}>
        <SearchResultsContent />
      </Suspense>
      <Footer />
    </>
  );
}
