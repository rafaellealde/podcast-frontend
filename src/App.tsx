import React from 'react';
import { AppProvider } from './app/providers/AppProvider';
import AppRouter from './app/router/AppRouter';

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};

export default App;