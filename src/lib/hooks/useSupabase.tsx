
import { useState, useEffect } from 'react';
import { storageManager } from '../storage';
import { toast } from 'sonner';
import { setSupabaseCredentials, clearSupabaseCredentials } from '../supabaseClient';
import { testConnection } from '../remoteSync';

export const useSupabase = () => {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(
    storageManager.isConnectedToSupabase()
  );
  
  useEffect(() => {
    setIsSupabaseConnected(storageManager.isConnectedToSupabase());
  }, []);
  
  const connectToSupabase = async (url: string, anonKey: string) => {
    try {
      // Save credentials and verify connection
      setSupabaseCredentials(url, anonKey);
      const result = await testConnection();
      if (!result.ok) throw result.error || new Error('Connection failed');

      // Connect and sync existing local data
      storageManager.connectToSupabase(true);
      setIsSupabaseConnected(true);
      const transactions = storageManager.getTransactions();
      const budgets = storageManager.getBudgets();
      const categories = storageManager.getCategories();
      if (transactions.length > 0) storageManager.saveTransactions(transactions);
      if (budgets.length > 0) storageManager.saveBudgets(budgets);
      if (categories.length > 0) storageManager.saveCategories(categories);
      toast.success('Connected to Supabase successfully');
    } catch (e) {
      clearSupabaseCredentials();
      toast.error('Failed to connect. Check URL and anon key.');
      throw e;
    }
  };

  const disconnectFromSupabase = async () => {
    storageManager.connectToSupabase(false);
    clearSupabaseCredentials();
    setIsSupabaseConnected(false);
    toast.success('Disconnected from Supabase');
  };

  return {
    isSupabaseConnected,
    connectToSupabase,
    disconnectFromSupabase
  };
};
