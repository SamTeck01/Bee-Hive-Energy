import { createContext, useEffect, useState, useCallback } from 'react';
import { useLoading } from './LoadingContext.jsx';
import config from '../config/environment.js';

export const ProductsContext = createContext([]);

// eslint-disable-next-line react/prop-types
export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { setIsLoading } = useLoading();

  // IMPORTANT: Stable, production-safe API base with an env override.
  // We first try Vite env (VITE_API_URL), then config file, then fall back
  // to the known-good hosted backend. This guarantees we always have a URL
  // even if env vars are missing in a build.
  const API_BASE = (import.meta.env?.VITE_API_URL
    // Use value from centralized config if present
    ?? config?.API_URL
    // FINAL HARDCODED FALLBACK (safe default)
    ?? 'https://bee-energy-backend.onrender.com/api');

  // Final endpoint we will call
  const API_URL = `${API_BASE}/products`;

  const fetchProducts = useCallback(async (isRetry = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // NOTE: Avoid using AbortSignal.timeout(...) since some browsers/environments
      // don't support it and it can break fetches completely.
      // Keep the request simple and reliable.
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate data structure
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from API');
      }

      setProducts(data); 
      setRetryCount(0); // Reset retry count on success
      console.log('Products fetched successfully:', data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      
      const errorMessage = error.name === 'AbortError' 
        ? 'Request timed out. Please check your connection.'
        : error.message || 'Failed to fetch products. Please try again.';
      
      setError(errorMessage);
      
      // Auto-retry logic (max 3 retries)
      if (!isRetry && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchProducts(true);
        }, delay);
      }
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, setIsLoading, retryCount]);

  const retryFetch = () => {
    setRetryCount(0);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const contextValue = {
    products,
    setProducts,
    error,
    retryFetch,
    isLoading: retryCount > 0
  };

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};
