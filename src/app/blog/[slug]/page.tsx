import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import Header from '@/components/Header';
import CopyButton from '@/components/CopyButton';
import { getArticles } from '@/lib/articles';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const articles = getArticles();
  const article = articles.find((a) => a.slug === slug);

  if (!article) return {};

  const plainText = article.content.replace(/[#*`]/g, '').substring(0, 160).trim() + '...';

  return {
    title: `${article.title} - AutoBlogSite.com`,
    description: plainText,
    openGraph: {
      title: article.title,
      description: plainText,
      images: [article.coverImage],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: ['DeepSeek AI'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: plainText,
      images: [article.coverImage],
    },
  };
}

export async function generateStaticParams() {
  const articles = getArticles();
  return articles.map(article => ({ slug: article.slug }));
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const allArticles = getArticles();
  const article = allArticles.find(a => a.slug === slug);

  if (!article) notFound();

  const cleanContent = article.content.replace(/^#\s+.+\n?/, '');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    image: article.coverImage,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'AutoBlogSite.com AI',
    },
    description: article.excerpt,
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="main-grid">
        <article className="reader-container" style={{ margin: '0', maxWidth: '100%' }}>
          <Link href="/" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            ← Home
          </Link>
          <h1 className="article-title">{article.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f2f2f2' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 500, color: '#242424' }}>AI Writer</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#6b6b6b' }}>
                <span>Published in {article.category}</span>
                <span> · </span>
                <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
            <CopyButton />
          </div>

          <a href={article.coverImage} target="_blank" rel="noopener noreferrer" style={{ cursor: 'zoom-in' }}>
            <SafeImage 
              src={article.coverImage} 
              alt={article.title} 
              style={{ width: '100%', marginBottom: '0.5rem', borderRadius: '4px' }} 
            />
          </a>
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#999', marginBottom: '3rem', fontStyle: 'italic' }}>
            Photo by <a href={article.coverImage} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>{article.coverImageCredit || 'Unsplash Photographer'}</a> on Unsplash
          </div>

          <div className="article-body">
            <ReactMarkdown>{cleanContent}</ReactMarkdown>
          </div>

          <div style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid #f2f2f2' }}>
            <span style={{ background: '#f2f2f2', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.9rem', fontWeight: 500 }}>{article.category}</span>
          </div>
        </article>

        <aside style={{ padding: '0 1rem', borderLeft: '1px solid #f2f2f2', height: 'fit-content', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Picks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {allArticles.slice(0, 5).map(a => (
              <div key={a.slug}>
                <Link href={`/blog/${a.slug}`} className="sidebar-link">{a.title}</Link>
                <div style={{ fontSize: '0.75rem', color: '#6b6b6b', marginTop: '0.25rem' }}>AI Writer in {a.category}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '4rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>🤖 AutoBlogSite.com</h4>
            <p style={{ fontSize: '0.8rem', color: '#6b6b6b', lineHeight: 1.5 }}>
              Every article you read here is generated by Artificial Intelligence (AI Writer) without human intervention.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
               <Link href="/about" className="nav-link">About</Link>
               <Link href="/privacy" className="nav-link">Privacy</Link>
               <Link href="/terms" className="nav-link">Terms</Link>
            </div>
          </div>
        </aside>
      </main>

      <footer style={{ background: '#f9f9f9', marginTop: '5rem', border: 'none' }}>
        <main style={{ maxWidth: '1040px', padding: '4rem 1.5rem' }}>
           <p style={{ fontSize: '0.9rem', color: '#6b6b6b' }}>&copy; {new Date().getFullYear()} AutoBlogSite.com AI Experiment.</p>
        </main>
      </footer>
    </div>
  );
}
