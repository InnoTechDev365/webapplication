
import { useState, useEffect } from 'react';
import { storageManager } from '../storage';
import { toast } from 'sonner';

export const useSupabase = () => {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(
    storageManager.isConnectedToSupabase()
  );
  
  useEffect(() => {
    setIsSupabaseConnected(storageManager.isConnectedToSupabase());
  }, []);
  
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

  return {
    isSupabaseConnected,
    connectToSupabase,
    disconnectFromSupabase
  };
};
