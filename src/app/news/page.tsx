'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchTabs from '@/components/search/SearchTabs';
import NewsCard from '@/components/results/NewsCard';
import { NewsSkeleton } from '@/components/ui/Skeletons';
import type { NewsResult } from '@/types';

function NewsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<NewsResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = useCallback(async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <div className="flex-1">
      <SearchTabs />
      <div className="max-w-3xl mx-auto px-4 py-4">
        {loading ? (
          <NewsSkeleton />
        ) : (
          <div className="space-y-1">
            {results.map((result, index) => (
              <NewsCard key={result.id} result={result} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Suspense>
        <NewsPageInner />
      </Suspense>
    </div>
  );
}

function NewsPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  return (
    <>
      <Header showSearch query={query} />
      <Suspense fallback={<NewsSkeleton />}>
        <NewsContent />
      </Suspense>
      <Footer />
    </>
  );
}
