
import { useState, useEffect } from 'react';
import { storageManager } from '../storage';
import { toast } from 'sonner';
import { setSupabaseCredentials, clearSupabaseCredentials, getSupabaseClient } from '../supabaseClient';
import { testConnection, SETUP_SQL } from '../remoteSync';
import { writeToClipboard } from '../browserUtils';

export const useSupabase = () => {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(
    storageManager.isConnectedToSupabase()
  );
  
  useEffect(() => {
    setIsSupabaseConnected(storageManager.isConnectedToSupabase());
  }, []);
  
  const connectToSupabase = async (url: string, anonKey: string) => {
    try {
      // Validate credentials format
      if (!url.includes('supabase.co') && !url.includes('localhost')) {
        throw new Error('Invalid Supabase URL format');
      }
      
      if (!anonKey || anonKey.length < 50) {
        throw new Error('Invalid anon key format');
      }

      // Save credentials first
      setSupabaseCredentials(url, anonKey);

      // Test the connection
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Failed to create Supabase client');
      }

      // Try a simple query to test connection
      try {
        const { error } = await client.from('transactions').select('count').limit(1);
        if (error && !error.message.includes('relation "transactions" does not exist')) {
          throw error;
        }
      } catch (connectionError: any) {
        // If it's a table missing error, that's fine - we'll handle setup
        if (!connectionError.message?.includes('relation "transactions" does not exist')) {
          throw connectionError;
        }
      }

      // Connect and sync existing local data
      storageManager.connectToSupabase(true);
      setIsSupabaseConnected(true);
      
      // Upload existing data
      const transactions = storageManager.getTransactions();
      const budgets = storageManager.getBudgets();
      const categories = storageManager.getCategories();
      
      if (transactions.length > 0) storageManager.saveTransactions(transactions);
      if (budgets.length > 0) storageManager.saveBudgets(budgets);
      if (categories.length > 0) storageManager.saveCategories(categories);

      // Test table existence again after sync
      const tableTestResult = await testConnection().catch(() => ({ ok: false }));

      if (tableTestResult.ok) {
        toast.success('Connected to Supabase successfully! All tables are ready.');
      } else {
        // Tables are missing, provide setup SQL
        const success = await writeToClipboard(SETUP_SQL);
        if (success) {
          toast.warning('Connected, but database tables are missing. Setup SQL copied to clipboard - paste it in your Supabase SQL editor.', {
            duration: 8000
          });
        } else {
          toast.warning('Connected, but database tables are missing. Check console for setup SQL.', {
            duration: 8000
          });
          console.info('[Supabase Setup SQL - Copy this to your SQL Editor]\n', SETUP_SQL);
        }
      }
    } catch (e: any) {
      clearSupabaseCredentials();
      storageManager.connectToSupabase(false);
      setIsSupabaseConnected(false);
      
      const errorMessage = e.message || 'Unknown error';
      if (errorMessage.includes('Invalid')) {
        toast.error(`Connection failed: ${errorMessage}`);
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        toast.error('Network error: Check your internet connection and Supabase URL.');
      } else {
        toast.error('Failed to connect to Supabase. Verify your credentials and try again.');
      }
      
      console.error('Supabase connection error:', e);
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
