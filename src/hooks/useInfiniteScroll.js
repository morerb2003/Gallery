import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for infinite scrolling using IntersectionObserver
 * @param {Function} onLoadMore - Callback triggered when sentinel enters viewport
 * @param {boolean} hasMore - Whether more pages/items exist
 * @param {boolean} isLoading - Whether a page is currently loading
 * @param {string} rootMargin - Intersection observer root margin (default: '200px')
 */
export const useInfiniteScroll = ({
  onLoadMore,
  hasMore = true,
  isLoading = false,
  rootMargin = '300px',
}) => {
  const sentinelRef = useRef(null);

  const handleIntersect = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry && entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [onLoadMore, hasMore, isLoading]
  );

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin,
      threshold: 0.1,
    });

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [handleIntersect, rootMargin]);

  return sentinelRef;
};

export default useInfiniteScroll;
