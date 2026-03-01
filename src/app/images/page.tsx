'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchTabs from '@/components/search/SearchTabs';
import ImageGrid from '@/components/results/ImageGrid';
import { ImageSkeleton } from '@/components/ui/Skeletons';
import type { ImageResult } from '@/types';

function ImagesContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/images?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="flex-1">
      <SearchTabs />
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {loading ? <ImageSkeleton /> : <ImageGrid results={results} />}
      </div>
    </div>
  );
}

export default function ImagesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Suspense>
        <ImagesPageInner />
      </Suspense>
    </div>
  );
}

function ImagesPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  return (
    <>
      <Header showSearch query={query} />
      <Suspense fallback={<ImageSkeleton />}>
        <ImagesContent />
      </Suspense>
      <Footer />
    </>
  );
}
