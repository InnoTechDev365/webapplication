
import { useState, useEffect } from 'react';
import { storageManager } from '../storage';
import { toast } from 'sonner';
import { setSupabaseCredentials, clearSupabaseCredentials } from '../supabaseClient';
import { testConnection, SETUP_SQL } from '../remoteSync';

export const useSupabase = () => {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(
    storageManager.isConnectedToSupabase()
  );
  
  useEffect(() => {
    setIsSupabaseConnected(storageManager.isConnectedToSupabase());
  }, []);
  
  const connectToSupabase = async (url: string, anonKey: string) => {
    try {
      // Save credentials first
      setSupabaseCredentials(url, anonKey);

      // Try connection check, but don't block if tables are missing
      const result = await testConnection().catch((err) => ({ ok: false, error: err }));

      // Connect and sync existing local data regardless; if tables missing we'll guide the user
      storageManager.connectToSupabase(true);
      setIsSupabaseConnected(true);
      const transactions = storageManager.getTransactions();
      const budgets = storageManager.getBudgets();
      const categories = storageManager.getCategories();
      if (transactions.length > 0) storageManager.saveTransactions(transactions);
      if (budgets.length > 0) storageManager.saveBudgets(budgets);
      if (categories.length > 0) storageManager.saveCategories(categories);

      if (result.ok) {
        toast.success('Connected to Supabase successfully');
      } else {
        // Likely new project without tables yet
        try {
          await navigator.clipboard?.writeText(SETUP_SQL);
          toast.warning('Connected, but tables missing. SQL to set them up was copied. Run it in your project SQL editor.');
        } catch {
          toast.warning('Connected, but tables missing. Open console to copy setup SQL.');
        }
        console.info('[Supabase setup SQL]\n', SETUP_SQL);
      }
    } catch (e) {
      clearSupabaseCredentials();
      storageManager.connectToSupabase(false);
      setIsSupabaseConnected(false);
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
