'use client';

import { useState } from 'react';

export default function CopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      style={{ 
        background: '#f2f2f2', 
        border: 'none', 
        padding: '0.4rem 0.8rem', 
        borderRadius: '99px', 
        fontSize: '0.8rem', 
        fontWeight: 500,
        cursor: 'pointer',
        color: '#242424',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        transition: 'all 0.2s'
      }}
    >
      {copied ? (
        <>
          <span style={{ color: '#1a8917' }}>✓</span> Copied!
        </>
      ) : (
        <>
          <span>🔗</span> Copy link
        </>
      )}
    </button>
  );
}
