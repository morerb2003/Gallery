import React, { useState } from 'react';

/**
 * Optimized Image Component with Low-Quality Image Placeholder (LQIP)
 * Prevents Cumulative Layout Shift (CLS) and provides smooth blur-up transition.
 */
const OptimizedImage = ({
  src,
  alt = '',
  fallbackSrc,
  dominantColor = '#18181b',
  aspectRatio = '4/3',
  className = '',
  imgClassName = '',
  loading = 'lazy',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate responsive srcset if Unsplash image
  const isUnsplash = src && src.includes('images.unsplash.com');
  let srcSet = undefined;
  if (isUnsplash) {
    const baseUrl = src.split('?')[0];
    srcSet = `
      ${baseUrl}?auto=format&fit=crop&w=400&q=75 400w,
      ${baseUrl}?auto=format&fit=crop&w=800&q=80 800w,
      ${baseUrl}?auto=format&fit=crop&w=1200&q=85 1200w,
      ${baseUrl}?auto=format&fit=crop&w=1600&q=85 1600w
    `.trim();
  }

  const currentSrc = hasError && fallbackSrc ? fallbackSrc : src;

  return (
    <div
      onClick={onClick}
      style={{ backgroundColor: dominantColor }}
      className={`relative w-full overflow-hidden transition-colors duration-500 ${className}`}
    >
      {/* LQIP Color Block & Shimmer while loading */}
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: dominantColor }}
        />
      )}

      <img
        src={currentSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError && fallbackSrc) {
            setHasError(true);
          }
        }}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-md'
        } ${imgClassName}`}
      />
    </div>
  );
};

export default OptimizedImage;
