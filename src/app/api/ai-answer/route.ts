import { NextRequest, NextResponse } from 'next/server';
import { generateAIAnswer, generateSearchResults } from '@/lib/searchEngine';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  if (!query.trim()) {
    return NextResponse.json({ answer: null });
  }

  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

  const answer = generateAIAnswer(query);
  const sources = generateSearchResults(query, 1, 4).map(r => ({
    title: r.title.split(' | ')[0],
    url: r.url,
    favicon: r.favicon,
    siteName: r.siteName,
  }));

  const followUpQuestions = [
    `What are the latest developments in ${query}?`,
    `How does ${query} compare to alternatives?`,
    `What are the practical applications of ${query}?`,
    `What do experts say about ${query}?`,
  ];

  return NextResponse.json({
    answer,
    sources,
    followUpQuestions,
    query,
  });
}
