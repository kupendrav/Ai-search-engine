'use client';

import { motion } from 'framer-motion';
import { Play, Clock, Eye, ExternalLink } from 'lucide-react';
import type { VideoResult } from '@/types';
import { formatDate } from '@/lib/utils';

interface VideoCardProps {
  result: VideoResult;
  index: number;
}

export default function VideoCard({ result, index }: VideoCardProps) {
  return (
    <motion.a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 aspect-video">
        <img
          src={result.thumbnailUrl}
          alt={result.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-mono">
          {result.duration}
        </div>
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
          <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all shadow-lg">
            <Play size={20} className="text-white ml-0.5" fill="white" />
          </div>
        </div>
        {/* Source badge */}
        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1">
          <div className="w-3 h-3 bg-red-600 rounded-sm flex items-center justify-center">
            <Play size={6} fill="white" className="text-white" />
          </div>
          {result.source}
        </div>
      </div>
      <div className="mt-2.5 px-0.5">
        <h3 className="font-medium text-gray-800 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
          {result.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result.channel}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
          <span className="flex items-center gap-1"><Eye size={10} /> {result.views}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Clock size={10} /> {formatDate(result.datePublished)}</span>
        </div>
      </div>
    </motion.a>
  );
}
