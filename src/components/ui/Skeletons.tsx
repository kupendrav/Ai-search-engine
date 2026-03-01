'use client';

import { motion } from 'framer-motion';

export function SearchSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.08 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="space-y-1">
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function ImageSkeleton() {
  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 space-y-3">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="break-inside-avoid rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{ height: `${150 + Math.random() * 150}px` }}
        />
      ))}
    </div>
  );
}

export function VideoSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-video rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function NewsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 rounded-xl">
          <div className="shrink-0 w-32 h-24 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
