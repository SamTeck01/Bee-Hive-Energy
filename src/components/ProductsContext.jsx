import { createContext, useEffect, useState } from 'react';
import { useLoading } from './LoadingContext.jsx';

export const ProductsContext = createContext([]);

// eslint-disable-next-line react/prop-types
export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://bee-energy-backend.onrender.com/api/products");
        const data = await response.json();
        setProducts(data); 
        console.log('Products fetched successfully:', data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [setIsLoading]);

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};
