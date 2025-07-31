import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { storageManager } from './storage';
import { useCurrency } from './hooks/useCurrency';
import { useSupabaseAlt } from './hooks/useSupabaseAlt';

interface AppContextAltType {
  currency: string;
  setCurrency: (currency: string) => void;
  isSupabaseConnected: boolean;
  isLoading: boolean;
  lastSyncTime: string | null;
  connectToSupabase: () => Promise<void>;
  disconnectFromSupabase: () => Promise<void>;
  syncData: () => Promise<void>;
  availableCurrencies: string[];
  formatCurrency: (amount: number) => string;
}

const AppContextAlt = createContext<AppContextAltType | undefined>(undefined);

export const useAppContextAlt = () => {
  const context = useContext(AppContextAlt);
  if (!context) {
    throw new Error('useAppContextAlt must be used within an AppProviderAlt');
  }
  return context;
};

interface AppProviderAltProps {
  children: ReactNode;
}

export const AppProviderAlt: React.FC<AppProviderAltProps> = ({ children }) => {
  const currencyManager = useCurrency();
  const supabaseManager = useSupabaseAlt();

  return (
    <AppContextAlt.Provider
      value={{
        ...currencyManager,
        ...supabaseManager
      }}
    >
      {children}
    </AppContextAlt.Provider>
  );
};