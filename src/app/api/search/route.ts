import { NextRequest, NextResponse } from 'next/server';
import { generateSearchResults } from '@/lib/searchEngine';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const count = parseInt(searchParams.get('count') || '10');

  if (!query.trim()) {
    return NextResponse.json({ results: [], total: 0, query: '' });
  }

  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

  const results = generateSearchResults(query, page, count);
  const total = 1000 + Math.floor(Math.random() * 50000);

  return NextResponse.json({
    results,
    total,
    query,
    page,
    count,
    searchTime: (Math.random() * 0.5 + 0.1).toFixed(2),
  });
}
