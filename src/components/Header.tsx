'use client';

import { useState } from 'react';
import Link from 'next/link';
import Search from './Search';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <main style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1040px', margin: '0 auto', padding: '0 1.5rem' }}>
        <Link href="/" className="logo">AutoBlogSite<span style={{ color: '#1a8917' }}>.com</span></Link>
        
        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <nav style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
             <Link href="/" className="nav-link">Home</Link>
             <Link href="/about" className="nav-link">About</Link>
             <Link href="/privacy" className="nav-link">Privacy</Link>
          </nav>
          <Search />
        </div>

        {/* Mobile Burger Icon */}
        <button 
          className="mobile-burger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px', display: 'none' }}
        >
          <div style={{ width: '24px', height: '2px', background: '#000', marginBottom: '5px', transition: '0.3s', transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : '' }}></div>
          <div style={{ width: '24px', height: '2px', background: '#000', marginBottom: '5px', opacity: isMenuOpen ? 0 : 1 }}></div>
          <div style={{ width: '24px', height: '2px', background: '#000', transition: '0.3s', transform: isMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : '' }}></div>
        </button>
      </main>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem', alignItems: 'center' }}>
          <Link href="/" className="nav-link" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.2rem' }}>Home</Link>
          <Link href="/about" className="nav-link" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.2rem' }}>About</Link>
          <Link href="/privacy" className="nav-link" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.2rem' }}>Privacy</Link>
          <div style={{ marginTop: '1rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Search />
          </div>
        </nav>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-burger {
            display: block !important;
          }
          .mobile-menu {
            display: block;
            position: absolute;
            top: 75px;
            left: 0;
            right: 0;
            background: #fff;
            border-bottom: 1px solid #eee;
            overflow: hidden;
            max-height: 0;
            transition: max-height 0.3s ease-in-out;
            z-index: 999;
          }
          .mobile-menu.open {
            max-height: 400px;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
