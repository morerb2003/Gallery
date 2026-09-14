import { useState, useEffect, useCallback } from 'react';

/**
 * Custom Hash Router Hook
 * Encapsulates hash-based routing, deep links (#/photo/:id), query parameters, and history navigation.
 */
export const useHashRouter = () => {
  const parseCurrentHash = useCallback(() => {
    const raw = window.location.hash.replace(/^#\/?/, '');
    const [pathPart, queryPart] = raw.split('?');

    // Parse query params into key-value object
    const queryParams = {};
    if (queryPart) {
      const searchParams = new URLSearchParams(queryPart);
      for (const [key, value] of searchParams.entries()) {
        queryParams[key] = value;
      }
    }

    // Determine page and route params
    let page = 'home';
    let photoId = null;

    if (!pathPart || pathPart === 'home') {
      page = 'home';
    } else if (pathPart.startsWith('photo/')) {
      page = 'photo';
      photoId = pathPart.replace('photo/', '');
    } else if (pathPart === 'gallery' || pathPart.startsWith('gallery')) {
      page = 'gallery';
    } else if (pathPart === 'collections') {
      page = 'collections';
    } else if (pathPart === 'dashboard') {
      page = 'dashboard';
    } else if (pathPart === 'profile') {
      page = 'profile';
    } else {
      page = 'home';
    }

    return { page, photoId, queryParams, rawPath: pathPart };
  }, []);

  const [route, setRoute] = useState(parseCurrentHash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseCurrentHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [parseCurrentHash]);

  /**
   * Programmatic navigation
   * @param {string} page - Target page identifier
   * @param {object|string} params - Query params object or photo ID
   * @param {boolean} replace - Whether to replace history state
   */
  const navigate = useCallback((page, params = {}, replace = false) => {
    let newHash = '';

    if (page === 'photo') {
      const id = typeof params === 'object' ? params.id : params;
      newHash = `#/photo/${id}`;
    } else {
      let queryStr = '';
      if (typeof params === 'object' && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '' && v !== 'all') {
            searchParams.set(k, v);
          }
        });
        const str = searchParams.toString();
        if (str) queryStr = `?${str}`;
      }
      newHash = `#/${page}${queryStr}`;
    }

    if (replace) {
      window.location.replace(newHash);
    } else {
      window.location.hash = newHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /**
   * Updates only query parameters without changing current page
   */
  const updateQueryParams = useCallback((newParams, replace = true) => {
    const currentRaw = window.location.hash.replace(/^#\/?/, '');
    const [pathPart] = currentRaw.split('?');

    const searchParams = new URLSearchParams();
    Object.entries(newParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        searchParams.set(k, v);
      }
    });

    const queryStr = searchParams.toString();
    const newHash = `#/${pathPart || 'gallery'}${queryStr ? `?${queryStr}` : ''}`;

    if (replace) {
      window.history.replaceState(null, '', newHash);
      setRoute((prev) => ({ ...prev, queryParams: newParams }));
    } else {
      window.location.hash = newHash;
    }
  }, []);

  const goBack = useCallback((fallbackPage = 'home') => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate(fallbackPage);
    }
  }, [navigate]);

  return {
    page: route.page,
    photoId: route.photoId,
    queryParams: route.queryParams,
    navigate,
    updateQueryParams,
    goBack,
  };
};

export default useHashRouter;
