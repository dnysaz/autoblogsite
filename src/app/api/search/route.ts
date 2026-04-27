import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/articles';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase();

  if (!query || query.length < 3) {
    return NextResponse.json([]);
  }

  const allArticles = getArticles();
  
  const results = allArticles
    .filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.category.toLowerCase().includes(query)
    )
    .slice(0, 5);

  return NextResponse.json(results);
}
