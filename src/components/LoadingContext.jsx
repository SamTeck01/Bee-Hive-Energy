/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

export const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const value = {
    isLoading,
    setIsLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// Safe hook: returns a no-op setter when provider isn't present so consumers won't crash.
export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    return { isLoading: false, setIsLoading: () => {} };
  }
  return ctx;
};
