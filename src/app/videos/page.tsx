'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchTabs from '@/components/search/SearchTabs';
import VideoCard from '@/components/results/VideoCard';
import { VideoSkeleton } from '@/components/ui/Skeletons';
import type { VideoResult } from '@/types';

function VideosContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = useCallback(async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/videos?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <div className="flex-1">
      <SearchTabs />
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {loading ? (
          <VideoSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((result, index) => (
              <VideoCard key={result.id} result={result} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VideosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Suspense>
        <VideosPageInner />
      </Suspense>
    </div>
  );
}

function VideosPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  return (
    <>
      <Header showSearch query={query} />
      <Suspense fallback={<VideoSkeleton />}>
        <VideosContent />
      </Suspense>
      <Footer />
    </>
  );
}
