'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const BrandColorsContext = createContext({
  brandColors: {
    primary: '#00C896',
    secondary: '#00E5AD',
    accent: '#00C896',
  },
  setBrandColors: () => {},
  isLoading: false,
});

export const BrandColorsProvider = ({ children, initialColors = null }) => {
  const [brandColors, setBrandColors] = useState(
    initialColors || {
      primary: '#00C896',
      secondary: '#00E5AD',
      accent: '#00C896', 
    }
  );
  const [isLoading, setIsLoading] = useState(false);

  // Update colors if initialColors changes (for agency booking page)
  useEffect(() => {
    if (initialColors) {
      setBrandColors(initialColors);
    }
  }, [initialColors]);

  return (
    <BrandColorsContext.Provider
      value={{ brandColors, setBrandColors, isLoading }}
    >
      {children}
    </BrandColorsContext.Provider>
  );
};

export const useBrandColors = () => {
  const context = useContext(BrandColorsContext);
  if (!context) {
    throw new Error('useBrandColors must be used within BrandColorsProvider');
  }
  return context;
};