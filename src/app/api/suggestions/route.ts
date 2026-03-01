import { NextRequest, NextResponse } from 'next/server';
import { generateSuggestions } from '@/lib/searchEngine';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));

  const suggestions = generateSuggestions(query);

  return NextResponse.json({ suggestions, query });
}
