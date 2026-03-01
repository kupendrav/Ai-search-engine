import { NextRequest, NextResponse } from 'next/server';
import { generateImageResults } from '@/lib/searchEngine';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  if (!query.trim()) {
    return NextResponse.json({ results: [], query: '' });
  }

  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 400));
  const results = generateImageResults(query);

  return NextResponse.json({ results, query });
}
