
import { useState, useEffect } from 'react';
import { storageManager } from '../storage';
import { toast } from 'sonner';
import { UserSettings } from '../types';

export const useCurrency = () => {
  const [settings, setSettings] = useState<UserSettings>(storageManager.getSettings());
  const availableCurrencies = ['USD', 'EUR', 'ILS'];
  
  useEffect(() => {
    // Initialize with stored settings
    const storedSettings = storageManager.getSettings();
    setSettings(storedSettings);
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
    // Format with currency code instead of symbol
    const formattedNumber = new Intl.NumberFormat(navigator.language || 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    
    return `${formattedNumber} ${settings.currency}`;
  };

  return {
    currency: settings.currency,
    setCurrency,
    availableCurrencies,
    formatCurrency
  };
};
