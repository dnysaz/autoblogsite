'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 3) {
      const fetchResults = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setResults(data);
        } catch (err) {
          console.error('Search failed', err);
        } finally {
          setIsLoading(false);
        }
      };
      const timeoutId = setTimeout(fetchResults, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', background: '#f9f9f9', borderRadius: '99px', padding: '4px 12px', border: '1px solid #eee' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            autoFocus
            type="text"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: '6px 8px', 
              fontSize: '0.9rem', 
              outline: 'none',
              width: '180px'
            }}
            className="search-input-field"
          />
          <button 
            onClick={() => { setIsOpen(false); setQuery(''); }}
            style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px' }}
          >
            ×
          </button>
        </div>
      )}

      {results.length > 0 && isOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          right: 0, 
          width: 'min(90vw, 320px)', 
          background: '#fff', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
          borderRadius: '12px', 
          marginTop: '12px',
          border: '1px solid #f2f2f2',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {results.map((article) => (
            <Link 
              key={article.slug} 
              href={`/blog/${article.slug}`}
              onClick={() => { setIsOpen(false); setQuery(''); }}
              style={{ 
                display: 'block', 
                padding: '12px 16px', 
                textDecoration: 'none', 
                color: 'inherit',
                borderBottom: '1px solid #f9f9f9'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#1a8917', fontWeight: 600, marginBottom: '2px' }}>{article.category}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.2 }}>{article.title}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
