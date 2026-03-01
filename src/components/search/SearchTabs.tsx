'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Image, Video, Newspaper, Map, BookOpen, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'all', label: 'All', icon: Search, path: '/search' },
  { id: 'images', label: 'Images', icon: Image, path: '/images' },
  { id: 'videos', label: 'Videos', icon: Video, path: '/videos' },
  { id: 'news', label: 'News', icon: Newspaper, path: '/news' },
];

export default function SearchTabs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = searchParams.get('q') || '';

  const activeTab = TABS.find(t => pathname.startsWith(t.path))?.id || 'all';

  return (
    <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 px-4 overflow-x-auto scrollbar-hide">
      {TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = tab.id === activeTab;
        return (
          <Link
            key={tab.id}
            href={`${tab.path}?q=${encodeURIComponent(query)}`}
            className={cn(
              'relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
              isActive
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            <Icon size={16} />
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
