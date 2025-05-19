
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { UserSettings } from './types';
import { storageManager } from './storage';
import { toast } from 'sonner';

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
  const [settings, setSettings] = useState<UserSettings>(storageManager.getSettings());
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(
    storageManager.isConnectedToSupabase()
  );
  
  const availableCurrencies = ['USD', 'EUR', 'ILS'];

  useEffect(() => {
    // Initialize with stored settings
    const storedSettings = storageManager.getSettings();
    setSettings(storedSettings);
    setIsSupabaseConnected(storageManager.isConnectedToSupabase());
  }, []);

  const setCurrency = (currency: string) => {
    if (!availableCurrencies.includes(currency)) {
      toast.error('Invalid currency selected');
      return;
    }
    
    storageManager.setCurrency(currency);
    setSettings({ ...settings, currency });
    toast.success(`Currency changed to ${currency}`);
  };

  const formatCurrency = (amount: number): string => {
    const formatter = new Intl.NumberFormat(navigator.language || 'en-US', {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(amount);
  };

  const connectToSupabase = () => {
    // Connect to Supabase and sync existing local data
    storageManager.connectToSupabase(true);
    setIsSupabaseConnected(true);
    
    // Sync all local data to Supabase
    const transactions = storageManager.getTransactions();
    const budgets = storageManager.getBudgets();
    const categories = storageManager.getCategories();
    
    if (transactions.length > 0) storageManager.saveTransactions(transactions);
    if (budgets.length > 0) storageManager.saveBudgets(budgets);
    if (categories.length > 0) storageManager.saveCategories(categories);
    
    toast.success('Connected to Supabase successfully');
  };

  const disconnectFromSupabase = () => {
    storageManager.connectToSupabase(false);
    setIsSupabaseConnected(false);
    toast.success('Disconnected from Supabase');
  };

  return (
    <AppContext.Provider
      value={{
        currency: settings.currency,
        setCurrency,
        isSupabaseConnected,
        connectToSupabase,
        disconnectFromSupabase,
        availableCurrencies,
        formatCurrency
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
