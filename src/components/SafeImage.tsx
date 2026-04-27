'use client';

import { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export default function SafeImage({ 
  src, 
  alt, 
  fallback = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80", 
  className,
  style 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={hasError ? fallback : imgSrc}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
    />
  );
}
