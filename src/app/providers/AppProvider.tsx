import React from 'react';
import { AuthProvider } from '../../hooks/useAuth';
import { NavigationProvider } from '../../hooks/useNavigation';
import { CurrentPodcastProvider } from '../../hooks/useCurrentPodcast'; // ← Adicione esta importação

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <CurrentPodcastProvider> {/* ← Adicione este provider */}
      <AuthProvider>
        <NavigationProvider>
          {children}
        </NavigationProvider>
      </AuthProvider>
    </CurrentPodcastProvider>
  );
};