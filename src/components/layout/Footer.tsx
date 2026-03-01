'use client';

import Link from 'next/link';
import { Heart, Github, Shield, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">K</span>
            </div>
            <span>KVR Search Engine</span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span>Privacy-first search</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/settings" className="hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
              <Shield size={14} /> Privacy
            </Link>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
              <Globe size={14} /> About
            </a>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="flex items-center gap-1">
              Built with <Heart size={12} className="text-red-500" fill="currentColor" /> by KVR
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
