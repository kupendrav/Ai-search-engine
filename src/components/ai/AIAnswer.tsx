'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ExternalLink, ChevronDown, ChevronUp, RefreshCw, Copy, Check, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AIAnswerProps {
  query: string;
}

interface AIData {
  answer: string;
  sources: { title: string; url: string; favicon?: string; siteName?: string }[];
  followUpQuestions: string[];
}

export default function AIAnswer({ query }: AIAnswerProps) {
  const router = useRouter();
  const [data, setData] = useState<AIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setDisplayedText('');
    setIsTyping(false);

    fetch(`/api/ai-answer?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
        // Start typing animation
        if (result.answer) {
          setIsTyping(true);
          let i = 0;
          const text = result.answer;
          const interval = setInterval(() => {
            i += 3;
            if (i >= text.length) {
              setDisplayedText(text);
              setIsTyping(false);
              clearInterval(interval);
            } else {
              setDisplayedText(text.substring(0, i));
            }
          }, 8);
          return () => clearInterval(interval);
        }
      })
      .catch(() => setLoading(false));
  }, [query]);

  const copyAnswer = () => {
    if (data?.answer) {
      navigator.clipboard.writeText(data.answer.replace(/[#*>`]/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/## (.*)/g, '<h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/> \*(.*?)\*/g, '<blockquote class="border-l-3 border-blue-400 pl-3 my-3 text-gray-500 dark:text-gray-400 italic text-sm">$1</blockquote>')
      .replace(/^\d+\. /gm, (match) => `<span class="text-blue-500 font-semibold">${match}</span>`)
      .replace(/\n/g, '<br/>');
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/50 p-5 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <span className="font-semibold text-gray-800 dark:text-white">KVR AI</span>
            <span className="text-xs text-gray-500 ml-2">Generating answer...</span>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${100 - i * 15}%` }} />
          ))}
        </div>
      </motion.div>
    );
  }

  if (!data?.answer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-blue-50 via-purple-50/50 to-pink-50/30 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-pink-950/10 rounded-2xl border border-blue-100 dark:border-blue-900/50 overflow-hidden mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <span className="font-semibold text-gray-800 dark:text-white">KVR AI Answer</span>
            {isTyping && (
              <span className="ml-2 text-xs text-blue-500 animate-pulse">● Typing...</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={copyAnswer}
            className="p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/50 text-gray-400 hover:text-gray-600 transition-colors"
            title="Copy answer"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/50 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div className="p-4 pt-3">
          <div
            className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 prose-sm"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(displayedText) }}
          />

          {/* Sources */}
          {data.sources.length > 0 && !isTyping && (
            <div className="mt-4 pt-3 border-t border-blue-100 dark:border-blue-900/30">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Sources</p>
              <div className="flex flex-wrap gap-2">
                {data.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-sm"
                  >
                    {source.favicon && (
                      <img src={source.favicon} alt="" className="w-3.5 h-3.5 rounded" />
                    )}
                    <span className="truncate max-w-[120px]">{source.siteName || source.title.split(' | ')[0]}</span>
                    <ExternalLink size={10} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Questions */}
          {data.followUpQuestions.length > 0 && !isTyping && (
            <div className="mt-4 pt-3 border-t border-blue-100 dark:border-blue-900/30">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-1">
                <MessageSquare size={12} /> Follow-up questions
              </p>
              <div className="grid gap-1.5">
                {data.followUpQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => router.push(`/search?q=${encodeURIComponent(q)}`)}
                    className="text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-white/60 dark:hover:bg-gray-700/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span className="text-blue-400 dark:text-blue-600 text-xs">→</span>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
