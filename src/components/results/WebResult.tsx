'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Clock, ChevronRight } from 'lucide-react';
import type { SearchResult } from '@/types';
import { formatDate, highlightText } from '@/lib/utils';

interface WebResultProps {
  result: SearchResult;
  index: number;
  query: string;
  openInNewTab?: boolean;
}

export default function WebResult({ result, index, query, openInNewTab = false }: WebResultProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className="group max-w-2xl"
    >
      {/* URL breadcrumb */}
      <div className="flex items-center gap-2 mb-1">
        {result.favicon && (
          <img
            src={result.favicon}
            alt=""
            className="w-4 h-4 rounded-sm"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
          {result.displayUrl}
        </span>
        {result.datePublished && (
          <>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={10} />
              {formatDate(result.datePublished)}
            </span>
          </>
        )}
      </div>

      {/* Title */}
      <a
        href={result.url}
        target={openInNewTab ? '_blank' : '_self'}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className="block"
      >
        <h3
          className="text-lg font-medium text-blue-700 dark:text-blue-400 group-hover:underline decoration-2 underline-offset-2 leading-snug"
          dangerouslySetInnerHTML={{ __html: highlightText(result.title, '') }}
        />
      </a>

      {/* Description */}
      <p
        className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2"
        dangerouslySetInnerHTML={{ __html: highlightText(result.description, query) }}
      />

      {/* Quick action links */}
      <div className="flex items-center gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-blue-500 flex items-center gap-1 transition-colors"
        >
          <ExternalLink size={10} /> Open in new tab
        </a>
        <button className="text-xs text-gray-400 hover:text-blue-500 flex items-center gap-1 transition-colors">
          <ChevronRight size={10} /> Cached
        </button>
      </div>
    </motion.article>
  );
}
