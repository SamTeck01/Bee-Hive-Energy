import { createContext, useEffect, useState } from 'react';

export const ProductsContext = createContext([]);

// eslint-disable-next-line react/prop-types
export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://bee-energy-backend.onrender.com/api/products");
        const data = await response.json();
        setProducts(data); 
        console.log('Products fetched successfully:', data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};
