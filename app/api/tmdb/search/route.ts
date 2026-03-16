import { NextRequest, NextResponse } from 'next/server';
import { searchMovies } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query');

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [], total_results: 0 });
  }

  try {
    const data = await searchMovies(query);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to search movies' },
      { status: 500 },
    );
  }
}
