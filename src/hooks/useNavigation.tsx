import React, { useState, createContext, useContext, type ReactNode } from 'react';

export type Page = 'home' | 'podcasts' | 'playback' | 'login' | 'register' | 'admin';

interface NavigationContextType {
  currentPage: Page;
  navigateTo: (page: Page) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const value = { currentPage, navigateTo };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
