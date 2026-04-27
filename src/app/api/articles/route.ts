import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/articles';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  const allArticles = getArticles();

  const paginatedArticles = allArticles.slice(skip, skip + limit);
  const hasMore = skip + limit < allArticles.length;

  return NextResponse.json({ articles: paginatedArticles, hasMore });
}
