
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { storageManager } from './storage';
import { useCurrency } from './hooks/useCurrency';
import { useSupabase } from './hooks/useSupabase';

interface AppContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  isSupabaseConnected: boolean;
  connectToSupabase: () => void;
  disconnectFromSupabase: () => void;
  availableCurrencies: string[];
  formatCurrency: (amount: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const currencyManager = useCurrency();
  const supabaseManager = useSupabase();

  return (
    <AppContext.Provider
      value={{
        ...currencyManager,
        ...supabaseManager
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
