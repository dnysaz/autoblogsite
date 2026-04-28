import Header from '@/components/Header';
import Link from 'next/link';
import { getArticles } from '@/lib/articles';

export default function HowItWorks() {
  const allArticles = getArticles();

  return (
    <div>
      <Header />

      <main className="main-grid">
        <article className="reader-container" style={{ margin: '0', maxWidth: '100%' }}>
          <Link href="/" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            ← Home
          </Link>
          <h1 className="article-title">How AutoBlogSite.com Works</h1>
          
          <div className="info-page-body">
            <p>Ever wondered how a website can write, illustrate, and publish its own news 24/7 without any human intervention? Here is the breakdown of the high-tech engine powering <strong>AutoBlogSite.com</strong>.</p>
            
            <h2>The Tech Stack</h2>
            <p>We believe in using the most efficient and modern tools available. Our architecture is built on four main pillars:</p>
            <ul>
              <li><strong>Framework:</strong> Next.js 15+ (App Router). We use static generation for near-instant page loads.</li>
              <li><strong>AI Engine:</strong> DeepSeek-V3 API. A state-of-the-art language model that handles all content creation.</li>
              <li><strong>Automation:</strong> GitHub Actions. This acts as our "cloud robot" that triggers every hour.</li>
              <li><strong>Hosting:</strong> Vercel. A serverless platform that automatically redeploys our site whenever new content is pushed.</li>
            </ul>
            
            <h2>The Automation Logic</h2>
            <p>The magic happens in a precise 5-step cycle that repeats indefinitely:</p>
            <ol>
              <li><strong>Trigger:</strong> GitHub Actions wakes up every hour based on a "cron schedule".</li>
              <li><strong>Synthesis:</strong> Our custom script scans the existing database of articles. It identifies what has already been written to ensure internal linking and avoid duplication.</li>
              <li><strong>Generation:</strong> The script sends a high-level prompt to DeepSeek. It asks the AI to write an 800+ word article, pick a relevant Unsplash image, and naturally link to 2-3 previous articles.</li>
              <li><strong>Persistence:</strong> The AI's response is converted into a structured JSON file and saved into a date-based folder (e.g., <code>/articles/28-04-2026/</code>).</li>
              <li><strong>Deployment:</strong> GitHub "pushes" this new file to the repository. Vercel detects the change and builds a fresh version of the site in seconds.</li>
            </ol>

            <h2>Why This is Different</h2>
            <p>Unlike traditional automated blogs that "scrape" content from others, our AI generates original insights and maintains a coherent internal structure. By using a "Serverless" and "Static" approach, we eliminate the need for expensive databases and slow servers.</p>
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
              A perfect synergy of AI, Automation, and Modern Web Performance.
            </p>
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
