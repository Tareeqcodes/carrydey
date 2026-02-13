'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const BrandColorsContext = createContext({
  brandColors: {
    primary: '#3A0A21',
    secondary: '#5A1A41',
    accent: '#8B2E5A',
  },
  setBrandColors: () => {},
  isLoading: false,
});

export const BrandColorsProvider = ({ children, initialColors = null }) => {
  const [brandColors, setBrandColors] = useState(
    initialColors || {
      primary: '#3A0A21',
      secondary: '#5A1A41',
      accent: '#8B2E5A',
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