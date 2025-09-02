/* eslint-disable react/prop-types */
// PlansContext.js
import { createContext, useEffect, useState } from 'react';

export const PlansContext = createContext([]);

export const PlansProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
        try {
            const response = await fetch("https://bee-energy-backend.onrender.com/api/plans");
            const data = await response.json();
            setPlans(data); // adjust if data format is different
            console.log('Plans fetched successfully:', data);
        } catch (error) {
            console.error('Failed to fetch plans:', error, 'Reloading...');
            fetchPlans();
        }
    };
    fetchPlans();
  }, []);

  return (
    <PlansContext.Provider value={{ plans, setPlans }}>
      {children}
    </PlansContext.Provider>
  );
};
