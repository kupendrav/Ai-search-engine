'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Clock } from 'lucide-react';
import type { NewsResult } from '@/types';
import { formatDate } from '@/lib/utils';

interface NewsCardProps {
  result: NewsResult;
  index: number;
}

export default function NewsCard({ result, index }: NewsCardProps) {
  return (
    <motion.a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className="group flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
    >
      {/* Image */}
      {result.imageUrl && (
        <div className="shrink-0 w-32 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={result.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
            {result.source}
          </span>
          {result.category && (
            <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {result.category}
            </span>
          )}
        </div>
        <h3 className="font-medium text-gray-800 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
          {result.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {result.description}
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <Clock size={10} />
          <span>{formatDate(result.datePublished)}</span>
        </div>
      </div>
    </motion.a>
  );
}
