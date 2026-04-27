'use client';

import { useState } from 'react';
import Link from 'next/link';
import SafeImage from './SafeImage';
import { Article } from '@/lib/articles';

interface ArticleFeedProps {
  initialArticles: Article[];
  initialHasMore: boolean;
}

export default function ArticleFeed({ initialArticles, initialHasMore }: ArticleFeedProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    try {
      const res = await fetch(`/api/articles?page=${nextPage}&limit=10`);
      const data = await res.json();
      setArticles([...articles, ...data.articles]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error('Failed to load more articles', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="feed-container">
      {articles.map((article) => (
        <Link href={`/blog/${article.slug}`} key={article.slug} className="post-item">
          <div className="post-content">
              <div className="post-meta">
                {article.isPinned && (
                  <span style={{ color: '#1a8917', fontWeight: 800, marginRight: '0.5rem' }}>📌 Featured</span>
                )}
                <span className="author-name">AI Writer</span>
                <span className="post-date">in {article.category}</span>
                <span className="post-date">·</span>
                <span className="post-date">
                  {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            <h2 className="post-title">{article.title}</h2>
            <p className="post-excerpt">{article.excerpt}</p>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '1rem' }}>
              <span style={{ background: '#f2f2f2', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.8rem', color: '#242424' }}>{article.category}</span>
            </div>
          </div>
          <SafeImage src={article.coverImage} alt={article.title} className="post-thumbnail" />
        </Link>
      ))}

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button 
            onClick={loadMore}
            disabled={isLoading}
            style={{ 
              background: '#fff', 
              border: '1px solid #000', 
              padding: '0.6rem 1.5rem', 
              borderRadius: '99px', 
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              opacity: isLoading ? 0.5 : 1,
              color: '#000'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#1a8917';
              e.currentTarget.style.color = '#1a8917';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#000';
              e.currentTarget.style.color = '#000';
            }}
          >
            {isLoading ? 'Loading...' : 'Load more stories'}
          </button>
        </div>
      )}
    </section>
  );
}
