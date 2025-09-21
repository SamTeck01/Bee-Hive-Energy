import {createContext, useEffect, useState, useCallback} from 'react';
import config from '../config/environment.js';

export const ProductsCategoryContext = createContext([]);

// eslint-disable-next-line react/prop-types
export const ProductsCategoryProvider = ({ children }) => {
    const [productsCategory, setProductsCategory] = useState([]);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const API_URL = 'https://app.nocodb.com/api/v2/tables/meh0l4dpmve5ky4/records?offset=0&limit=25&where=&viewId=vwyl7z11yxn2foxg';

    const fetchProductsCategory = useCallback(async (isRetry = false) => {
        try {
            setError(null);
            
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'xc-token': 'mqtJCDv1JtwM_2rl7m3kKRqCkwojiUKq_RlrWCxr' // 🔐 Include this if your data needs auth
                },
                // Add timeout
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Validate data structure
            if (!data || !Array.isArray(data.list)) {
                throw new Error('Invalid data format received from API');
            }

            setProductsCategory(data.list);
            setRetryCount(0); // Reset retry count on success
            console.log('Product categories fetched successfully:', data.list);
        } catch (error) {
            console.error('Failed to fetch products category:', error);
            
            const errorMessage = error.name === 'AbortError' 
                ? 'Request timed out. Please check your connection.'
                : error.message || 'Failed to fetch product categories. Please try again.';
            
            setError(errorMessage);
            
            // Auto-retry logic (max 3 retries)
            if (!isRetry && retryCount < 3) {
                const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                    fetchProductsCategory(true);
                }, delay);
            }
        }
    }, [API_URL, retryCount]);

    const retryFetch = () => {
        setRetryCount(0);
        fetchProductsCategory();
    };

    useEffect(() => {
        fetchProductsCategory();
    }, [fetchProductsCategory]);

    const contextValue = {
        productsCategory,
        setProductsCategory,
        error,
        retryFetch,
        isLoading: retryCount > 0
    };

    return (
        <ProductsCategoryContext.Provider value={contextValue}>
            {children}
        </ProductsCategoryContext.Provider>
    );
}